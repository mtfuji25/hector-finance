import { generate } from "generate-password";
import express, { Router } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import methodOverride from "method-override";
import mongoose from "mongoose";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import jwt from "jsonwebtoken";
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";
import restify from "express-restify-mongoose";
import moment from "moment";

import models, { Plan, User, UserType, UserDevice, UserSubscription } from "./models";
import { encryptPassword } from "./models/user";

import { getCredit } from "./utils/user.util";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/blackout";
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, poolSize: 4 });

// Serialization, required when custom callback is used
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// Validate user login
passport.use(
    new LocalStrategy({ usernameField: "email" }, async (email, password, done) => {
        try {
            const user = await User.findOne({ email });
            if (!user) {
                throw new Error("User not found!");
            }

            const isMatch = await (user as any).comparePassword(password);
            if (!isMatch) {
                throw new Error("Invalid credentails!");
            }

            if (!(user as any).approved) {
                throw new Error("Your account has been disabled, please contact the administrator.");
            }

            done(null, user);
        } catch (err) {
            done(err);
        }
    }),
);

// Validate jwt
const secretOrKey = "i9mX6vEXlhko0L2R";
passport.use(
    new JWTStrategy(
        {
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey,
        },
        async (jwtPayload, done) => {
            try {
                const user = await User.findOne({ email: jwtPayload, approved: true });
                if (!user) {
                    throw new Error("User not found!");
                }
                done(null, user);
            } catch (err) {
                done(err);
            }
        },
    ),
);

// Initialize express
const app = express();
app.use(
    cors({
        exposedHeaders: ["X-Total-Count"],
    }),
);
app.use(bodyParser.json());
app.use(methodOverride());
app.use(passport.initialize());

// Signup
app.post("/signup", async (req, res, next) => {
    try {
        await User.create({ ...req.body, approved: true });
        res.json({ success: true });
    } catch (err) {
        next(err);
    }
});

// Login
const loginPath = "/login";
const unauthorizedError = () => new Error("Unauthorized");
app.post(
    loginPath,
    passport.authenticate("local", { session: false, failureRedirect: loginPath }),
    async (req, res, next) => {
        try {
            const user = req.user as any;
            const token = `Bearer ${jwt.sign(user.email, secretOrKey)}`;
            res.json({ token });
        } catch (err) {
            next(err);
        }
    },
);
app.get(loginPath, (req, res, next) => next(unauthorizedError()));

// All following middlewares need jwt authentication
const deviceToken = "device-token";
app.use((req, res, next) => {
    passport.authenticate("jwt", { session: false, failureRedirect: loginPath }, async (err, user) => {
        try {
            // `UserType.Default` are not allowed to login with JWT token
            if (user && (user as any).type === UserType.Default) {
                throw unauthorizedError();
            }

            const token = req.headers[deviceToken];
            if (token) {
                const device = await UserDevice.findOne({ token, approved: true });
                if (device) {
                    user = await User.findById((device as any).user_id);
                }
            }

            if (!user) {
                if (err) {
                    throw err;
                }
                throw unauthorizedError();
            }

            req.logIn(user, logInErr => {
                if (logInErr) {
                    return next(err);
                }
                next();
            });
        } catch (err) {
            next(err);
        }
    })(req, res, next);
});

app.post("/authenticate", async (req, res, next) => {
    try {
        const user = req.user as any;
        const { email } = req.body;

        // Only `UserType.Api` is allowed to authenticate user
        if ((user as any).type !== UserType.Api) {
            throw unauthorizedError();
        }

        let currentUser = await User.findOne({ email });
        if (!currentUser) {
            currentUser = await User.create({
                email,
                password: generate({ length: 16, numbers: true }),
                approved: true,
            });
        }

        const credit = await getCredit(currentUser);
        const token = req.headers[deviceToken];
        let device = await UserDevice.findOne({ user_id: currentUser.id, token });

        if (!device) {
            const count = await UserDevice.count({ user_id: currentUser.id });
            device = await UserDevice.create({
                ...req.body,
                token,
                user_id: currentUser.id,
                approved: count < credit.device_max,
            });
        }

        if (!(device as any).approved) {
            throw new Error("You are not authorized to use the application on this device.");
        }

        res.json({ success: true });
    } catch (err) {
        next(err);
    }
});

// Invalidate
app.post("/invalidate", async (req, res, next) => {
    try {
        const user = req.user as any;
        const credit = { success: true, ...(await getCredit(user)) };

        // Find user device for token
        const token = req.headers[deviceToken];
        const device = await UserDevice.findOne({ token });

        // Update device, becomes latest
        const { device_model, device_type, os_name, os_version, app_version } = req.body;
        await device.update({ device_model, device_type, os_name, os_version, app_version });

        // Reject all other devices based on `device_max` value
        const deviceIds = (await UserDevice.find({ user_id: user.id, approved: true })
            .sort({
                updated_at: "desc",
            })
            .skip(credit.device_max)).map(item => item.id);

        if (deviceIds.length) {
            await UserDevice.update({ _id: { $in: deviceIds } }, { approved: false }, { multi: true });
        }

        res.json(credit);
    } catch (err) {
        next(err);
    }
});

// Get profile
const profilePath = "/profile";
app.get(profilePath, (req, res, next) => {
    const { name, email } = req.user as any;
    res.json({ name, email });
});

// Update profile
app.put(profilePath, async (req, res, next) => {
    try {
        const data = req.body;
        const user = req.user as any;

        const userFields = ["name", "email", "password"];
        userFields.forEach(field => {
            if (req.body[field]) {
                user.set(field, data[field]);
            }
        });
        await user.save();

        res.json({ success: true });
    } catch (err) {
        next(err);
    }
});

// Subscribe
app.post("/subscribe", async (req, res, next) => {
    try {
        const user = req.user as any;

        // `UserType.Api` is only allowed to use this end point
        if (user.type !== UserType.Api) {
            throw unauthorizedError();
        }

        const { subscription, email } = req.body;
        let currentUser = await User.findOne({ email });

        // Allow user to be created upon subscribe
        if (!currentUser) {
            currentUser = await User.create({
                email,
                password: generate({ length: 16, numbers: true }),
                approved: true,
            });
        }

        const plan = await Plan.findOne({ wix_id: subscription.planId, approved: true });
        if (!plan) {
            throw new Error("Plan not found!");
        }

        const expiryDate = moment.utc();

        if (subscription.validFor.forever) {
            expiryDate.add(10, "years");
        } else {
            expiryDate.add(
                subscription.validFor.period.amount as any,
                (subscription.validFor.period.unit as string).toLowerCase() as any,
            );
        }

        await UserSubscription.create({
            user_id: currentUser.id,
            plan_id: plan.id,
            wix_id: subscription.id,
            expiry_date: expiryDate.toDate(),
            created_by: user.id,
            updated_by: user.id,
            approved: true,
        });

        res.json({ success: true });
    } catch (err) {
        next(err);
    }
});

// Logout
app.post("/logout", async (req, res, next) => {
    try {
        const user = req.user as any;

        const token = req.headers[deviceToken];
        const device = await UserDevice.findOne({ user_id: user.id, token });
        if (device) {
            await device.remove();
        }

        res.json({ success: true });
    } catch (err) {
        next(err);
    }
});

// Restify
const router = Router();
const adminModels = [Plan.modelName, User.modelName, UserDevice.modelName, UserSubscription.modelName];
restify.defaults({
    version: "",
    runValidators: true,
    totalCountHeader: true,
    preMiddleware: (req, res, next) => {
        if (adminModels.indexOf(req.erm.model.modelName) !== -1 && req.user.type !== UserType.Admin) {
            return next(new Error("You are not authorized to access requested data."));
        }
        next();
    },
    preCreate: (req, res, next) => {
        const data = req.body;
        if (data.approved && req.user.type !== UserType.Admin) {
            data.approved = false;
        }
        switch (req.erm.model) {
            case UserSubscription:
                data.created_by = (req.user as any).id;
                break;
        }
        next();
    },
    preUpdate: async (req, res, next) => {
        try {
            const doc = await req.erm.model.findById(req.params.id);
            if (doc) {
                if (doc.approved && req.user.type !== UserType.Admin) {
                    throw new Error("You are not authorized to update requested document.");
                }
                switch (req.erm.model) {
                    case User:
                        // If model is user and password is modified then hash the password on body
                        if (req.body.password && doc.password !== req.body.password) {
                            req.body.password = await encryptPassword(req.body.password);
                        }
                        break;
                    case UserSubscription:
                        if (req.body.deleted) {
                            throw new Error("User subscription can not be deleted, reject instead.");
                        }
                        if (!req.body.comments) {
                            throw new Error("Comments must be added when modifying user subscription.");
                        }
                        Object.assign(req.body, {
                            expiry_date: doc.expiry_date,
                            created_by: doc.created_by,
                            updated_by: (req.user as any).id,
                        });
                        break;
                }
            }
            next();
        } catch (err) {
            next(err);
        }
    },
    preDelete: async (req, res, next) => {
        const doc = await req.erm.model.findById(req.params.id);
        if (doc && doc.approved && req.user.type !== UserType.Admin) {
            return next(new Error("You are not authorized to delete requested document."));
        }
        switch (req.erm.model) {
            case UserSubscription:
                throw new Error("User subscription can not be deleted, reject instead.");
        }
        next();
    },
});
models.forEach(model => restify.serve(router, model, { lean: false, name: model.modelName.replace(/_/g, "-") }));
app.use(router);

// Global error handler
app.use((err, req, res, next) => {
    res.status(500).json({ name: "Error", message: err.message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import getSchema from "./base";

export enum Type {
    Default = "DEFAULT",
    Admin = "ADMIN",
    Api = "API",
}

export async function encryptPassword(value: string): Promise<string> {
    // generate a salt
    const salt = await bcrypt.genSalt();
    // hash the value using our new salt
    return await bcrypt.hash(value, salt);
}

const UserSchema = getSchema({
    name: { type: Schema.Types.EmptyString },
    email: { type: Schema.Types.String, unique: true, index: true },
    password: { type: Schema.Types.String },
    type: { type: Schema.Types.EmptyString, enum: Object.values(Type), default: Type.Default },
});

UserSchema.pre("save", async function(next) {
    // only hash the password if it has been modified (or is new)
    if (!this.isModified("password")) {
        return next();
    }
    try {
        this.set("password", await encryptPassword(this.get("password")));
        next();
    } catch (err) {
        next(err);
    }
});

UserSchema.methods.comparePassword = function(value: string) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(value, this.get("password"), (err, isMatch) => {
            if (err) {
                return reject(err);
            }
            resolve(isMatch);
        });
    });
};

export default model("users", UserSchema);

import { Schema, model } from "mongoose";
import getSchema from "./base";
import user from "./user";
import plan from "./plan";

export default model(
    "user_subscriptions",
    getSchema({
        user_id: { type: Schema.Types.ObjectId, ref: user.modelName },
        plan_id: { type: Schema.Types.ObjectId, ref: plan.modelName },
        wix_id: { type: Schema.Types.EmptyString },
        expiry_date: { type: Schema.Types.Date },
        comments: { type: Schema.Types.EmptyString },
        created_by: { type: Schema.Types.ObjectId, ref: user.modelName },
        updated_by: { type: Schema.Types.ObjectId, ref: user.modelName },
    }),
);

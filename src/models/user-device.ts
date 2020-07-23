import { Schema, model } from "mongoose";
import getSchema from "./base";
import user from "./user";

export default model(
    "user_devices",
    getSchema({
        token: { type: Schema.Types.String, unique: true, index: true },
        user_id: { type: Schema.Types.ObjectId, ref: user.modelName },
        device_model: { type: Schema.Types.EmptyString },
        device_type: { type: Schema.Types.EmptyString },
        os_name: { type: Schema.Types.EmptyString },
        os_version: { type: Schema.Types.EmptyString },
        app_version: { type: Schema.Types.EmptyString },
    }),
);

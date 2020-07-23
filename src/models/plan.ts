import { Schema, model } from "mongoose";
import getSchema from "./base";

export default model(
    "plans",
    getSchema({
        wix_id: { type: Schema.Types.String, unique: true, index: true },
        description: { type: Schema.Types.EmptyString },
        universe_max: { type: Schema.Types.Number },
        device_max: { type: Schema.Types.Number },
    }),
);

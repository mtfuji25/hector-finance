import { Schema, model } from "mongoose";
import getSchema from "./base";

export default model(
    "snap_styles",
    getSchema({
        name: { type: Schema.Types.EmptyString },
        value: { type: Schema.Types.Number },
    }),
);

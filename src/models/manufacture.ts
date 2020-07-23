import { Schema, model } from "mongoose";
import getSchema from "./base";

export default model(
    "manufactures",
    getSchema({
        name: { type: Schema.Types.EmptyString },
    }),
);

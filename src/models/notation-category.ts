import { Schema, model } from "mongoose";
import getSchema from "./base";

export default model(
    "notation_categories",
    getSchema({
        name: { type: Schema.Types.EmptyString },
    }),
);

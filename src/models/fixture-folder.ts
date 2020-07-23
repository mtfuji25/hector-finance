import { Schema, model } from "mongoose";
import getSchema from "./base";

const modelName = "fixture_folders";
export default model(
    modelName,
    getSchema({
        name: { type: Schema.Types.EmptyString },
        parent_id: { type: Schema.Types.ObjectId, ref: modelName, required: false },
    }),
);

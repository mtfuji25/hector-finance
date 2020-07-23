import { Schema, model } from "mongoose";
import getSchema from "./base";
import manufacture from "./manufacture";
import fixtureFolder from "./fixture-folder";

export default model(
    "fixtures",
    getSchema({
        manufacture_id: { type: Schema.Types.ObjectId, ref: manufacture.modelName },
        name: { type: Schema.Types.EmptyString },
        mode: { type: Schema.Types.EmptyString },
        description: { type: Schema.Types.EmptyString },
        length: { type: Schema.Types.Number },
        multicell: { type: Schema.Types.Boolean },
        cell_length: { type: Schema.Types.Number },
        folder_id: { type: Schema.Types.ObjectId, ref: fixtureFolder.modelName, required: false },
    }),
);

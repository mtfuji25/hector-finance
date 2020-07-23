import { Schema, model } from "mongoose";
import getSchema from "./base";
import notationCategory from "./notation-category";
import snapStyle from "./snap-style";

export default model(
    "notations",
    getSchema({
        category_id: { type: Schema.Types.ObjectId, ref: notationCategory.modelName },
        name: { type: Schema.Types.EmptyString },
        description: { type: Schema.Types.EmptyString },
        snap_style_id: { type: Schema.Types.ObjectId, ref: snapStyle.modelName },
        sequence_min: { type: Schema.Types.Number },
        sequence_max: { type: Schema.Types.Number },
        min: { type: Schema.Types.Number },
        max: { type: Schema.Types.Number },
        default_val: { type: Schema.Types.Number },
        dmx_default_val: { type: Schema.Types.Number },
        increment: { type: Schema.Types.Number, default: 1 },
        is_private: { type: Schema.Types.Boolean },
        keywords: { type: Schema.Types.EmptyString },
    }),
);

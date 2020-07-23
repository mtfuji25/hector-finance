import { Schema, model } from "mongoose";
import getSchema from "./base";
import fixture from "./fixture";

export default model(
    "fixture_channels",
    getSchema({
        fixture_id: { type: Schema.Types.ObjectId, ref: fixture.modelName },
        number: { type: Schema.Types.Number },
        position: { type: Schema.Types.Number, enum: [0, 1] },
        bit: { type: Schema.Types.Number, enum: [8, 16], default: 8 },
        notation: { type: Schema.Types.EmptyString },
        description: { type: Schema.Types.EmptyString },
        inverted: { type: Schema.Types.Boolean },
        user_min: { type: Schema.Types.Number },
        user_max: { type: Schema.Types.Number },
        default_val: { type: Schema.Types.Number },
        dmx_default_val: { type: Schema.Types.Number },
        snap: { type: Schema.Types.Number },
        label: { type: Schema.Types.EmptyString },
    }),
);

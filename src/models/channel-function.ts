import { Schema, model } from "mongoose";
import getSchema from "./base";
import fixtureChannel from "./fixture-channel";

export default model(
    "channel_functions",
    getSchema({
        channel_id: { type: Schema.Types.ObjectId, ref: fixtureChannel.modelName },
        name: { type: Schema.Types.EmptyString },
        description: { type: Schema.Types.EmptyString },
        range_from: { type: Schema.Types.Number },
        range_to: { type: Schema.Types.Number },
        dmx_range_from: { type: Schema.Types.Number, required: false, default: null },
        dmx_range_to: { type: Schema.Types.Number, required: false, default: null },
    }),
);

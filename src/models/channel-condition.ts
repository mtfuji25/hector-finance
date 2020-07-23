import { Schema, model } from "mongoose";
import getSchema from "./base";
import fixtureChannel from "./fixture-channel";

export default model(
    "channel_conditions",
    getSchema({
        channel_id: { type: Schema.Types.ObjectId, ref: fixtureChannel.modelName },
        dependent_channel_id: { type: Schema.Types.ObjectId, ref: fixtureChannel.modelName },
        range_from: { type: Schema.Types.Number },
        range_to: { type: Schema.Types.Number },
    }),
);

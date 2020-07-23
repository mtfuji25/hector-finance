import * as mongoose from "mongoose";

declare module "mongoose" {
    namespace Schema {
        namespace Types {
            class EmptyString extends mongoose.Schema.Types.String {}
        }
    }
}

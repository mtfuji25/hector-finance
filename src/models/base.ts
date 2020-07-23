import { Schema, SchemaDefinition, SchemaTypeOpts } from "mongoose";

// Allows empty string
export class EmptyString extends Schema.Types.String {
    static schemaName = "EmptyString";
    checkRequired(value: any) {
        return typeof value === "string" || value instanceof String;
    }
}
Schema.Types.EmptyString = EmptyString;

function applyDefaults(customOptions: SchemaTypeOpts<any>): SchemaTypeOpts<any> {
    const options: SchemaTypeOpts<any> = {
        required: true,
    };
    switch (customOptions.type) {
        case Schema.Types.EmptyString:
            options.default = "";
            break;
        case Schema.Types.Number:
            options.default = 0;
            break;
        case Schema.Types.Boolean:
            options.default = false;
            break;
        case Schema.Types.ObjectId:
            if (customOptions.required === false) {
                options.default = null;
            }
            break;
    }
    return Object.assign(options, customOptions);
}

export default function(definition: SchemaDefinition): Schema {
    Object.keys(definition).forEach(prop => {
        definition[prop] = applyDefaults(definition[prop] as SchemaTypeOpts<any>);
    });
    return new Schema(
        Object.assign(
            {
                approved: applyDefaults({ type: Schema.Types.Boolean }),
                deleted: applyDefaults({ type: Schema.Types.Boolean }),
            },
            definition,
        ),
        {
            collation: { locale: "en_US" },
            timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
            toObject: { virtuals: true, versionKey: false },
        },
    );
}

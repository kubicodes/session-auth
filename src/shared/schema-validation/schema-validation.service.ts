import Ajv, { Schema, ValidateFunction } from "ajv";

export interface SchemaValidationService {
    getValidationFunction(schema: Schema): ValidateFunction;
}

export class AjvSchemaValidationService<T> implements SchemaValidationService {
    public getValidationFunction(schema: Schema): ValidateFunction {
        const ajv = new Ajv();

        return ajv.compile<T>(schema);
    }
}

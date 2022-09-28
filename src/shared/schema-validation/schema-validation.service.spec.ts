import { AjvSchemaValidationService, SchemaValidationService } from "./schema-validation.service";
import { Type } from "@sinclair/typebox";

describe("Schema Validation Service", () => {
    let ajvSchemaValidationService: SchemaValidationService;
    const schema = Type.Object({
        message: Type.String(),
    });

    beforeEach(() => {
        ajvSchemaValidationService = new AjvSchemaValidationService();
    });

    describe("validate", () => {
        it("returns a validation function without errors", () => {
            const validate = ajvSchemaValidationService.getValidationFunction(schema);

            validate({ message: "hello" });

            expect(validate.errors).toBe(null);
        });

        it("returns the errors when the object is not valid", () => {
            const validate = ajvSchemaValidationService.getValidationFunction(schema);

            validate({ invalid: "invalid" });

            expect(validate.errors?.length).not.toBe(0);
        });
    });
});

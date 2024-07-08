import Ajv from 'ajv';
import addFormats from 'ajv-formats';

export const validateInput = async (payload: Record<string, any>, schema: Record<string, any>): Promise<void> => {
    const ajv = new Ajv();
    addFormats(ajv);

    if (schema && !ajv.validate(schema, payload)) {
        throw new Error(JSON.stringify(ajv.errors));
    }
};

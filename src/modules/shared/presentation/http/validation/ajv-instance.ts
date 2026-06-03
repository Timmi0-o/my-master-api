import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const commonOptions = {
  allErrors: true,
  useDefaults: true,
  removeAdditional: true,
  strict: true,
};

export const ajv = new Ajv({
  ...commonOptions,
  coerceTypes: true,
});

addFormats(ajv, ['uuid', 'date-time', 'email']);

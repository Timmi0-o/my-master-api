import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const commonOptions = {
  allErrors: true,
  useDefaults: true,
  removeAdditional: true,
  strict: true,
};

/** Валидация входа с API: строки query → числа, приведение типов. */
export const ajv = new Ajv({
  ...commonOptions,
  coerceTypes: true,
});

export const ajvStrict = new Ajv(commonOptions);

addFormats(ajv, ['uuid', 'date-time']);
addFormats(ajvStrict, ['uuid', 'date-time']);

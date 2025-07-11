import { TransformFnParams } from 'class-transformer';

export const transformBoolean = ({ value }: TransformFnParams) => {
  if (value === 'true') return true;
  if (value === 'false') return false;
  return value;
};

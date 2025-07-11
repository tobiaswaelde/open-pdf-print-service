import { BadRequestException, ValidationPipeOptions } from '@nestjs/common';
import { ValidationUtil } from '../util/validation';

/**
 * Validation options for the application
 */
export const validationOptions: ValidationPipeOptions = {
  always: true,
  whitelist: true,
  forbidNonWhitelisted: false,
  forbidUnknownValues: false,
  validationError: {
    target: true,
    value: true,
  },
  exceptionFactory: (errors) => {
    throw new BadRequestException({
      message: ValidationUtil.mapValidationErrorsToObject(errors),
      error: 'Bad Request',
      code: 400,
    });
  },
};

import { ClassSerializerInterceptorOptions } from '@nestjs/common';

/**
 * Serialization options for the application
 */
export const serializationOptions: ClassSerializerInterceptorOptions = {
  enableCircularCheck: true,
  excludeExtraneousValues: false,
};

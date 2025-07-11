import { applyDecorators } from '@nestjs/common';
import { ApiResponseExamples, ApiUnauthorizedResponse } from '@nestjs/swagger';

const getExampleFromMessage = (message: string): ApiResponseExamples => ({
  summary: message,
  value: {
    message,
    error: 'Unauthorized',
    statusCode: 401,
  },
});

export type ApiUnauthorizedResponsesOptions = {
  description?: string;
  messages?: string[];
};
export function ApiUnauthorizedResponses(options?: ApiUnauthorizedResponsesOptions) {
  const getExample = () => {
    if (options.messages) return undefined;
    if (!options.description) return undefined;
    return getExampleFromMessage(options.description).value;
  };
  const getExamples = () => {
    if (!options.messages) return undefined;
    return options.messages.reduce((acc, message, index) => {
      acc[index] = getExampleFromMessage(message);
      return acc;
    }, {});
  };

  return applyDecorators(
    ApiUnauthorizedResponse({
      description: options.description,
      schema: {
        type: 'object',
        properties: {
          message: { type: 'string' },
          error: { type: 'string', default: 'Unauthorized' },
          statusCode: { type: 'number', default: 401 },
        },
      },
      example: getExample(),
      examples: getExamples(),
    }),
  );
}

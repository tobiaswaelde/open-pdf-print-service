import { applyDecorators } from '@nestjs/common';
import { ApiNotFoundResponse, ApiResponseExamples } from '@nestjs/swagger';

const getExampleFromMessage = (message: string): ApiResponseExamples => ({
  summary: message,
  value: {
    message,
    error: 'Not Found',
    statusCode: 404,
  },
});

export type ApiNotFoundResponsesOptions = {
  description?: string;
  messages?: string[];
};
export function ApiNotFoundResponses(options?: ApiNotFoundResponsesOptions) {
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
    ApiNotFoundResponse({
      description: options.description,
      schema: {
        type: 'object',
        properties: {
          message: { type: 'string' },
          error: { type: 'string', default: 'Not Found' },
          statusCode: { type: 'number', default: 404 },
        },
      },
      example: getExample(),
      examples: getExamples(),
    }),
  );
}

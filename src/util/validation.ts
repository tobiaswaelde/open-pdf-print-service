import { getMetadataStorage, ValidationError } from 'class-validator';
import { ValidationMetadata } from 'class-validator/types/metadata/ValidationMetadata';

type ErrorDescription = {
  name: string;
  constraints: any[];
};
type PropertyErrors = {
  [property: string]: ErrorDescription[] | PropertyErrors;
};

/**
 * Utility class for validation-related operations.
 */
export class ValidationUtil {
  /**
   * Get metadata for specific error
   * @param {ValidationError} error The error to get metadata for
   * @returns {ValidationMetadata[]} The metadata for the error
   */
  private static getMetaData(error: ValidationError): ValidationMetadata[] {
    return getMetadataStorage().getTargetValidationMetadatas(
      error.target.constructor,
      error.target.constructor.name,
      true,
      false,
    );
  }

  /**
   * Process contraints for specific error
   * @param {ValidationError} error The error to process constraints for
   * @param {ValidationMetadata[]} metaData The metadata for the error
   * @returns
   */
  private static processConstraints(
    error: ValidationError,
    metaData: ValidationMetadata[],
  ): ErrorDescription[] {
    const result: ErrorDescription[] = [];

    for (const key in error.constraints) {
      const meta = metaData.find((x) => x.propertyName === error.property && x.name === key);
      if (meta) {
        result.push({ name: meta.name, constraints: meta.constraints });
      } else {
        result.push({ name: key, constraints: [error.constraints[key]] });
      }
    }

    return result;
  }

  /**
   * Recursive function to process children and build the nested structure
   * @param {ValidationError[]} children The children to process
   * @param {ValidationMetadata[]} metaData The metadata for the error
   * @returns {PropertyErrors} The nested structure of the children
   */
  private static processChildren(
    children: ValidationError[],
    metaData: ValidationMetadata[],
  ): PropertyErrors {
    const nestedErrors: PropertyErrors = {};

    for (const child of children) {
      if (child.constraints) {
        console.log(child.constraints);
        nestedErrors[child.property] = this.processConstraints(child, metaData);
      }
      if (child.children && child.children.length > 0) {
        nestedErrors[child.property] = this.processChildren(child.children, metaData);
      }
    }

    return nestedErrors;
  }

  /**
   * Map validation errors to object
   * @param {ValidationError} errors The errors to map
   * @returns {PropertyErrors} The mapped errors
   */
  public static mapValidationErrorsToObject(errors: ValidationError[]): PropertyErrors {
    const result: PropertyErrors = {};

    for (const error of errors) {
      const metaData = this.getMetaData(error);

      if (error.constraints) {
        result[error.property] = this.processConstraints(error, metaData);
      }
      if (error.children && error.children.length > 0) {
        result[error.property] = this.processChildren(error.children, metaData);
      }
    }

    return result;
  }
}

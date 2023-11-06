import { errorCodes } from "./error-codes";
import { ErrorResponseInterface } from "./types";

export function apiErrorResponse(httpStatus: keyof typeof errorCodes, details: any = null): ErrorResponseInterface {
  const errorObject = errorCodes[httpStatus];

  if (!errorObject) {
    throw new Error(`Código de erro desconhecido: ${httpStatus}`);
  }

  const { code, message } = errorObject;
  const errorResponse: ErrorResponseInterface = { error: true, httpStatus, code, message };

  if (details !== null) {
    errorResponse.details = details;
  }

  return errorResponse;
}

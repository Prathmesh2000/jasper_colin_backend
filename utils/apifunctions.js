const sendResponse = (res, statusCode, responseObj) => {
    if (res && typeof res.status === 'function') {
        return res.status(statusCode).json(responseObj);
    }
    return responseObj;
};

const successResponse = (res, data) => sendResponse(res, 200, { error: 0, errorMessage: '', data, processed: true });

const createdResponse = (res, data) => sendResponse(res, 201, { error: 0, errorMessage: '', data, processed: true, message: 'Successfully created.' });

const updatedResponse = (res, data) => sendResponse(res, 200, { error: 0, errorMessage: '', data, processed: true, message: 'Successfully updated.' });

const notFoundResponse = (res, message = 'Data not found') => sendResponse(res, 404, { error: 1, errorMessage: message, data: null, processed: false });

const unauthorizedResponse = (res, message = 'Unauthorized access') => sendResponse(res, 401, { error: 1, errorMessage: message, data: null, processed: false });

const forbiddenResponse = (res, message = 'Forbidden access') => sendResponse(res, 403, { error: 1, errorMessage: message, data: null, processed: false });

const methodNotAllowedResponse = (res, message = 'Method Not Allowed') => sendResponse(res, 405, { error: 1, errorMessage: message, data: null, processed: false });

const validationErrorResponse = (res, errors) => sendResponse(res, 400, { error: 1, errorMessage: 'Validation error', data: null, processed: false, details: errors });

const missingParamResponse = (res, paramName) => sendResponse(res, 400, { error: 1, errorMessage: `Missing required parameter: ${paramName}`, data: null, processed: false });

const serverErrorResponse = (res, error) => sendResponse(res, 500, { error: 1, errorMessage: 'Internal server error', data: null, processed: false, details: error.message || error });

const customErrorResponse = (res, statusCode, errorMessage) => sendResponse(res, statusCode, { error: 1, errorMessage, data: null, processed: false });

const acceptedResponse = (res, message = 'Request accepted for processing') => sendResponse(res, 202, { error: 0, errorMessage: '', data: null, processed: false, message });

const timeoutResponse = (res, message = 'Request Timeout: The server timed out waiting for the request') => sendResponse(res, 408, { error: 1, errorMessage: message, data: null, processed: false });

const unprocessableEntityResponse = (res, message = 'Unprocessable Entity') => sendResponse(res, 422, { error: 1, errorMessage: message, data: null, processed: false });

module.exports = {
    successResponse,
    createdResponse,
    updatedResponse,
    notFoundResponse,
    unauthorizedResponse,
    forbiddenResponse,
    methodNotAllowedResponse,
    validationErrorResponse,
    missingParamResponse,
    serverErrorResponse,
    customErrorResponse,
    acceptedResponse,
    timeoutResponse,
    unprocessableEntityResponse
};

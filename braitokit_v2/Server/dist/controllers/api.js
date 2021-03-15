"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class API {
    response(res, data, message, error, status = 200) {
        return res.status(status).json(Object.assign(Object.assign(Object.assign({ status: status === 200 }, (message ? { message } : {})), (data ? { data } : {})), (error ? { error } : {})));
    }
    /**
     * responseBadRequest
     * @param response
     * @param params
     * @returns any
     */
    responseBadRequest(response, params) {
        return this.response(response, params.data, params.message, params.error, 400);
    }
    /**
     * responseUnprocessable
     * @param response
     * @param params ..
     * @returns any
     */
    responseUnprocessable(response, params) {
        return this.response(response, params.data, params.message, params.error, 419);
    }
    /**
     * responseSuccess
     * @param response
     * @param params
     * @returns any
     */
    responseSuccess(response, params) {
        return this.response(response, params.data, params.message, undefined, 200);
    }
    /**
     * responseNotFound
     * @param response
     * @param params
     * @returns any
     */
    responseNotFound(response, params) {
        return this.response(response, params.data, params.message, params.error, 404);
    }
}
exports.default = API;
//# sourceMappingURL=api.js.map
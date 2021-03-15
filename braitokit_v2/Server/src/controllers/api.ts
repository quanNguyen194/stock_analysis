import { Response } from "express";


interface IResponseParams {
  data?: any | undefined,
  message?: string | undefined,
  error?: string | undefined,
}


export default class API {

  public response(res: Response, data: any | undefined,
    message: string | undefined, error: string | undefined, status = 200
  ): any {
    return res.status(status).json({
      status: status === 200,
      ...(message ? { message } : {}),
      ...(data ? { data } : {}),
      ...(error ? { error } : {}),
    });
  }

  /**
   * responseBadRequest
   * @param response
   * @param params
   * @returns any
   */
  public responseBadRequest(response: Response, params: IResponseParams): any {
    return this.response(response, params.data, params.message, params.error, 400);
  }

  /**
   * responseUnprocessable
   * @param response
   * @param params ..
   * @returns any
   */
  public responseUnprocessable(response: Response, params: IResponseParams): any {
    return this.response(response, params.data, params.message, params.error, 419);
  }

  /**
   * responseSuccess
   * @param response
   * @param params
   * @returns any
   */
  public responseSuccess(response: Response, params: IResponseParams): any {
    return this.response(response, params.data, params.message, undefined, 200);
  }

  /**
   * responseNotFound
   * @param response
   * @param params
   * @returns any
   */
  public responseNotFound(response: Response, params: IResponseParams): any {
    return this.response(response, params.data, params.message, params.error, 404);
  }

}

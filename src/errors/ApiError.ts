import { ZodError } from 'zod'

class ApiError {
  static forbidden(arg0: string): any {
    throw new Error('Method not implemented.')
  }
  constructor(public code: number, public message: string | ZodError['errors']) {
    this.code = code
    this.message = message
  }
  static badRequest(msg: string) {
    return new ApiError(400, msg)
  }
  static badRequestValidation(msg: ZodError['errors']) {
    return new ApiError(400, msg)
  }
  static internal(msg: string) {
    return new ApiError(500, msg)
  }
}

export default ApiError

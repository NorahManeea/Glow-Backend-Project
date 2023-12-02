import { ZodError } from 'zod'

class ApiError {
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
  static forbidden(msg: string) {
    return new ApiError(403, msg)
  }
  static unauthorized(msg: string) {
    return new ApiError(401, msg)
  }
  static notFound(msg: string) {
    return new ApiError(404, msg)
  }
  static alreadyExist(msg: string) {
    return new ApiError(409, msg)
  }
}

export default ApiError

export class ApiResponse<T = any> {
  code: number;
  data: T;
  message: string;

  constructor(code: number, data: T, message: string) {
    this.code = code;
    this.data = data;
    this.message = message;
  }

  static success<T>(data: T, message: string = '操作成功'): ApiResponse<T> {
    return new ApiResponse(0, data, message);
  }

  static error<T>(data: T = null, message: string = '操作失败'): ApiResponse<T> {
    return new ApiResponse(1, data, message);
  }
}
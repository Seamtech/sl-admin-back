export function buildSuccess<T>(message: string, data: T) {
    return {
      success: true,
      message,
      data,
    };
  }
  
  export function buildError(message: string, error?: string) {
    return {
      success: false,
      message,
      error,
    };
  }
  
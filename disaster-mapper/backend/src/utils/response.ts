export function successResponse<T>(data: T) {
  return {
    success: true,
    data
  };
}

export function errorResponse(code: string, message: string) {
  return {
    success: false,
    error: {
      code,
      message
    }
  };
}

export function paginatedResponse<T>(data: T[], total: number, page: number, limit: number) {
  return {
    success: true,
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
}

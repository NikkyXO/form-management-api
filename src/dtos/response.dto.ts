export class ResponseDTO<T> {
  success: boolean;
  message?: string;
  data: T | null | unknown;
}

interface SuccessfulResponseOptions<T> {
  data?: T | T[] | null;
  message?: string;
}

export const successfulResponse = <T>(
  options: SuccessfulResponseOptions<T> = {},
): ResponseDTO<T | T[] | null> => {
  const { data, message } = options;
  const response: ResponseDTO<T | T[] | null> = {
    success: true,
    message: message || 'Successful',
    data: data || null,
  };

  return response;
};

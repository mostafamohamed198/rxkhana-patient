import axios, { type AxiosResponse, type AxiosError } from "axios";
import { getAuthUrl } from "@/constants/urls";

export type ErrorResponse = {
  message?: string;
  status?: string;
  code?: string;
  detail?: string;
  [key: string]: unknown;
};

export type PostSendOtpResponse = {
  message: string;
  status: string;
  code: string;
  detail: string;
  [key: string]: unknown;
};

export type State =
  | {
      status: "success";
      data: PostSendOtpResponse;
    }
  | {
      status: "error";
      message: string;
      errors?: Record<string, string[]>;
    };

const postSendOtp = async (phone_number: string): Promise<State> => {
  try {
    const response: AxiosResponse<PostSendOtpResponse> = await axios.post(
      getAuthUrl().postSendOtp(),
      {
        phone_number,
      },
    );
    const responseData: PostSendOtpResponse = response.data;
    return {
      status: "success",
      data: responseData,
    };
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    if (axiosError.response?.status === 400 && axiosError.response.data) {
      const errorData = axiosError.response.data;
      return {
        status: "error",
        message: "Please correct the validation errors",
        errors: errorData as Record<string, string[]>,
      };
    }
    return {
      status: "error",
      message:
        axiosError.response?.data?.detail ||
        "An error occurred during delete account. Please try again.",
    };
  }
};

export default postSendOtp;

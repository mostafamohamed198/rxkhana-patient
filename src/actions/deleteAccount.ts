import axios, { type AxiosResponse, type AxiosError } from "axios";
import { getAuthUrl } from "@/constants/urls";

export type ErrorResponse = {
  message?: string;
  status?: string;
  code?: string;
  detail?: string;
  [key: string]: unknown;
};

export type DeleteAccountResponse = {
  message: string;
  status: string;
  code: string;
  detail: string;
  [key: string]: unknown;
};

export type State =
  | {
      status: "success";
      data: DeleteAccountResponse;
    }
  | {
      status: "error";
      message: string;
      errors?: Record<string, string[]>;
    };

const deleteAccount = async (
  phone_number: string,
  otp: string,
): Promise<State> => {
  try {
    const response: AxiosResponse<DeleteAccountResponse> = await axios.delete(
      getAuthUrl().deleteAccount(),
      {
        data: {
          phone_number,
          otp,
        },
      },
    );
    const responseData: DeleteAccountResponse = response.data;
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
        "An error occurred during login. Please try again.",
    };
  }
};

export default deleteAccount;

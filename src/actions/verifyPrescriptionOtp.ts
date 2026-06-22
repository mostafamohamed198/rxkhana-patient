import { type AxiosResponse, type AxiosError } from "axios";
import axios from "axios";
import { getPrescriptionUrl } from "@/constants/urls";
import type { PrescriptionResponse, ErrorResponse } from "@/actions/getPrescription";

export type State =
  | {
      status: "success";
      data: PrescriptionResponse;
    }
  | {
      status: "error";
      message: string;
    };

const verifyPrescriptionOtp = async (
  token: string,
  phoneNumber: string,
  otp: string,
): Promise<State> => {
  try {
    const response: AxiosResponse<PrescriptionResponse> = await axios.post(
      getPrescriptionUrl().verifyOtp(),
      {
        token,
        phone_number: phoneNumber,
        otp,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    return {
      status: "success",
      data: response.data,
    };
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    return {
      status: "error",
      message:
        axiosError.response?.data?.error ||
        axiosError.response?.data?.detail ||
        "Invalid OTP. Please try again.",
    };
  }
};

export default verifyPrescriptionOtp;

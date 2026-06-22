import { type AxiosResponse, type AxiosError } from "axios";
import axios from "axios";
import { getPrescriptionUrl } from "@/constants/urls";
import type { ErrorResponse } from "@/actions/getPrescription";

export type State =
  | {
      status: "success";
      token: string;
    }
  | {
      status: "error";
      message: string;
    };

const resolveShortLink = async (code: string): Promise<State> => {
  try {
    const response: AxiosResponse<{ token: string }> = await axios.get(
      getPrescriptionUrl().resolveShortLink(code),
    );
    return { status: "success", token: response.data.token };
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    return {
      status: "error",
      message:
        axiosError.response?.data?.error ||
        axiosError.response?.data?.detail ||
        "This link is invalid or has expired.",
    };
  }
};

export default resolveShortLink;

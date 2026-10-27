import { type AxiosResponse, type AxiosError } from "axios";
import { getPrescriptionUrl } from "@/constants/urls";
import axios from "axios";

export type AgeUnit = {
  value: string;
  display: string;
};

export type Patient = {
  patient: number;
  first_name: string;
  last_name: string;
  phone_number: string;
  age: number;
  age_unit: AgeUnit;
};

export type Specialty = {
  id: number;
  name: string;
  icon: string;
};

export type User = {
  first_name: string;
  last_name: string;
};

export type Physician = {
  id: number;
  specialty: Specialty;
  user: User;
};

export type PhoneNumber = {
  phone_number: string;
};

export type Facility = {
  id: number;
  name: string;
  address: string;
  phone_numbers: PhoneNumber[];
};

export type Diagnosis = {
  id: number;
  name: string;
};

export type LabTest = {
  id: number;
  name: string;
  abbreviation: string;
  category: string;
};

export type Label = {
  label: string;
  type: string;
  order: number;
};

export type Availability = {
  value: string;
  display: string;
};

export type DosageForm = {
  value: string;
  display: string;
};

export type BrandDosage = {
  id: number;
  name: string;
  availability: Availability;
  special: boolean;
  dosage_form: DosageForm;
  administration_times: string[];
  active_constituent: string;
  frequency: number | null;
  frequency_unit: string | null;
};

export type Medication = {
  id: number;
  brand_dosage: BrandDosage;
  frequency: number;
  frequency_unit: string;
  duration: number;
  duration_unit: string;
  notes: string;
  administration_times: string[];
  brand_dosage_display: string;
  medication_dosing: string;
};

export type PrescriptionResponse = {
  id: number;
  created_at: string;
  patient: Patient;
  active: boolean;
  physician: Physician;
  status: string;
  facility: Facility;
  next_visit: string;
  diagnosis: Diagnosis;
  lab_tests: LabTest[];
  notes: string;
  labels: Label[];
  medications: Medication[];
  language: string;
  device_token: string;
};

export type State =
  | {
      status: "success";
      data: PrescriptionResponse;
    }
  | {
      status: "otp_required";
    }
  | {
      status: "error";
      message: string;
    };

export type GetPrescriptionParams = {
  facilityId: string;
  page?: number;
  limit?: number;
  search?: string;
};

export type ErrorResponse = {
  message?: string;
  status?: string;
  code?: string;
  detail?: string;
  error?: string;
  [key: string]: unknown;
};

type PrescriptionRequest = {
  token: string;
  device_token?: string;
};

const getPrescription = async (
  token: string,
  deviceToken?: string | null,
): Promise<State> => {
  try {
    const requestBody: PrescriptionRequest = { token };
    if (deviceToken) {
      requestBody.device_token = deviceToken;
    }

    const response: AxiosResponse<PrescriptionResponse> = await axios.post(
      getPrescriptionUrl().getPrescription(),
      requestBody,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    const responseData: PrescriptionResponse = response.data;
    return {
      status: "success",
      data: responseData,
    };
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    if (
      axiosError.response?.status === 401 &&
      axiosError.response.data?.error === "otp_required"
    ) {
      return { status: "otp_required" };
    }
    return {
      status: "error",
      message:
        axiosError.response?.data?.error ||
        axiosError.response?.data?.detail ||
        "An error occurred while fetching the prescription. Please try again.",
    };
  }
};

export default getPrescription;

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getAuthUrl = () => {
  return {
    postSendOtp: () => `${BASE_URL}/api/v1/users/generate-otp/`,
    deleteAccount: () => `${BASE_URL}/api/v1/users/delete-account/`,
  };
};

export const getPrescriptionUrl = () => {
  return {
    getPrescription: () =>
      `${BASE_URL}/api/v1/prescriptions/patient-prescription/`,
  };
};

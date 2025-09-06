import { BrowserRouter, Routes, Route } from "react-router";
import Prescription from "./pages/Prescription";
import DeleteAccount from "./pages/DeleteAccount";
import DeleteAccountSuccess from "./pages/DeleteAccountSuccess";
import DeleteAccountOtp from "./pages/DeleteAccountOtp";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/prescriptions/:token" element={<Prescription />} />
        <Route path="/delete-account" element={<DeleteAccount />} />
        <Route
          path="/delete-account-otp/:phoneNumber"
          element={<DeleteAccountOtp />}
        />
        <Route
          path="/delete-account-success"
          element={<DeleteAccountSuccess />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

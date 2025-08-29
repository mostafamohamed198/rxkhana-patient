import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Card,
  CardAction,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import logo from "@/assets/rx_black.svg";
import { PhoneInput } from "@/components/ui/phone-input";
import { AxiosError } from "axios";
import postSendOtp from "@/actions/postSendOtp";
import { useNavigate } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  phoneNumber: z
    .string()
    .min(11, "Phone number must be 11 digits")
    .max(11, "Phone number must be 11 digits")
    .regex(/^01[0-2,5]{1}[0-9]{8}$/, "Invalid Egyptian phone number"),
});

const DeleteAccount = () => {
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });
  const navigate = useNavigate();
  const onSubmit = async (data: z.infer<typeof schema>) => {
    try {
      const response = await postSendOtp(data.phoneNumber);
      if (response.status === "success") {
        navigate(`/delete-account-otp/${data.phoneNumber}`);
      } else {
        clearErrors();

        if (response.errors) {
          Object.entries(response.errors).forEach(([fieldName, messages]) => {
            setError(fieldName as keyof z.infer<typeof schema>, {
              type: "manual",
              message: messages.join(", "),
            });
          });
        }
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        setError("phoneNumber", {
          type: "manual",
          message: error.response?.data.phone_number[0],
        });
      } else {
        setError("phoneNumber", {
          type: "manual",
          message: "An error occurred. Please try again.",
        });
      }
    }
  };

  return (
    <div className="auth-layout">
      <div className="auth-container">
        <main className="auth-content">
          <div className="flex min-h-svh flex-col items-center justify-center bg-gray-100">
            <form onSubmit={handleSubmit(onSubmit)}>
              <Card>
                <CardHeader>
                  <CardTitle>Delete Account</CardTitle>
                  <CardDescription>
                    Enter your phone number to delete your account
                  </CardDescription>
                  <CardAction>
                    <img src={logo} className="w-8" />
                  </CardAction>
                </CardHeader>

                <CardContent>
                  <div className="flex flex-col gap-6">
                    <div className="grid gap-2">
                      <Label htmlFor="phoneNumber">Phone Number</Label>
                      <PhoneInput
                        id="phoneNumber"
                        placeholder="01012345678"
                        required
                        {...register("phoneNumber")}
                      />
                      {errors.phoneNumber && (
                        <p className="text-red-500 text-sm">
                          {errors.phoneNumber.message}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="flex flex-col gap-4">
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Sending OTP..." : "Send OTP"}
                  </Button>
                </CardFooter>
              </Card>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DeleteAccount;

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import { z } from "zod";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { zodResolver } from "@hookform/resolvers/zod";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import logo from "@/assets/rx_black.svg";
import { useEffect, useState } from "react";
import deleteAccount from "@/actions/deleteAccount";
import postSendOtp from "@/actions/postSendOtp";

const schema = z.object({
  otp: z.string().min(6, { message: "OTP must be 6 digits" }),
});
const DeleteAccountOtp = () => {
  const { phoneNumber } = useParams();
  const navigate = useNavigate();
  const {
    handleSubmit,
    setError,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });
  const [timeLeft, setTimeLeft] = useState(120);
  const [canResend, setCanResend] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const onSubmit = async (data: z.infer<typeof schema>) => {
    try {
      const response = await deleteAccount(phoneNumber!, data.otp);
      if (response.status === "success") {
        navigate("/delete-account-success");
      } else {
        setError("otp", { message: response.message });
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleResendOtp = async () => {
    if (!canResend) return;

    setIsResending(true);
    try {
      await postSendOtp(phoneNumber!);
      setTimeLeft(120);
      setCanResend(false);
    } catch (error) {
      console.error("Error resending OTP:", error);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="auth-layout">
      <div className="auth-container">
        <main className="auth-content">
          <div className="flex min-h-svh flex-col items-center justify-center bg-gray-100">
            <form onSubmit={handleSubmit(onSubmit)}>
              <Card className="w-full min-w-sm">
                <CardHeader>
                  <CardTitle>OTP Verification </CardTitle>
                  <CardDescription>
                    Enter the OTP sent to your phone number to verify your
                    account
                  </CardDescription>
                  <CardAction>
                    <img src={logo} />
                  </CardAction>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-6">
                    <div className="grid gap-2 w-full">
                      <Label htmlFor="otp">OTP</Label>
                      <InputOTP
                        maxLength={6}
                        pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                        onComplete={(value) => setValue("otp", value)}
                      >
                        <InputOTPGroup className="w-full">
                          <InputOTPSlot index={0} className="w-1/6" />
                          <InputOTPSlot index={1} className="w-1/6" />
                          <InputOTPSlot index={2} className="w-1/6" />
                          <InputOTPSlot index={3} className="w-1/6" />
                          <InputOTPSlot index={4} className="w-1/6" />
                          <InputOTPSlot index={5} className="w-1/6" />
                        </InputOTPGroup>
                      </InputOTP>
                      {errors.otp && (
                        <p className="text-red-500 text-sm">
                          {errors.otp.message}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex-col gap-2">
                  <div className="w-full text-center">
                    {!canResend ? (
                      <div className="text-xs text-gray-600">
                        Resend code in{" "}
                        <span className="font-mono font-semibold">
                          {formatTime(timeLeft)}
                        </span>
                      </div>
                    ) : (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleResendOtp}
                        disabled={isResending}
                        className="w-full"
                      >
                        {isResending ? "Resending..." : "Resend Code"}
                      </Button>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    Delete Account
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

export default DeleteAccountOtp;

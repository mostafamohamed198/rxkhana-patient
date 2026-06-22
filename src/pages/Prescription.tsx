import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  Stethoscope,
  Building,
  Pill,
  FlaskConical,
  StickyNote,
  Clock,
  Pen,
  MapPin,
  Phone,
} from "lucide-react";
import getPrescription, {
  type PrescriptionResponse,
} from "@/actions/getPrescription";
import verifyPrescriptionOtp from "@/actions/verifyPrescriptionOtp";
import resolveShortLink from "@/actions/resolveShortLink";
import postSendOtp from "@/actions/postSendOtp";
import { getDeviceToken, setDeviceToken } from "@/lib/deviceToken";
import { PhoneInput } from "@/components/ui/phone-input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { CardAction } from "@/components/ui/card";
import { Logo } from "@/components/Logo";
import { DownloadAppPromo } from "@/components/DownloadAppPromo";
import { useParams } from "react-router";
import { translations, type Language } from "@/locales";

type PhoneFormData = {
  phoneNumber: string;
};

type Step = "checking" | "phone" | "otp" | "viewing" | "error";

const phoneSchema = z.object({
  phoneNumber: z
    .string()
    .min(11, "Phone number must be 11 digits")
    .max(11, "Phone number must be 11 digits")
    .regex(/^01[0-2,5]{1}[0-9]{8}$/, "Invalid Egyptian phone number"),
});

const otpSchema = z.object({
  otp: z.string().min(6, { message: "OTP must be 6 digits" }),
});

interface PrescriptionViewProps {
  prescription: PrescriptionResponse;
}

const PrescriptionView: React.FC<PrescriptionViewProps> = ({
  prescription,
}) => {
  const lang = (prescription.language as Language) in translations
    ? (prescription.language as Language)
    : "en";
  const t = translations[lang].prescription;
  const isRTL = lang === "ar";
  
  return (
    <div className={`min-h-screen bg-background py-8 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-4xl mx-auto px-4">
        <Card className="shadow-lg p-0">
          <CardHeader className="bg-primary rounded-t-xl py-6">
            <div className="flex items-center justify-between p-2">
              <div>
                <CardTitle className="text-2xl text-primary-foreground">
                  {t.medicalPrescription}
                </CardTitle>
                <CardDescription className="text-primary-foreground/70 mt-1">
                  {t.issuedOn}{" "}
                  {new Date(prescription.created_at).toLocaleDateString()}
                </CardDescription>
              </div>
              <Logo />
            </div>
          </CardHeader>
          <CardContent className="space-y-8 p-8">
            <div className="grid gap-8">
              <div className="space-y-4">
              
                <div className="bg-muted p-4 rounded-lg space-y-2">
                  {prescription.labels
                    .filter((label) => label.order < 5)
                    .sort((a, b) => a.order - b.order)
                    .map((label, index) => {
                      switch (label.order) {
                        case 1:
                          return (
                            <div key={index} className="text-center mb-2">
                              <Badge
                                variant="outline"
                                className="bg-primary/10 text-primary text-xs px-3 py-1 font-medium mb-3"
                              >
                                {label.label}
                              </Badge>
                            </div>
                          );
                        case 2:
                          return (
                            <div key={index} className="text-center mb-3">
                              <h3 className="text-2xl font-bold text-foreground leading-tight">
                                {label.label}
                              </h3>
                            </div>
                          );
                        case 3:
                          return (
                            <div key={index} className="text-center mb-4">
                              <div className="flex items-center justify-center gap-2">
                                <Stethoscope className="h-4 w-4 text-primary" />
                                <p className="text-primary font-semibold text-lg">
                                  {label.label}
                                </p>
                              </div>
                            </div>
                          );
                        case 4:
                          return (
                            <div key={index} className="text-center mb-4">
                              <div className="flex items-center justify-center gap-2">
                                <Pen className="h-5 w-5 text-muted-foreground" />
                                <p className="text-foreground font-medium text-sm">
                                  {label.label}
                                </p>
                              </div>
                            </div>
                          );
                        default:
                          return (
                            <div key={index} className="mb-2 last:mb-0">
                              <div className="bg-muted rounded-md p-3 border border-border">
                                <p className="text-sm text-foreground">
                                  {label.label}
                                </p>
                              </div>
                            </div>
                          );
                      }
                    })}
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-lg font-semibold text-foreground">
                  <Stethoscope className="h-5 w-5" />
                  {t.patientInfo}
                </div>
                <div className="bg-muted p-4 rounded-lg space-y-2">
                  <p className="flex justify-between">
                    <span className="font-medium text-foreground">{t.name}</span>
                    <span>
                      {prescription.patient.first_name}{" "}
                      {prescription.patient.last_name}
                    </span>
                  </p>
                  {prescription.patient.age && (
                    <p className="flex justify-between">
                      <span className="font-medium text-foreground">{t.age}</span>
                      <span>
                        {prescription.patient.age}{" "}
                        {prescription.patient.age_unit.display}
                      </span>
                    </p>
                  )}
                </div>
              </div>
            </div>
            <Separator />
            {/* Diagnosis */}
            {prescription.diagnosis && (
              <div className="space-y-4">
              <div className="flex items-center gap-2 text-lg font-semibold text-foreground">
                <Building className="h-5 w-5" />
                {t.diagnosis}
              </div>
              <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                <p className="font-medium text-blue-900">
                  {prescription.diagnosis.name}
                </p>
              </div>
            </div>
            )}
            
            <Separator />
            {/* Medications */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-lg font-semibold text-foreground">
                <Pill className="h-5 w-5" />
                {t.prescribedMeds}
              </div>
              <div className="space-y-4">
                {prescription.medications.map((med, index) => (
                  <Card key={med.id} className="border-l-4 border-l-green-400">
                    <CardContent>
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-foreground">
                            {med.brand_dosage_display}
                          </h4>
                          <p className="font-medium text-muted-foreground text-sm">
                            {med.medication_dosing}
                          </p>
                          {med.notes && (
                            <p className="text-blue-600 mt-2">
                              <span className="font-medium">{t.note}</span>{" "}
                              {med.notes}
                            </p>
                          )}
                        </div>
                        <Badge variant="secondary">#{index + 1}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
            {prescription.lab_tests.length > 0 && (
              <>
                <Separator />
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-lg font-semibold text-foreground">
                    <FlaskConical className="h-5 w-5" />
                    {t.labTests}
                  </div>
                  <div className="grid md:grid-cols-2 gap-3">
                    {prescription.lab_tests.map((test) => (
                      <div
                        key={test.id}
                        className="bg-amber-50 p-3 rounded-lg border border-amber-200"
                      >
                        <p className="font-medium text-amber-900">{test.name}</p>
                        <p className="text-sm text-amber-700">
                          ({test.abbreviation}) - {test.category}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
            {prescription.notes && (
              <>
                <Separator />
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-lg font-semibold text-foreground">
                    <StickyNote className="h-5 w-5" />
                    {t.additionalNotes}
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
                    <p className="text-yellow-900">{prescription.notes}</p>
                  </div>
                </div>
              </>
            )}
            {prescription.next_visit && (
              <>
                <Separator />
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-lg font-semibold text-foreground">
                    <Calendar className="h-5 w-5 " />
                    {t.nextAppointment}
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-purple-600" />
                      <p className="font-medium text-purple-900">
                        {new Date(prescription.next_visit).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </CardContent>
          <CardFooter className="bg-muted p-6 flex-col">
            <div className="bg-card rounded-lg p-3 border border-primary/20 shadow-sm w-full">
              <div className="flex items-start gap-3">
                <div className="w-full bg-primary/10 rounded-full flex flex-col items-center justify-center py-4 space-y-2">
                  {prescription.labels
                    .filter((label) => label.order > 4)
                    .sort((a, b) => a.order - b.order)
                    .map((label, index) => (
                      <div key={index} className="flex">
                        <div>
                          {label.order === 5 ? (
                            <MapPin className="w-4 h-4 text-primary me-2" />
                          ) : (
                            <Phone className="w-4 h-4 text-primary me-2" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm text-foreground leading-relaxed font-medium">
                              {label.label}
                            </p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

const RESEND_COOLDOWN_SECONDS = 120;

const Prescription: React.FC = () => {
  const [prescription, setPrescription] = useState<PrescriptionResponse | null>(null);
  const [step, setStep] = useState<Step>("checking");
  const [error, setError] = useState<string | null>(null);
  const [showPromo, setShowPromo] = useState<boolean>(true);
  const [verifiedPhone, setVerifiedPhone] = useState<string>("");
  const [resendTimeLeft, setResendTimeLeft] = useState(RESEND_COOLDOWN_SECONDS);
  const [isResending, setIsResending] = useState(false);
  const { token: tokenParam, code } = useParams<{ token?: string; code?: string }>();
  const [token, setToken] = useState<string | null>(tokenParam ?? null);

  const phoneForm = useForm<PhoneFormData>({
    resolver: zodResolver(phoneSchema),
  });

  const otpForm = useForm<{ otp: string }>({
    resolver: zodResolver(otpSchema),
  });

  // Short links (/s/:code) resolve to a token internally — the address bar
  // stays on the short URL instead of jumping to the long signed token.
  useEffect(() => {
    if (!code || token) return;

    let cancelled = false;
    resolveShortLink(code).then((result) => {
      if (cancelled) return;
      if (result.status === "success") {
        setToken(result.token);
      } else {
        setError(result.message);
        setStep("error");
      }
    });

    return () => {
      cancelled = true;
    };
  }, [code, token]);

  // Attempt silent access as soon as the promo screen is skipped: a browser
  // that's already trusted (or is the first ever to open one of this
  // patient's links) gets in with no phone number at all.
  useEffect(() => {
    if (showPromo || !token) return;

    let cancelled = false;
    setStep("checking");

    getPrescription(token, getDeviceToken()).then((result) => {
      if (cancelled) return;
      if (result.status === "success") {
        setDeviceToken(result.data.device_token);
        setPrescription(result.data);
        setStep("viewing");
      } else if (result.status === "otp_required") {
        setStep("phone");
      } else {
        setError(result.message);
        setStep("error");
      }
    });

    return () => {
      cancelled = true;
    };
  }, [showPromo, token]);

  useEffect(() => {
    if (step !== "otp" || resendTimeLeft <= 0) return;
    const timer = setTimeout(() => setResendTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [step, resendTimeLeft]);

  const currentLanguage = (prescription?.language as Language) || "ar";
  const t = (translations[currentLanguage] ?? translations.en).prescription;
  const isRTL = currentLanguage === "ar";

  const onSubmitPhone = async (data: PhoneFormData): Promise<void> => {
    const result = await postSendOtp(data.phoneNumber);
    if (result.status === "success") {
      setVerifiedPhone(data.phoneNumber);
      setResendTimeLeft(RESEND_COOLDOWN_SECONDS);
      otpForm.reset();
      setStep("otp");
    } else {
      phoneForm.setError("phoneNumber", { message: result.message });
    }
  };

  const onSubmitOtp = async (data: { otp: string }): Promise<void> => {
    if (!token) return;
    const result = await verifyPrescriptionOtp(token, verifiedPhone, data.otp);
    if (result.status === "success") {
      setDeviceToken(result.data.device_token);
      setPrescription(result.data);
      setStep("viewing");
    } else {
      otpForm.setError("otp", { message: result.message });
    }
  };

  const handleResendOtp = async () => {
    if (resendTimeLeft > 0 || !verifiedPhone) return;
    setIsResending(true);
    try {
      await postSendOtp(verifiedPhone);
      setResendTimeLeft(RESEND_COOLDOWN_SECONDS);
    } finally {
      setIsResending(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  if (showPromo) {
    return <DownloadAppPromo onSkip={() => setShowPromo(false)} />;
  }

  if (step === "viewing" && prescription) {
    return <PrescriptionView prescription={prescription} />;
  }

  if (step === "checking") {
    return (
      <div
        dir={isRTL ? "rtl" : "ltr"}
        className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 px-4"
      >
        <Logo />
        <p className="text-muted-foreground text-sm">{t.checkingAccess}</p>
      </div>
    );
  }

  if (step === "error") {
    return (
      <div
        dir={isRTL ? "rtl" : "ltr"}
        className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 px-4 text-center"
      >
        <Logo />
        <p className="text-destructive text-sm max-w-sm">{error}</p>
      </div>
    );
  }

  if (step === "otp") {
    return (
      <div
        dir={isRTL ? "rtl" : "ltr"}
        className="min-h-screen bg-background flex items-center justify-center px-4"
      >
        <div className="w-full max-w-md">
          <form onSubmit={otpForm.handleSubmit(onSubmitOtp)}>
            <Card>
              <CardHeader>
                <CardTitle>{t.enterOtp}</CardTitle>
                <CardDescription>{t.enterOtpDesc}</CardDescription>
                <CardAction>
                  <Logo />
                </CardAction>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2 w-full">
                  <Label htmlFor="otp">{t.enterOtp}</Label>
                  {/* OTP digits always read left-to-right, even on the Arabic/RTL page */}
                  <div dir="ltr">
                    <InputOTP
                      maxLength={6}
                      pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                      onComplete={(value) => otpForm.setValue("otp", value)}
                    >
                      <InputOTPGroup className="w-full">
                        {[0, 1, 2, 3, 4, 5].map((index) => (
                          <InputOTPSlot key={index} index={index} className="w-1/6" />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                  {otpForm.formState.errors.otp && (
                    <p className="text-destructive text-sm">
                      {otpForm.formState.errors.otp.message}
                    </p>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex-col gap-2">
                <div className="w-full text-center">
                  {resendTimeLeft > 0 ? (
                    <div className="text-xs text-muted-foreground">
                      {t.resendIn}{" "}
                      <span className="font-mono font-semibold">
                        {formatTime(resendTimeLeft)}
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
                      {t.resendCode}
                    </Button>
                  )}
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={otpForm.formState.isSubmitting}
                >
                  {otpForm.formState.isSubmitting ? t.verifying : t.verify}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className="min-h-screen bg-background flex items-center justify-center px-4"
    >
      <div className="w-full max-w-md">
        <form onSubmit={phoneForm.handleSubmit(onSubmitPhone)}>
          <Card>
            <CardHeader>
              <CardTitle>{t.enterPhone}</CardTitle>
              <CardDescription>{t.enterPhoneDesc}</CardDescription>
              <CardAction>
                <Logo />
              </CardAction>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="phoneNumber">{t.phoneNumber}</Label>
                  <PhoneInput
                    id="phoneNumber"
                    placeholder="01012345678"
                    required
                    {...phoneForm.register("phoneNumber")}
                  />
                  {phoneForm.formState.errors.phoneNumber && (
                    <p className="text-destructive text-sm">
                      {phoneForm.formState.errors.phoneNumber.message}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button
                type="submit"
                className="w-full"
                disabled={phoneForm.formState.isSubmitting}
              >
                {phoneForm.formState.isSubmitting ? t.sending : t.sendOtp}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </div>
  );
};

export default Prescription;
import { useState } from "react";
import { useForm } from "react-hook-form";
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
  Download,
  Smartphone,
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
import getPrescription,  { 
  type State,
  type PrescriptionResponse
} from "@/actions/getPrescription";
import { PhoneInput } from "@/components/ui/phone-input";
import { CardAction } from "@/components/ui/card";
import logo from "@/assets/rx_black.svg";
import { useParams } from "react-router";



type FormData = {
  phoneNumber: string;
};

// Translation object
const translations = {
  ar: {
    enterPhone: "أدخل رقم المحمول",
    enterPhoneDesc: "أدخل رقم هاتفك لعرض الروشتة",
    phoneNumber: "رقم المحمول",
    viewPrescription: "عرض الروشتة",
    loading: "جاري التحميل...",
    backToVerification: "العودة للتحقق",
    downloadApp: "تحميل التطبيق",
    downloadAppDesc: "احصل على وصول فوري لروشتاتك في أي وقت ومكان",
    medicalPrescription: "الروشتة الطبية",
    issuedOn: "صدرت في",
    facilityInfo: "معلومات المنشأة",
    patientInfo: "معلومات المريض",
    diagnosis: "التشخيص",
    prescribedMeds: "الأدوية الموصوفة",
    labTests: "التحاليل المطلوبة",
    additionalNotes: "ملاحظات إضافية",
    nextAppointment: "الزيارة القادمة",
    name: "الاسم:",
    age: "العمر:",
    note: "ملاحظة:",
    getMobileApp: "احصل على التطبيق",
    getMobileAppDesc: "احصل على روشتاتك، واضبط تذكيرات الأدوية، وتواصل مع فريق الرعاية الصحية أثناء التنقل.",
    appStore: "متجر التطبيقات",
    googlePlay: "متجر جوجل",
    prescriptionPortal: "بوابة الروشتات",
    secureAccess: "وصول آمن للروشتات الطبية",
    secureAccessTitle: "وصول آمن",
    secureAccessDesc: "بيانات الروشتة محمية بأمان عالي المستوى",
    access247: "وصول على مدار الساعة",
    access247Desc: "اعرض روشتاتك في أي وقت ومن أي مكان",
    mobileApp: "التطبيق المحمول",
    mobileAppDesc: "احصل على تطبيقنا المحمول لأفضل تجربة",
    betterExperience: "تجربة أفضل على الأجهزة المحمولة"
  },
  en: {
    enterPhone: "Enter Mobile Number",
    enterPhoneDesc: "Enter your phone number to view prescription",
    phoneNumber: "Mobile Number",
    viewPrescription: "View Prescription",
    loading: "Loading...",
    backToVerification: "Back to verification",
    downloadApp: "Download Our Mobile App",
    downloadAppDesc: "Get instant access to your prescriptions anytime, anywhere",
    medicalPrescription: "Medical Prescription",
    issuedOn: "Issued on",
    facilityInfo: "Facility Information",
    patientInfo: "Patient Information",
    diagnosis: "Diagnosis",
    prescribedMeds: "Prescribed Medications",
    labTests: "Requested Lab Tests",
    additionalNotes: "Additional Notes",
    nextAppointment: "Next Appointment",
    name: "Name:",
    age: "Age:",
    note: "Note:",
    getMobileApp: "Get the Mobile App",
    getMobileAppDesc: "Access your prescriptions, set medication reminders, and connect with your healthcare team on the go.",
    appStore: "App Store",
    googlePlay: "Google Play",
    prescriptionPortal: "Prescription Portal",
    secureAccess: "Secure access to your medical prescriptions",
    secureAccessTitle: "Secure Access",
    secureAccessDesc: "Your prescription data is protected with enterprise-grade security",
    access247: "24/7 Access",
    access247Desc: "View your prescriptions anytime, anywhere",
    mobileApp: "Mobile App",
    mobileAppDesc: "Get our mobile app for the best experience",
    betterExperience: "Better experience on mobile devices"
  }
};

interface AppDownloadBannerProps {
  language: string;
}

const AppDownloadBanner: React.FC<AppDownloadBannerProps> = ({ language }) => {
  const t = translations[language as keyof typeof translations] || translations.en;
  
  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-lg mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Smartphone className="h-8 w-8" />
          <div>
            <h3 className="font-semibold text-lg">{t.downloadApp}</h3>
            <p className="text-blue-100 text-sm">{t.downloadAppDesc}</p>
          </div>
        </div>
        <Button
          variant="secondary"
          size="sm"
          className="bg-white text-blue-600 hover:bg-blue-50"
        >
          <Download className="h-4 w-4 mr-2" />
          {t.downloadApp}
        </Button>
      </div>
    </div>
  );
};

interface PrescriptionViewProps {
  prescription: PrescriptionResponse;
}

const PrescriptionView: React.FC<PrescriptionViewProps> = ({ 
  prescription, 
}) => {
  const t = translations[prescription.language as keyof typeof translations] || translations.en;
  const isRTL = prescription.language === 'ar';
  
  return (
    <div className={`min-h-screen bg-gray-50 py-8 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-4xl mx-auto px-4">
        <AppDownloadBanner language={prescription.language} />
        <Card className="shadow-lg p-0">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-center justify-between p-2 py-4">
              <div>
                <CardTitle className="text-2xl text-gray-900">
                  {t.medicalPrescription}
                </CardTitle>
                <CardDescription className="text-gray-600 mt-1">
                  {t.issuedOn}{" "}
                  {new Date(prescription.created_at).toLocaleDateString()}
                </CardDescription>
              </div>
              <img src={logo} alt="Logo" />
            </div>
          </CardHeader>
          <CardContent className="space-y-8 p-8">
            <div className="grid gap-8">
              <div className="space-y-4">
              
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
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
                                className="bg-blue-100 text-blue-800 text-xs px-3 py-1 font-medium mb-3"
                              >
                                {label.label}
                              </Badge>
                            </div>
                          );
                        case 2:
                          return (
                            <div key={index} className="text-center mb-3">
                              <h3 className="text-2xl font-bold text-gray-900 leading-tight">
                                {label.label}
                              </h3>
                            </div>
                          );
                        case 3:
                          return (
                            <div key={index} className="text-center mb-4">
                              <div className="flex items-center justify-center gap-2">
                                <Stethoscope className="h-4 w-4 text-blue-600" />
                                <p className="text-blue-700 font-semibold text-lg">
                                  {label.label}
                                </p>
                              </div>
                            </div>
                          );
                        case 4:
                          return (
                            <div key={index} className="text-center mb-4">
                              <div className="flex items-center justify-center gap-2">
                                <Pen className="h-5 w-5 text-gray-600" />
                                <p className="text-gray-700 font-medium text-sm">
                                  {label.label}
                                </p>
                              </div>
                            </div>
                          );
                        default:
                          return (
                            <div key={index} className="mb-2 last:mb-0">
                              <div className="bg-gray-50 rounded-md p-3 border border-gray-200">
                                <p className="text-sm text-gray-700">
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
                <div className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                  <Stethoscope className="h-5 w-5" />
                  {t.patientInfo}
                </div>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <p className="flex justify-between">
                    <span className="font-medium text-gray-700">{t.name}</span>
                    <span>
                      {prescription.patient.first_name}{" "}
                      {prescription.patient.last_name}
                    </span>
                  </p>
                  {prescription.patient.age && (
                    <p className="flex justify-between">
                      <span className="font-medium text-gray-700">{t.age}</span>
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
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                <Building className="h-5 w-5" />
                {t.diagnosis}
              </div>
              <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                <p className="font-medium text-blue-900">
                  {prescription.diagnosis.name}
                </p>
              </div>
            </div>
            <Separator />
            {/* Medications */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                <Pill className="h-5 w-5" />
                {t.prescribedMeds}
              </div>
              <div className="space-y-4">
                {prescription.medications.map((med, index) => (
                  <Card key={med.id} className="border-l-4 border-l-green-400">
                    <CardContent>
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {med.brand_dosage_display}
                          </h4>
                          <p className="font-medium text-gray-600 text-sm">
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
                  <div className="flex items-center gap-2 text-lg font-semibold text-gray-900">
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
                  <div className="flex items-center gap-2 text-lg font-semibold text-gray-900">
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
                  <div className="flex items-center gap-2 text-lg font-semibold text-gray-900">
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
          <CardFooter className="bg-gray-50 p-6 flex-col">
            <div className="bg-white rounded-lg p-3 border border-blue-200 shadow-sm w-full">
              <div className="flex items-start gap-3">
                <div className="w-full bg-blue-100 rounded-full flex flex-col items-center justify-center py-4 space-y-2">
                  {prescription.labels
                    .filter((label) => label.order > 4)
                    .sort((a, b) => a.order - b.order)
                    .map((label, index) => (
                      <div key={index} className="flex">
                        <div>
                          {label.order === 5 ? (
                            <MapPin className="w-4 h-4 text-blue-600 me-2" />
                          ) : (
                            <Phone className="w-4 h-4 text-blue-600 me-2" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm text-gray-700 leading-relaxed font-medium">
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
        <div className="mt-8 text-center">
          <Card className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0">
            <CardContent className="p-6">
              <Smartphone className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">{t.getMobileApp}</h3>
              <p className="mb-4 text-indigo-100">{t.getMobileAppDesc}</p>
              <div className="flex gap-3 justify-center">
                <Button
                  variant="secondary"
                  className="bg-white text-indigo-600 hover:bg-indigo-50"
                >
                  <Download className="h-4 w-4 mr-2" />
                  {t.appStore}
                </Button>
                <Button
                  variant="secondary"
                  className="bg-white text-indigo-600 hover:bg-indigo-50"
                >
                  <Download className="h-4 w-4 mr-2" />
                  {t.googlePlay}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

const Prescription: React.FC = () => {
  const [prescription, setPrescription] = useState<PrescriptionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { token } = useParams<{ token: string }>();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      phoneNumber: "",
    },
  });

  const onSubmit = async (data: FormData): Promise<void> => {
    if (!token) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const result: State = await getPrescription(data.phoneNumber, token);
      if (result.status === "success") {
        setPrescription(result.data);
      } else {
        setError(result.message);
      }
    } catch (err) {
      console.log(err)
      setError("An unexpected error occurred. Please Check Your Phone number.");
    } finally {
      setIsLoading(false);
    }
  };

  const currentLanguage = prescription?.language || 'ar';
  const t = translations[currentLanguage as keyof typeof translations] || translations.en;
  const isRTL = currentLanguage === 'ar';

  if (prescription) {
    return <PrescriptionView prescription={prescription} />;
  }

  return (
    <>
      <div className="relative min-h-screen">
        {/* Background content that will be blurred */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-100">
          <div className="max-w-6xl mx-auto px-4 py-12">
            <div className="text-center mb-12">
              <h1 className="text-5xl font-bold text-gray-900 mb-4">
                {t.prescriptionPortal}
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                {t.secureAccess}
              </p>
              {/* App Download CTA in background */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-xl max-w-2xl mx-auto mb-12">
                <div className="flex items-center justify-center gap-4 mb-4">
                  <Smartphone className="h-10 w-10" />
                  <div className="text-left">
                    <h3 className="text-lg font-bold">
                      {t.downloadApp}
                    </h3>
                    <p className="text-blue-100">
                      {t.betterExperience}
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 justify-center">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="bg-white text-blue-600"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {t.appStore}
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="bg-white text-blue-600"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {t.googlePlay}
                  </Button>
                </div>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">{t.secureAccessTitle}</h3>
                <p className="text-gray-600">{t.secureAccessDesc}</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{t.access247}</h3>
                <p className="text-gray-600">{t.access247Desc}</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Smartphone className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{t.mobileApp}</h3>
                <p className="text-gray-600">{t.mobileAppDesc}</p>
              </div>
            </div>
          </div>
        </div>
        {/* Blur overlay */}
        <div className="absolute inset-0 backdrop-blur-sm bg-black/30"></div>
        <div
          dir={isRTL ? 'rtl' : 'ltr'}
          className="relative z-10 min-h-screen flex items-center justify-center px-4"
        >
          <div className="w-full max-w-md">
            <form onSubmit={handleSubmit(onSubmit)}>
              <Card>
                <CardHeader>
                  <CardTitle>{t.enterPhone}</CardTitle>
                  <CardDescription>{t.enterPhoneDesc}</CardDescription>
                  <CardAction>
                    <img src={logo} className="w-8" alt="Logo" />
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
                        {...register("phoneNumber")}
                      />
                      {errors.phoneNumber && (
                        <p className="text-red-500 text-sm">
                          {errors.phoneNumber.message}
                        </p>
                      )}
                    </div>
                    {error && (
                      <div className="text-red-500 text-sm bg-red-50 p-3 rounded-md">
                        {error}
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting || isLoading}
                  >
                    {isSubmitting || isLoading ? t.loading : t.viewPrescription}
                  </Button>
                </CardFooter>
              </Card>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Prescription;
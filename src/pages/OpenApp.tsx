import { useEffect } from "react";
import { Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { translations, type Language } from "@/locales";
import {
  APP_STORE_URL,
  PLAY_STORE_URL,
  WEBSITE_DOWNLOAD_URL,
} from "@/constants/stores";

// The shareable app link: https://patient.rxkhana.com/app(/…).
// If the app is installed, iOS (Universal Links) and Android (App Links) open
// it directly and this page never loads. Otherwise we land here and send the
// visitor to their phone's store, or to the website on a computer.
const getStoreUrl = () => {
  const ua = navigator.userAgent;
  // iPadOS 13+ reports itself as a Mac; touch support gives it away.
  const isIOS =
    /iPhone|iPad|iPod/i.test(ua) ||
    (/Macintosh/i.test(ua) && navigator.maxTouchPoints > 1);
  if (isIOS) return APP_STORE_URL;
  if (/Android/i.test(ua)) return PLAY_STORE_URL;
  return WEBSITE_DOWNLOAD_URL;
};

const OpenApp = () => {
  const language: Language = navigator.language?.startsWith("ar")
    ? "ar"
    : "en";
  const t = translations[language].openApp;

  useEffect(() => {
    window.location.replace(getStoreUrl());
  }, []);

  return (
    <div
      dir={language === "ar" ? "rtl" : "ltr"}
      className="min-h-screen bg-background flex items-center justify-center px-4"
    >
      <div className="w-full max-w-md text-center">
        <div className="flex justify-center mb-6">
          <Logo />
        </div>
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <Smartphone className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">{t.heading}</h1>
        <p className="text-muted-foreground mb-8">{t.description}</p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button
            asChild
            className="rounded-full bg-foreground text-background hover:bg-foreground/90"
          >
            <a href={APP_STORE_URL}>{t.appStore}</a>
          </Button>
          <Button
            asChild
            className="rounded-full bg-foreground text-background hover:bg-foreground/90"
          >
            <a href={PLAY_STORE_URL}>{t.googlePlay}</a>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OpenApp;

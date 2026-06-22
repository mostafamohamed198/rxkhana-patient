import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { Download, Smartphone } from "lucide-react";
import { translations, type Language } from "@/locales";

interface DownloadAppPromoProps {
  language?: Language;
  onSkip: () => void;
}

export function DownloadAppPromo({
  language = "ar",
  onSkip,
}: DownloadAppPromoProps) {
  const t = translations[language].downloadAppPromo;
  const isRTL = language === "ar";
  const playStoreUrl = import.meta.env.VITE_PLAY_STORE_URL as
    | string
    | undefined;
  const appStoreUrl = import.meta.env.VITE_APP_STORE_URL as
    | string
    | undefined;

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className="min-h-screen bg-background flex items-center justify-center px-4"
    >
      <div className="w-full max-w-md text-center">
        <div className="flex justify-center mb-6">
          <Logo />
        </div>
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <Smartphone className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">
          {t.heading}
        </h1>
        <p className="text-muted-foreground mb-8">{t.description}</p>

        <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
          <Button
            asChild={Boolean(appStoreUrl)}
            disabled={!appStoreUrl}
            className="rounded-full bg-foreground text-background hover:bg-foreground/90"
          >
            {appStoreUrl ? (
              <a href={appStoreUrl} target="_blank" rel="noreferrer">
                <Download className="h-4 w-4" />
                {t.appStore}
              </a>
            ) : (
              <>
                <Download className="h-4 w-4" />
                {t.appStore}
              </>
            )}
          </Button>
          <Button
            asChild={Boolean(playStoreUrl)}
            disabled={!playStoreUrl}
            className="rounded-full bg-foreground text-background hover:bg-foreground/90"
          >
            {playStoreUrl ? (
              <a href={playStoreUrl} target="_blank" rel="noreferrer">
                <Download className="h-4 w-4" />
                {t.googlePlay}
              </a>
            ) : (
              <>
                <Download className="h-4 w-4" />
                {t.googlePlay}
              </>
            )}
          </Button>
        </div>

        <button
          type="button"
          onClick={onSkip}
          className="text-sm font-medium text-muted-foreground underline-offset-4 hover:underline cursor-pointer"
        >
          {t.skip}
        </button>
      </div>
    </div>
  );
}

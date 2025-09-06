import * as React from "react";
import { cn } from "@/lib/utils";
import egyptFlag from "@/assets/auth/egypt_flag.svg";

interface PhoneInputProps extends React.ComponentProps<"input"> {
  countryCode?: string;
}

function PhoneInput({
  className,
  type = "tel",
  countryCode = "+20",
  ...props
}: PhoneInputProps) {
  return (
    <div className="relative flex items-center w-full">
      <div className="absolute left-3 flex items-center gap-1.5 pointer-events-none">
        <img src={egyptFlag} alt="Egypt" className="w-4 h-4" />
        <span className="text-sm text-muted-foreground">{countryCode}</span>
      </div>

      <input
        placeholder="01234567890"
        type={type}
        data-slot="input"
        className={cn(
          "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          "pl-[72px]",
          className,
        )}
        {...props}
      />
    </div>
  );
}

export { PhoneInput };

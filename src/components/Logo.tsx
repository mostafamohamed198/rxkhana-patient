import logo from "@/assets/rxkhana-logo.png";

export function Logo({
  className,
}: {
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-2.5 ${className ?? ""}`}>
      <img src={logo} alt="" className="h-8 w-8" />
    </div>
  );
}

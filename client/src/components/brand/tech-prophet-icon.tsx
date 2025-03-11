import { Eye, Zap, Binary } from "lucide-react";

export function TechProphetIcon() {
  return (
    <div className="relative w-12 h-12 flex items-center justify-center">
      {/* Background glow effect */}
      <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-primary/40 rounded-full blur-sm" />
      
      {/* Layered icon composition */}
      <div className="relative flex items-center justify-center">
        <Binary className="absolute w-10 h-10 text-primary/30 animate-pulse" />
        <Eye className="absolute w-8 h-8 text-primary/70" />
        <Zap className="w-4 h-4 text-primary" />
      </div>
    </div>
  );
}

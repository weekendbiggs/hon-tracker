import { ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary: "bg-gold text-white hover:bg-[#B17E1C] shadow-glass",
  secondary: "bg-white text-ink border border-[rgba(61,43,31,0.15)] hover:bg-[#F5F0E8]",
  ghost: "bg-transparent text-ink hover:bg-[rgba(61,43,31,0.06)]",
  danger: "bg-[#9B1B30] text-white hover:bg-[#821726]",
};

const sizes: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm rounded-md",
  md: "px-4 py-2 text-sm rounded-lg",
  lg: "px-5 py-3 text-base rounded-lg",
};

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  { variant = "primary", size = "md", className = "", ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      className={`${variants[variant]} ${sizes[size]} font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      {...rest}
    />
  );
});

export default Button;

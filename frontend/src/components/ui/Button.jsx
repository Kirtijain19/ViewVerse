import clsx from "clsx";

const Button = ({ variant = "primary", size = "md", className, ...props }) => {
  const base = "inline-flex items-center justify-center rounded-xl font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:opacity-50 disabled:pointer-events-none";
  const variants = {
    primary: "bg-brand-500 text-white hover:bg-brand-400 shadow-glow",
    secondary: "bg-slate-800 text-slate-100 hover:bg-slate-700",
    ghost: "bg-transparent text-slate-200 hover:bg-slate-800",
    outline: "border border-slate-700 text-slate-100 hover:bg-slate-800"
  };
  const sizes = {
    sm: "h-9 px-4 text-sm",
    md: "h-11 px-5 text-sm",
    lg: "h-12 px-6 text-base"
  };

  return (
    <button className={clsx(base, variants[variant], sizes[size], className)} {...props} />
  );
};

export default Button;

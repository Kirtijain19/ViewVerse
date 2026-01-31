import clsx from "clsx";

const Input = ({ className, ...props }) => {
  return (
    <input
      className={clsx(
        "w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/40",
        className
      )}
      {...props}
    />
  );
};

export default Input;

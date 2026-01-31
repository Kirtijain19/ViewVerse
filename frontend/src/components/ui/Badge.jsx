import clsx from "clsx";

const Badge = ({ className, ...props }) => {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full bg-slate-800 px-3 py-1 text-xs font-medium text-slate-200",
        className
      )}
      {...props}
    />
  );
};

export default Badge;

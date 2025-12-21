export const formatViews = (n = 0) => {
  const num = Number(n) || 0;
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return String(num);
};

export const timeAgo = (iso) => {
  if (!iso) return '';
  const then = new Date(iso);
  const now = new Date();
  const diff = Math.floor((now - then) / 1000);
  if (diff < 60) return `${diff}s`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d`;
  return then.toLocaleDateString();
};

export const truncate = (str = '', length = 80) =>
  str.length > length ? `${str.slice(0, length - 1)}…` : str;
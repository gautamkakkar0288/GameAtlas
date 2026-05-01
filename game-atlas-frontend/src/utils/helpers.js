/**
 * Format a profile picture URL — handles relative paths from backend
 * and absolute URLs (e.g. Google avatars)
 */
export const getProfilePicUrl = (pic, name = "User") => {
  const fallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6d28d9&color=fff`;
  if (!pic) return fallback;
  if (pic.startsWith("http")) return pic;
  return `${import.meta.env.VITE_API_URL?.replace("/api", "")}/${pic.replace(/\\/g, "/")}`;
};

/**
 * Truncate a string to a max length with ellipsis
 */
export const truncate = (str, maxLen = 100) => {
  if (!str) return "";
  return str.length > maxLen ? str.slice(0, maxLen) + "..." : str;
};

/**
 * Debounce a function call
 */
export const debounce = (fn, delay = 300) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

/**
 * Format a date to a readable string
 */
export const formatDate = (dateStr) => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

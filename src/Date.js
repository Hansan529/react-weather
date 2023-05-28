const date = new Date();
export const dateString = date
  .toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
  .replace(/\.|\s/g, "");

export const dateTime = date
  .toLocaleTimeString("ko-KR", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })
  .replace(/:/g, "");

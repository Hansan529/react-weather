const date = new Date();
const dateString = date
  .toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
  .replace(/\.|\s/g, "");

export default dateString;

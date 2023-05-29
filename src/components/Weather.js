import PropTypes from "prop-types";
import { Link } from "react-router-dom";

function Weather({ baseDate, baseTime, category, obsrValue }) {
  let info;
  let result;
  let icon;
  const A =
    Math.atan2(Number(obsrValue[1]), Number(obsrValue[0])) * (180 / Math.PI);
  const B = (A + 360) % 360;
  console.log("B: ", B);
  switch (category) {
    case "PTY":
      info = "현재 날씨";
      switch (obsrValue) {
        case "0":
          result = "맑음";
          icon = "clear";
          break;
        case "1":
          result = "비";
          icon = "rain";
          break;
        case "2":
          result = "비/눈";
          icon = "rain-snow";
          break;
        case "3":
          result = "눈";
          icon = "snow";
          break;
        default:
          break;
      }
      break;
    case "REH":
      info = "상대 습도";
      result = obsrValue + "%";
      break;
    case "RN1":
      info = "1시간 강수량";
      result = Number(obsrValue) !== 0 ? obsrValue + "mm" : "-";
      break;
    case "T1H":
      info = "현재 기온";
      result = obsrValue + "℃";
      break;
    case "UUU":
      // info = "동서바람성분";
      break;
    case "VEC":
      info = "풍향";
      result = obsrValue + "°";
      break;
    case "VVV":
      // info = "남북바람성분";
      break;
    case "WSD":
      info = "풍속";
      break;
    case "WDN":
      info = "방향";

      switch (true) {
        case obsrValue[0] === String(0) && obsrValue[0] > 0:
          result = "북풍";
          break;
        case obsrValue[0] > 0 && obsrValue[0] < 0:
          result = "북동풍";
          break;
        case obsrValue[0] > 0 && obsrValue[0] === String(0):
          result = "동풍";
          break;
        case obsrValue[0] > 0 && obsrValue[1] > 0:
          result = "남동풍";
          break;
        case obsrValue[0] === "0" && obsrValue[0] < 0:
          result = "남풍";
          break;
        case obsrValue[0] < 0 && obsrValue[0] > 0:
          result = "남서풍";
          break;
        case obsrValue[0] < 0 && obsrValue[0] === "0":
          result = "서풍";
          break;
        case obsrValue[0] < 0 && obsrValue[0] < 0:
          result = "북서풍";
          break;
        default:
          result = "-";
          break;
      }

    default:
      break;
  }
  return (
    <li>
      <p>{info}</p>
      {result} {obsrValue} <i className={icon}></i>
    </li>
  );
}

Weather.propTypes = {
  baseDate: PropTypes.string.isRequired,
  baseTime: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
};

export default Weather;

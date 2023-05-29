import PropTypes from "prop-types";
import { Link } from "react-router-dom";

function Weather({ baseDate, baseTime, category, obsrValue }) {
  let info;
  let result;
  let icon;
  obsrValue = Number(obsrValue);

  switch (category) {
    case "PTY":
      info = "현재 날씨";
      switch (obsrValue) {
        case 0:
          result = "맑음";
          icon = "clear";
          break;
        case 1:
          result = "비";
          icon = "rain";
          break;
        case 2:
          result = "비/눈";
          icon = "rain-snow";
          break;
        case 3:
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
      result = obsrValue !== 0 ? obsrValue + "mm" : "-";
      break;
    case "T1H":
      info = "현재 기온";
      result = obsrValue + "℃";
      break;
    case "VEC":
      info = "풍향";
      result = obsrValue;
      switch (true) {
        case obsrValue === 0:
          result = "북풍";
          break;
        case obsrValue > 0 && obsrValue < 90:
          result = "북동풍";
          break;
        case obsrValue === 90:
          result = "동풍";
          break;
        case obsrValue > 90 && obsrValue < 180:
          result = "남동풍";
          break;
        case obsrValue === 180:
          result = "남풍";
          break;
        case obsrValue > 180 && obsrValue < 270:
          result = "남서풍";
          break;
        case obsrValue === 270:
          result = "서풍";
          break;
        case obsrValue > 270 && obsrValue < 360:
          result = "북서풍";
          break;
        default:
          result = "-";
          break;
      }
      break;
    case "WSD":
      info = "바람";
      result = obsrValue + "m/s";
      break;

    default:
      break;
  }
  return (
    <li>
      <p>{info}</p>
      {result} <i className={icon}></i>
    </li>
  );
}

Weather.propTypes = {
  baseDate: PropTypes.string.isRequired,
  baseTime: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
};

export default Weather;

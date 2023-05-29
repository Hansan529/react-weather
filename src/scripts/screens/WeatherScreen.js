import styles from "../../styles/screens/WeatherScreen.module.css";
import PropTypes from "prop-types";

function WeatherScreen({ baseDate, baseTime, category, obsrValue }) {
  let info;
  let result;
  let icon;
  obsrValue = Number(obsrValue);
  baseTime = Number(baseTime);

  switch (category) {
    case "PTY":
      info = "현재 날씨";
      switch (obsrValue) {
        case 0:
          result = "맑음";
          icon = baseTime < 1800 ? styles.clear : styles.clearN;
          break;
        case 1:
          result = "비";
          icon = styles.rain;
          break;
        case 2:
          result = "비/눈";
          icon = baseTime < 1800 ? styles.rain_snow : styles.rain_snowN;
          break;
        case 3:
          result = "눈";
          icon = baseTime < 1800 ? styles.snow : styles.snowN;
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
      info = "기온";
      result = obsrValue + "℃";
      break;
    case "VEC":
      info = "풍향";
      result = obsrValue;
      switch (true) {
        case obsrValue === 0:
          result = "북풍";
          icon = styles.top;
          break;
        case obsrValue > 0 && obsrValue < 90:
          result = "북동풍";
          icon = styles.topRight;
          break;
        case obsrValue === 90:
          result = "동풍";
          icon = styles.right;
          break;
        case obsrValue > 90 && obsrValue < 180:
          result = "남동풍";
          icon = styles.bottomRight;
          break;
        case obsrValue === 180:
          result = "남풍";
          icon = styles.bottom;
          break;
        case obsrValue > 180 && obsrValue < 270:
          result = "남서풍";
          icon = styles.bottomLeft;
          break;
        case obsrValue === 270:
          result = "서풍";
          icon = styles.left;
          break;
        case obsrValue > 270 && obsrValue < 360:
          result = "북서풍";
          icon = styles.topLeft;
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
    <div>
      <p>{info}</p>
      {icon ? <i className={icon}></i> : null}
      {result}
    </div>
  );
}

// ^ 유효성 검사
WeatherScreen.PropType = {
  baseDate: PropTypes.string.isRequired,
  baseTime: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  obsrValue: PropTypes.string.isRequired,
};

export default WeatherScreen;

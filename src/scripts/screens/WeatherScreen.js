import styles from "../../styles/screens/WeatherScreen.module.css";
import PropTypes from "prop-types";
import device from "../config/Device";

function WeatherScreen({
  index,
  date,
  time,
  category,
  value,
  fcstDate,
  fcstTime,
}) {
  let info;
  let result;
  let icon;
  value = Number(value);
  time = Number(time);
  switch (category) {
    // 공통
    case "PTY":
      info = "날씨";
      switch (value) {
        case 0:
          result = time < 1800 ? "맑음" : "맑음 (밤)";
          icon = time < 1800 ? styles.clear : styles.clearN;
          break;
        case 1:
          result = "비";
          icon = styles.rain;
          break;
        case 2:
          result = "비/눈";
          icon = time < 1800 ? styles.rain_snow : styles.rain_snowN;
          break;
        case 3:
          result = "눈";
          icon = time < 1800 ? styles.snow : styles.snowN;
          break;
        default:
          break;
      }
      break;
    case "REH":
      info = "상대 습도";
      result = value + "%";
      break;
    case "RN1":
      info =
        device === "Android" || device === "iOS" ? "강수량" : "1시간 강수량";
      result = value !== 0 && NaN ? value + "mm" : "-";
      break;
    case "T1H":
      info = "기온";
      result = value + "℃";
      break;
    case "VEC":
      info = "풍향";
      result = value;
      switch (true) {
        case value === 0:
          result = "북풍";
          icon = styles.top;
          break;
        case value > 0 && value < 90:
          result = "북동풍";
          icon = styles.topRight;
          break;
        case value === 90:
          result = "동풍";
          icon = styles.right;
          break;
        case value > 90 && value < 180:
          result = "남동풍";
          icon = styles.bottomRight;
          break;
        case value === 180:
          result = "남풍";
          icon = styles.bottom;
          break;
        case value > 180 && value < 270:
          result = "남서풍";
          icon = styles.bottomLeft;
          break;
        case value === 270:
          result = "서풍";
          icon = styles.left;
          break;
        case value > 270 && value < 360:
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
      result = value + "m/s";
      break;
    // Fcst
    case "LGT":
      info = value !== 0 ? "낙뢰" : null;
      icon = value !== 0 ? styles.lgt : null;
      switch (true) {
        case 1:
          result = "보통 번개";
          break;
        case 2:
          result = "강한 번개";
          break;
        case 3:
          result = "매우 강한 번개";
          break;
        default:
          break;
      }
      break;
    case "SKY":
      info = "하늘상태";
      switch (true) {
        case value === 1:
          result = "맑음";
          icon = time < 1800 ? styles.clear : styles.clearN;
          break;
        case value === 3:
          result = "구름많음";
          icon = time < 1800 ? styles.cloudALot : styles.cloudALotN;
          break;
        case value === 4:
          result = "흐림";
          icon = styles.cloudiness;
          break;
        default:
          break;
      }
      break;

    default:
      break;
  }
  return (
    <div className={`${date}-${fcstTime ? fcstTime : time}-${category}`}>
      {index < 6 && fcstTime ? (
        <p>
          {fcstTime.slice(0, 2)}:{fcstTime.slice(2, 4)}
        </p>
      ) : null}
      {info ? <p>{info}</p> : null}
      {icon ? <i className={icon} title={result}></i> : null}
      {result ? <p className={styles.flexFill}>{result}</p> : null}
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

// Dependencies Package Import
import { useState, useEffect, useCallback } from "react";
import { dateString, dateTime } from "../Date";
import { Link } from "react-router-dom";
import axios from "axios";

// Component Import
import WeatherScreen from "../screens/WeatherScreen";

// Style Import
import "../../styles/components/Weather.css";
import styles from "../../styles/components/Weather.module.css";

// ^ 사용자 정의 태그 생성
export class WeatherElement extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {}
  disconnectedCallback() {}
  attributeChangedCallback() {}
}
customElements.define("weather-component", WeatherElement);

function Weather() {
  const [loading, setLoading] = useState(true);
  const [time, setTime] = useState(
    `${(dateTime.substring(0, 2) - 1).toString().padStart(2, "0")}00`
  );
  const [weather, setWeather] = useState([]);
  const [disabled, setDisabled] = useState(false);

  const length = 24;
  const selectTime = Array.from({ length }, (_, index) => index);
  const getWeather = useCallback(async () => {
    const url = `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst`;
    const options = {
      serviceKey: process.env.REACT_APP_SERVICEKEY,
      pageNo: 1,
      numOfRows: 1000,
      dataType: "JSON",
      base_date:
        Number(dateTime) > 240000
          ? (Number(dateString) - 1).toString()
          : dateString,
      base_time: time,
      nx: 55,
      ny: 127,
    };
    try {
      const resultUrl = decodeURIComponent(
        new URLSearchParams(options).toString()
      );
      const response = await axios.get(`${url}?${resultUrl}`);

      const {
        response: {
          body: {
            items: { item },
          },
        },
      } = await response.data;
      setWeather(
        item.filter(
          (item) => item.category !== "UUU" && item.category !== "VVV"
        )
      );
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  }, [time]);

  // ^Select의 값이 변하면 time 변경, 1초동안 select 비활성화
  const onChange = (e) => {
    setDisabled(true);
    setTime(e.currentTarget.value);
    setTimeout(() => {
      setDisabled(false);
    }, 1000);
  };

  // ^ 최초 렌더링, time과 getWeather의 값이 변하면 재실행
  useEffect(() => {
    getWeather();
  }, [time, getWeather]);

  // ! 렌더링
  return (
    <main>
      <div className={styles.timeSelect}>
        <p>Time</p>
        <select onChange={onChange} disabled={disabled} value={time}>
          {selectTime.map((arr, index) => {
            return (
              <option
                key={index}
                value={`${arr.toString().padStart(2, "0")}00`}
                disabled={dateTime.substring(0, 2) - 1 < index}
              >
                {arr.toString().padStart(2, "0")}시
              </option>
            );
          })}
        </select>
      </div>
      <weather-component>
        {weather.map((arr, index) => (
          <WeatherScreen
            key={index}
            baseDate={arr.baseDate}
            baseTime={arr.baseTime}
            category={arr.category}
            obsrValue={arr.obsrValue}
          />
        ))}
      </weather-component>
    </main>
  );
}

export default Weather;

import { useState, useEffect, useCallback } from "react";
import { dateString, dateTime } from "../Date";
import axios from "axios";
import Weather from "../components/Weather";
import styles from "./Home.module.css";

function Home() {
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
      const WDN = {
        baseDate: `${
          Number(dateTime) > 240000
            ? (Number(dateString) - 1).toString()
            : dateString
        }`,
        baseTime: time,
        category: "WDN",
        nx: 55,
        ny: 127,
        obsrValue: [item[4].obsrValue, item[6].obsrValue],
      };
      const addWdn = [...item, WDN];
      setWeather(addWdn);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  }, [time]);

  const onChange = (e) => {
    setDisabled(true);
    setTime(e.currentTarget.value);
    setTimeout(() => {
      setDisabled(false);
    }, 1000);
  };

  useEffect(() => {
    getWeather();
  }, [time, getWeather]);

  return (
    <div>
      {loading ? (
        <h1>로딩 중...</h1>
      ) : (
        <div id="container">
          <h1>
            <img src="" alt="" /> 날씨{" "}
            {Number(dateTime) > 240000
              ? (Number(dateString) - 1).toString()
              : dateString}
          </h1>
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
                    {arr.toString().padStart(2, "0")}:00
                  </option>
                );
              })}
            </select>
          </div>

          {weather.map((arr, index) => (
            <Weather
              key={index}
              baseDate={arr.baseDate}
              baseTime={arr.baseTime}
              category={arr.category}
              obsrValue={arr.obsrValue}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;

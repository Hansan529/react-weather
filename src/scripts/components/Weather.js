//* Dependencies Package Import
import { useState, useEffect, useCallback } from "react";
import { dateString, dateTime } from "../config/Date";
import { Link } from "react-router-dom";
import axios from "axios";

//* Component Import
import WeatherScreen from "../screens/WeatherScreen";
import { currentLocation } from "../config/Geolocation";

//* Style Import
import "../../styles/components/Weather.css";
import styles from "../../styles/components/Weather.module.css";

//^ Component
function Weather() {
  const [loading, setLoading] = useState(true);
  const [time, setTime] = useState(
    `${(dateTime.substring(0, 2) - 1).toString().padStart(2, "0")}00`
  );
  const [weather, setWeather] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [coordinate, setCoordinate] = useState([]);

  // 24번 option 생성하기 위한 가상 배열 생성
  const length = 24;
  const selectTime = Array.from({ length }, (_, index) => index);

  // 위치 가져오기 성공
  const getCurrentPosition = async (locationData) => {
    await setCoordinate([
      parseInt(locationData.latitude),
      parseInt(locationData.longitude),
    ]);
  };

  // 위치 가져오기 실패
  const failCurrentPosition = (error) => {
    console.log(error);
  };

  // 위치 정보 가져오기
  useEffect(() => {
    currentLocation(getCurrentPosition, failCurrentPosition);
  }, []);

  const getWeather = useCallback(async () => {
    // API 경로
    const url = `https://apiServer.hxan.net/api/weather/`;
    // API 파라미터 값
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
      nx:
        Array.isArray(coordinate) && coordinate.length === 0
          ? 37
          : coordinate[0],
      ny:
        Array.isArray(coordinate) && coordinate.length === 0
          ? 127
          : coordinate[1],
    };
    try {
      // 객체 목록을 파라미터로 변경
      const resultUrl = decodeURIComponent(
        new URLSearchParams(options).toString()
      );
      // API 요청
      const response = await axios.get(`${url}${resultUrl}`);
      // API 데이터 콜백
      const {
        response: {
          body: {
            items: { item },
          },
        },
      } = await response.data;
      // 날씨 설정
      setWeather(
        item.filter(
          (item) => item.category !== "UUU" && item.category !== "VVV"
        )
      );
      // 로딩 종료
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  }, [time, coordinate]);

  // ^Select의 값이 변하면 time 변경, 1초동안 select 비활성화
  const onChange = (e) => {
    setDisabled(true);
    setTime(e.currentTarget.value);
    setTimeout(() => {
      setDisabled(false);
    }, 1000);
  };

  // ^ 최초 렌더링, 시간과 위치 값이 변하면 재실행
  useEffect(() => {
    getWeather();
  }, [time, coordinate]);

  // ! 렌더링
  return (
    <main>
      {loading ? (
        <h2>로딩 중</h2>
      ) : (
        <center-component>
          <h2>초단기실황조회</h2>
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
        </center-component>
      )}
    </main>
  );
}

export default Weather;

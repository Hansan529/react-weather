//* Dependencies Package Import
import { useState, useEffect, useCallback } from "react";
import { dateString, dateTime } from "../config/Date";
import { Link } from "react-router-dom";
import axios from "axios";

//* Component Import
import WeatherScreen from "../screens/WeatherScreen";
import { currentLocation, coordinateToGrid } from "../config/Geolocation";

//* Style Import
import "../../styles/components/Weather.css";
import styles from "../../styles/components/Weather.module.css";

//^ Component
function Weather() {
  const [loading, setLoading] = useState(true);
  const [ultraSrtNcstTime, setUltraSrtNcstTime] = useState(
    `${(dateTime.substring(0, 2) - 1).toString().padStart(2, "0")}00`
  );
  const [ultraSrtNcst, setUltraSrtNcst] = useState([]);
  const [ultraSrtFcst, setUltraSrtFcst] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [coordinate, setCoordinate] = useState([55, 127]);

  // 24번 option 생성하기 위한 가상 배열 생성
  const length = 24;
  const selectTime = Array.from({ length }, (_, index) => index);

  // 위치 가져오기 성공
  const getCurrentPosition = async (locationData) => {
    // 기상청이 사용하는 격자 X, Y로 변환하기
    const result = coordinateToGrid(
      "toXY",
      locationData.latitude,
      locationData.longitude
    );
    await setCoordinate([result.x, result.y]);
  };

  // 위치 가져오기 실패
  const failCurrentPosition = (error) => {
    console.log(error);
  };

  // 위치 정보 가져오기
  useEffect(() => {
    currentLocation(getCurrentPosition, failCurrentPosition);
  }, []);

  // ^ 초단기실황조회
  const getUltraSrtNcst = useCallback(async () => {
    // API 경로
    const url = `https://apiServer.hxan.net/api/weather/getUltraSrtNcst/`;
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
      base_time: ultraSrtNcstTime,
      nx: coordinate[0],
      ny: coordinate[1],
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
      setUltraSrtNcst(
        item.filter(
          (item) => item.category !== "UUU" && item.category !== "VVV"
        )
      );
      // 로딩 종료
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  }, [ultraSrtNcstTime, coordinate]);

  // ^Select의 값이 변하면 time 변경, 1초동안 select 비활성화
  const onChange = (e) => {
    setDisabled(true);
    setUltraSrtNcstTime(e.currentTarget.value);
    setTimeout(() => {
      setDisabled(false);
    }, 1000);
  };

  // ^ 초단기실황조회 최초 렌더링, 시간과 위치 값이 변하면 재실행
  useEffect(() => {
    getUltraSrtNcst();
  }, [ultraSrtNcstTime, getUltraSrtNcst, coordinate]);

  // ! 렌더링
  return (
    <main>
      {loading ? (
        <h2>로딩 중</h2>
      ) : (
        <center-component>
          <h2>초단기실황조회</h2>
          {/* 
          초단기실황
          매시간 30분에 생성되고 10분마다 최신 정보로 업데이트
          기준 시간: 00시 
          생성시간: 00:30 
          Base_time: 0000 
          API제공시간(~이후): 00:40 
          */}
          {/* 
          초단기예보
          매시간 30분에 생성되고 10분마다 최신 정보로 업데이트(기온, 습도, 바람)
          기준 시간: 00시
          생성시각: 00:30
          Base_time: 0030
          API제공시간(~이후): 00:45
          예보시간 (매 발표시각마다 6시간 예보) 
          ㄴ h시~h+1시: 0~1시
          ㄴ h+1시~h+2시: 1~시
          */}
          {/* 
          단기예보
          Base_time: 0200, 0500, 0800, 1100, 1400, 1700, 2000, 2300 (1일 8회)
          API제공시간(~이후): 02:10, 05:10, 08:10, 11:10, 14:10, 17:10, 20:10, 23:10
          */}
          <abbr>매시간 30분에 생성되고 10분마다 최선 정보로 업데이트</abbr>
          <div className={styles.timeSelect}>
            <p>Time</p>
            <select
              onChange={onChange}
              disabled={disabled}
              value={ultraSrtNcstTime}
            >
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
            {ultraSrtNcst.map((arr, index) => (
              <WeatherScreen
                key={index}
                baseDate={arr.baseDate}
                baseTime={arr.baseTime}
                category={arr.category}
                obsrValue={arr.obsrValue}
              />
            ))}
          </weather-component>
          {/* <div className={styles.timeSelect}>
            <p>Time</p>
            <select
              onChange={onChange}
              disabled={disabled}
              value={ultraSrtFcstTime}
            >
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
            {ultraSrtFcst.map((arr, index) => (
              <WeatherScreen
                key={index}
                baseDate={arr.baseDate}
                baseTime={arr.baseTime}
                category={arr.category}
                obsrValue={arr.obsrValue}
              />
            ))}
          </weather-component> */}
        </center-component>
      )}
    </main>
  );
}

export default Weather;

//* Dependencies Package Import
import { useState, useEffect, useCallback } from "react";
import { dateString, dateTime } from "../config/Date";
import axios from "axios";

//* Component Import
import WeatherScreen from "../screens/WeatherScreen";
import { currentLocation, coordinateToGrid } from "../config/Geolocation";

//* Style Import
import "../../styles/components/Weather.css";
import styles from "../../styles/components/Weather.module.css";

//^ Component
function Weather() {
  const [ncstTime, setNcstTime] = useState(
    `${(dateTime.substring(0, 2) - 1).toString().padStart(2, "0")}00`
  );
  const [fcstTime, setFcstTime] = useState(
    dateTime.substring(2, 4) >= 30
      ? `${dateTime.substring(0, 2)}00`
      : `${dateTime.substring(0, 2) - 1}30`
  );
  const [ncst, setNcst] = useState([]);
  const [ncstLoad, setNcstLoad] = useState("");
  const [fcst, setFcst] = useState([]);
  const [fcstLoad, setFcstLoad] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [coordinate, setCoordinate] = useState([55, 127]);

  // 24번 option 생성하기 위한 가상 배열 생성
  const length = 24;
  const selectTime = Array.from({ length }, (_, index) => index);

  // ^ 초단기실황조회
  const weatherNcst = useCallback(async () => {
    // API 경로
    const url = `https://apiServer.hxan.net/api/weather/ncst/`;
    // API 파라미터 값
    const options = {
      pageNo: 1,
      numOfRows: 1000,
      dataType: "JSON",
      base_date:
        Number(dateTime) > 240000
          ? (Number(dateString) - 1).toString()
          : dateString,
      base_time: ncstTime,
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
      setNcst(
        item.filter(
          (item) => item.category !== "UUU" && item.category !== "VVV"
        )
      );
    } catch (error) {
      console.error(error);
    }
  }, [ncstTime, coordinate]);

  // ^ 초단기예측실황
  const weatherFcst = useCallback(async () => {
    // API 경로
    const url = `https://apiServer.hxan.net/api/weather/fcst/`;
    // API 파라미터 값
    const options = {
      pageNo: 1,
      numOfRows: 1000,
      dataType: "JSON",
      base_date:
        Number(dateTime) > 240000
          ? (Number(dateString) - 1).toString()
          : dateString,
      base_time: fcstTime,
      nx: coordinate[0],
      ny: coordinate[1],
    };

    try {
      // 객체 목록을 파라미터로 변경
      const resultUrl = decodeURIComponent(
        new URLSearchParams(options).toString()
      );
      // API 요청
      const response = await axios.get(url + resultUrl);
      // API 데이터 콜백
      const {
        response: {
          body: {
            items: { item },
          },
        },
      } = await response.data;
      // 날씨 설정
      setFcst(
        item.filter(
          (item) => item.category !== "UUU" && item.category !== "VVV"
        )
      );
      // 로딩 종료
    } catch (error) {
      console.error(error);
      setFcstLoad(false);
    }
  }, [fcstTime, coordinate]);
  // ^ 함수
  // 비활성화 함수
  const disabledFnc = () => {
    setDisabled(true);
    setTimeout(() => {
      setDisabled(false);
    }, 1000);
  };

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
    setCoordinate("위치를 찾을 수 없음");
  };

  // ^ 이벤트 함수
  // 초단기실황 시간 변화
  const onChangeNcstTime = (e) => {
    disabledFnc();
    setNcstTime(e.currentTarget.value);
  };
  // 초단기실황 Show/Hide
  const onClickNcst = () => {
    setNcstLoad(ncstLoad ? false : true);
  };

  // 초단기예보 시간 변화
  const onChangeFcstTime = (e) => {
    disabledFnc();
    setFcstTime(e.currentTarget.value);
  };

  // 초단기예보 Show/Hide
  const onClickFcst = (e) => {
    setFcstLoad(fcstLoad ? false : true);
  };

  // ^ 비연속적 렌더링 방식
  // 위치 정보 가져오기
  useEffect(() => {
    currentLocation(getCurrentPosition, failCurrentPosition);
  }, []);

  // 초단기실황 1회 실행
  useEffect(() => {
    weatherNcst();
    onClickNcst();
  }, []);
  // 초단기실황
  useEffect(() => {
    weatherNcst();
  }, [ncstTime, weatherNcst, coordinate]);

  // 초단기예보
  useEffect(() => {
    weatherFcst();
  }, [fcstTime, weatherFcst, coordinate]);

  // 조회 버튼 아이콘 설정
  const moreBtn = (status) => <img src={`${process.env.PUBLIC_URL}/images/icons/angles-${status}-solid.svg`} alt="더보기" />;

  // ! 렌더링
  return (
    <main>
      <center-component>
        <h2
          className={`onClick ${styles.onClickStyle}`}
          onClick={onClickNcst}
          title="30분에 생성되고, 10분마다 정보 업데이트"
        >
          초단기실황조회
          <i className={`${styles.titleIcon} fa-solid fa-angles-down`}>
            {ncstLoad ? moreBtn("up") : moreBtn("down")}
          </i>
        </h2>
        {/* 
          초단기실황
          매시간 30분에 생성되고 10분마다 최신 정보로 업데이트
          기준 시간: 00시 
          생성시간: 00:30 
          Base_time: 0000 
          API제공시간(~이후): 00:40 
          */}
        {/* 
          단기예보
          Base_time: 0200, 0500, 0800, 1100, 1400, 1700, 2000, 2300 (1일 8회)
          API제공시간(~이후): 02:10, 05:10, 08:10, 11:10, 14:10, 17:10, 20:10, 23:10
          */}
        {ncstLoad ? (
          <div className="hiddenContent">
            <div className={styles.timeSelect}>
              <select
                onChange={onChangeNcstTime}
                disabled={disabled}
                value={ncstTime}
              >
                {selectTime.map((arr, index) => {
                  return (
                    <option
                      key={index}
                      value={
                        arr === 0
                          ? "2400"
                          : `${arr.toString().padStart(2, "0")}00`
                      }
                      disabled={dateTime.substring(0, 2) - 1 < index}
                    >
                      {arr.toString().padStart(2, "0")}시
                    </option>
                  );
                })}
              </select>
            </div>
            <weather-component class={styles.weather__result}>
              {ncst.map((arr, index) => (
                <WeatherScreen
                  key={index}
                  index={index}
                  date={arr.baseDate}
                  time={arr.baseTime}
                  category={arr.category}
                  value={arr.obsrValue}
                />
              ))}
            </weather-component>
          </div>
        ) : null}
        <h2
          className={`onClick ${styles.onClickStyle}`}
          onClick={onClickFcst}
          title="30분에 생성되고 10분마다 정보 업데이트(기온, 습도, 바람)"
        >
          초단기예보조회
          <i className={`${styles.titleIcon}`}>
          {fcstLoad ? moreBtn("up") : moreBtn("down")}
          </i>
        </h2>
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
        {fcstLoad ? (
          <div className="hiddenContent">
            <div className={styles.timeSelect}>
              <select
                onChange={onChangeFcstTime}
                disabled={disabled}
                value={`${fcstTime.substring(0, 2)}00`}
              >
                {selectTime.map((arr, index) => {
                  return (
                    <option
                      key={index}
                      value={
                        arr === 0
                          ? "2400"
                          : `${arr.toString().padStart(2, "0")}00`
                      }
                      disabled={
                        Number(dateTime.substring(2, 4)) < 30
                          ? Number(dateTime.substring(0, 2) - 1) < index
                          : dateTime.substring(0, 2) < index
                      }
                    >
                      {index.toString().padStart(2, "0")}시
                    </option>
                  );
                })}
              </select>
            </div>
            <weather-component class={styles.weather__gird6}>
              {fcst.map((arr, index) => (
                <WeatherScreen
                  key={index}
                  index={index}
                  date={arr.baseDate}
                  time={arr.baseTime}
                  fcstTime={arr.fcstTime}
                  category={arr.category}
                  value={arr.fcstValue}
                />
              ))}
            </weather-component>
          </div>
        ) : null}
      </center-component>
    </main>
  );
}

export default Weather;

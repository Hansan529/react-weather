import { useState, useEffect } from "react";
import Movie from "../components/Movie";
import dateString from "../Date";
import axios from "axios";
import Weather from "../components/Weather";

function Home() {
  const [loading, setLoading] = useState(true);
  const [movies, setMovies] = useState([]);
  const [time, setTime] = useState("0600");
  const [weather, setWeather] = useState([]);

  const onChange = async (e) => {
    setTime(e.currentTarget.value);
  };

  const getMovies = async () => {
    const url = `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst`;
    const options = {
      serviceKey: process.env.REACT_APP_SERVICEKEY,
      pageNo: 1,
      numOfRows: 1000,
      dataType: "JSON",
      base_date: dateString,
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
      setWeather(item);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    getMovies();
  }, [time]);

  return (
    <div>
      <select onChange={onChange}>
        <option value="0600">AM 06:00</option>
        <option value="0700">AM 07:00</option>
        <option value="0800">AM 08:00</option>
        <option value="0900">AM 09:00</option>
        <option value="1000">AM 10:00</option>
        <option value="1100">AM 11:00</option>
        <option value="1200">AM 12:00</option>
      </select>
      <h1>기상 상황</h1>
      {loading ? (
        <h1>로딩 중...</h1>
      ) : (
        <div>
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

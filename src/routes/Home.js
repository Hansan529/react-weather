import { useState, useEffect } from "react";
import Movie from "../components/Movie";
import dateString from "../Date";
import axios from "axios";

function Home() {
  const [loading, setLoading] = useState(true);
  const [movies, setMovies] = useState([]);
  const [time, setTime] = useState("0600");
  const [weather, setWeather] = useState([]);

  const getMovies = async () => {
    // const json = await (
    //   await fetch(
    //     `https://kobis.or.kr/kobisopenapi/webservice/rest/boxoffice/searchDailyBoxOfficeList.json?key=f5eef3421c602c6cb7ea224104795888&targetDt=${
    //       dateString - 1
    //     }`
    //   )
    // ).json();
    // const result = json.boxOfficeResult.dailyBoxOfficeList;
    // setMovies(result);

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
      console.log(item);
      setWeather(item);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    getMovies();
  }, []);

  return (
    <div>
      <h1>최신 영화</h1>
      {loading ? (
        <h1>로딩 중...</h1>
      ) : (
        <div>
          {weather[3].obsrValue}
          {/* {movies.map((movie, index) => (
            <Movie
              key={movie.movieCd}
              id={movie.movieCd}
              rank={parseInt(movie.rank)}
              movieNm={movie.movieNm}
              openDt={parseInt(movie.openDt)}
              audiCnt={parseInt(movie.audiCnt)}
              audiAcc={parseInt(movie.audiAcc)}
            />
          ))} */}
        </div>
      )}
    </div>
  );
}

export default Home;

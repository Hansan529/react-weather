import { useState, useEffect } from "react";
import Movie from "../components/Movie";
import dateString from "../Date";

function Home() {
  const [loading, setLoading] = useState(true);
  const [movies, setMovies] = useState([]);

  const getMovies = async () => {
    const json = await (
      await fetch(
        `https://kobis.or.kr/kobisopenapi/webservice/rest/boxoffice/searchDailyBoxOfficeList.json?key=f5eef3421c602c6cb7ea224104795888&targetDt=${
          dateString - 1
        }`
      )
    ).json();
    setMovies(json.boxOfficeResult.dailyBoxOfficeList);
    setLoading(false);
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
          {movies.map((movie) => (
            <Movie
              key={movie.movieCd}
              id={movie.movieCd}
              rank={parseInt(movie.rank)}
              movieNm={movie.movieNm}
              openDt={parseInt(movie.openDt)}
              audiCnt={parseInt(movie.audiCnt)}
              audiAcc={parseInt(movie.audiAcc)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;

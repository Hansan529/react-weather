import { Link, useParams } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import dateString from "../Date";

function Detail() {
  const [loading, setLoading] = useState(true);
  const [movie, setMovie] = useState("");
  const { id } = useParams();
  const getMovie = useCallback(async () => {
    const json = await (
      await fetch(
        `https://kobis.or.kr/kobisopenapi/webservice/rest/boxoffice/searchDailyBoxOfficeList.json?key=f5eef3421c602c6cb7ea224104795888&targetDt=${
          dateString - 1
        }`
      )
    ).json();
    const data = json.boxOfficeResult.dailyBoxOfficeList;
    setMovie(data.filter((item) => item.movieCd === id)[0]);
    setLoading(false);
  }, [id]);
  useEffect(() => {
    getMovie();
  }, [getMovie]);

  const numbering = (num) => Number(num).toLocaleString("ko-KR");
  const increase = (value) => (value > 0 ? `+${value}` : value);

  return (
    <div>
      <Link to="/">이전</Link>
      <h1>Detail</h1>
      {loading ? (
        <h2>로딩 중...</h2>
      ) : (
        <div>
          <h2>{movie.movieNm}</h2>
          <h3>
            순위: {movie.rank}위(
            {increase(movie.rankInten)}) , 발매일: {movie.openDt}
          </h3>
          <p>
            작일 관객수: {numbering(movie.audiCnt)}, 누적 관객수:{" "}
            {numbering(movie.audiAcc)}명
          </p>
          <p>
            전일 대비 관객수 증감: {numbering(movie.audiInten)}명 (
            {increase(movie.audiChange)}
            %)
          </p>
          <p>
            작일 매출액: {numbering(movie.salesAmt)}원, 누적 매출액:{" "}
            {numbering(movie.salesAcc)}원
          </p>
        </div>
      )}
    </div>
  );
}

export default Detail;

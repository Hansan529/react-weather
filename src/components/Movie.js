import PropTypes from "prop-types";
import { Link } from "react-router-dom";

function Movie({ id, rank, movieNm, openDt, audiCnt, audiAcc }) {
  return (
    <li>
      {rank}.{" "}
      <h2>
        <Link to={`/movie/${id}`}>{movieNm}</Link>
      </h2>
      <div>
        [{openDt}] 관객 수 {audiCnt}명, 누적 {audiAcc}명
      </div>
    </li>
  );
}

Movie.propTypes = {
  id: PropTypes.string.isRequired,
  rank: PropTypes.number.isRequired,
  movieNm: PropTypes.string.isRequired,
  audiCnt: PropTypes.number.isRequired,
  audiAcc: PropTypes.number.isRequired,
};

export default Movie;

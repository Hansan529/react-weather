import { dateTime, dateString } from "../config/Date";
import styles from "../../styles/components/Header.module.css";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

function Header() {
  const [location, setLocation] = useState([]);
  const date = new Date();

  return (
    <header>
      <center-component>
        <h1 className={styles.logo__Wrap}>
          <Link to="/">
            <img
              src={`${process.env.PUBLIC_URL}/images/components/logo256.png`}
              alt="logo"
              className={styles.logo}
            />
            <small>기상청 단기예보</small>
          </Link>
        </h1>
        <nav>
          <ul>
            <li>
              <Link to="/">초단기실황조회</Link>
            </li>
          </ul>
        </nav>
        <ul className="toDay">
          <li>
            <p>
              {date.getMonth() + 1}월 {date.getDate()}일
            </p>
          </li>
        </ul>
      </center-component>
    </header>
  );
}

export default Header;

import { dateTime, dateString } from "../config/Date";
import styles from "../../styles/components/Header.module.css";

function Header() {
  const date = new Date();
  return (
    <header>
      <div>
        <h1 className={styles.logo}>로고 자리</h1>
        <nav>
          <ul>
            <li>
              {date.getMonth() + 1}월 {date.getDate()}일
            </li>
          </ul>
        </nav>
      </div>
      <div>
        <p>날씨</p>
      </div>
    </header>
  );
}

export default Header;

import styles from "../../styles/components/Footer.module.css";

function Footer() {
  return (
    <footer>
      <center-component>
        <div>
          <h3>사용한 API</h3>
          <ul className={styles.ul}>
            <li>
              <a
                href="https://www.data.go.kr/tcs/dss/selectApiDataDetailView.do?publicDataPk=15084084"
                target="_blank"
                rel="noreferrer"
              >
                <i>
                  <picture>
                    <source
                      srcSet={`${process.env.PUBLIC_URL}/images/components/logo-government.svg`}
                      media="(min-width: 1200px)"
                      width="40"
                      height="40"
                    />
                    <img
                      src={`${process.env.PUBLIC_URL}/images/components/logo-government.svg`}
                      alt="github"
                      width="30"
                      height="30"
                    />
                  </picture>
                </i>
                기상청 단기예보
              </a>
            </li>
            <li>
              <a
                href="https://developers.kakao.com/docs/latest/ko/local/dev-guide#coord-to-address"
                target="_blank"
                rel="noreferrer"
              >
                <i className={styles.kakaoLogo}>
                  <picture>
                    <source
                      srcSet={`${process.env.PUBLIC_URL}/images/components/logo-kakao.svg`}
                      media="(min-width: 1200px)"
                      width="40"
                      height="40"
                    />
                    <img
                      src={`${process.env.PUBLIC_URL}/images/components/logo-kakao.svg`}
                      alt="github"
                      width="25"
                      height="25"
                    />
                  </picture>
                </i>
                카카오 지도 (주소)
              </a>
            </li>
            <li>
              <a
                href="https://github.com/Hansan529/react-weather"
                target="_blank"
                rel="noreferrer"
              >
                <i>
                  <picture>
                    <source
                      srcSet={`${process.env.PUBLIC_URL}/images/components/logo-github.svg`}
                      media="(min-width: 1200px)"
                      width="40"
                      height="40"
                    />
                    <img
                      src={`${process.env.PUBLIC_URL}/images/components/logo-github.svg`}
                      alt="github"
                      width="30"
                      height="30"
                    />
                  </picture>
                </i>
                소스코드
              </a>
            </li>
          </ul>
        </div>
        <div className={styles.userAgent}>{navigator.userAgent}</div>
        <a
          href="https://www.flaticon.com/free-icons/weather-forecast"
          title="weather forecast icons"
        >
          Weather forecast icons created by Rosa Suave - Flaticon
        </a>
      </center-component>
    </footer>
  );
}

export default Footer;

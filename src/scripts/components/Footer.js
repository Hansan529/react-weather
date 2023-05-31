function Footer() {
  return (
    <footer>
      <div>
        <p>사용한 API</p>
        <div>
          <small>
            <a
              href="https://www.data.go.kr/tcs/dss/selectApiDataDetailView.do?publicDataPk=15084084"
              target="_blank"
            >
              기상청 단기예보
            </a>
          </small>
          <small>
            <a
              href="https://developers.kakao.com/docs/latest/ko/local/dev-guide#coord-to-address"
              target="_blank"
            >
              카카오 지도 (주소)
            </a>
          </small>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

import { dateTime, dateString } from "../config/Date";
import styles from "../../styles/components/Header.module.css";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { coordinateToGrid, currentLocation } from "../config/Geolocation";
import axios from "axios";

function Header() {
  const [locationCoordinate, setLocationCoordinate] = useState([
    37.5642135, 127.0016985,
  ]);
  const [showAddress, setAddress] = useState("");
  const [addressLoad, setAddressLoad] = useState(false);
  const date = new Date();

  // 위치 가져오기 성공
  const getCurrentPosition = async (locationData) => {
    // 기상청이 사용하는 격자 X, Y로 변환하기
    setLocationCoordinate([locationData.latitude, locationData.longitude]);
    // 해당 경위도를 갖고 검색 파라미터로 변경
    const params = decodeURIComponent(
      new URLSearchParams({
        x: locationData.longitude,
        y: locationData.latitude,
        input_coord: "WGS84",
      }).toString()
    );
    // API 요청
    const { documents } = await (
      await axios.get(
        `https://apiServer.hxan.net/api/coordinate/coord2Address/${params}`,
        {
          headers: {
            Authorization: `KakaoAK ${process.env.REACT_APP_KAKAO_REST_API_KEY}`,
          },
        }
      )
    ).data;
    const { address } = documents[0];
    setAddress(address);
    setAddressLoad(true);
  };

  // 위치 가져오기 실패
  const failCurrentPosition = (error) => {
    console.log(error);
  };

  // ^ 비연속적 렌더링 방식
  useEffect(() => {
    currentLocation(getCurrentPosition, failCurrentPosition);
  }, []);

  return (
    <header>
      <center-component>
        <h1 className={styles.logo__Wrap}>
          <Link to="/">
            <picture>
              <source
                srcSet={`${process.env.PUBLIC_URL}/images/components/logo512.png`}
                media="(-webkit-min-device-pixel-ratio: 2)"
                type="image/png"
                width="64"
              />
              <img
                src={`${process.env.PUBLIC_URL}/images/components/logo64.png`}
                alt="logo"
              />
            </picture>
            <small>기상청 단기예보</small>
          </Link>
        </h1>
        <div>
          <p>
            {addressLoad
              ? `${showAddress.region_1depth_name} ${showAddress.region_2depth_name}`
              : "서울"}
          </p>
        </div>
        <ul className="toDay">
          <li>
            <p>
              {date.getMonth() + 1}월 {date.getDate()}일
            </p>
            <p>접속: {window.devicePixelRatio > 1 ? "모바일" : "데스크탑"}</p>
          </li>
        </ul>
      </center-component>
    </header>
  );
}

export default Header;

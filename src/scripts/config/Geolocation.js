// ^ 현재 위치 API
export function currentLocation(onSuccess, onFail) {
  // 위치 정보 액세스 동의 요청
  if (navigator.geolocation) {
    // 위치 정보 가져오기
    navigator.geolocation.getCurrentPosition(
      // 성공 시 locationData에 객체로 latiude, longitude 위도, 경도값 저장 후 onSuccess에 콜백함
      (position) => {
        const locationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        onSuccess(locationData);
      },
      // 실패 시 error를 콜백함
      (error) => {
        onFail(error);
      }
    );
    // 위치 정보 액세스에 동의하지 않거나 지원하지 않는 경우
  } else {
    alert("현재 위치를 확인 할 수 없습니다.");
  }
}

// 기상청 격자 좌표로 변환
// 좌표 -> XY coordinateToGrid("toXY", latitude, longitude)
// XY -> 좌표 coordinateToGrid("toLatLng", X, Y) * 정확하지 않음
export function coordinateToGrid(code, v1, v2) {
  /**
   * 정보
   * 지도투영: Lambert-Conformal map projection
   * 지구반경: 6371.00877 km (중위도 평균 지구반경)
   * PI: 3.141592
   * 실측거리 대응 위도true lat.): 30.N, 60.N
   * 기준 위경도 기준경도: 126.0E 기준위도 38.0N
   * 기준 위도 기준경도 대응 격자점(Dot point 기준): 남북방향Yo: 136, 동서방향 Xo: 43
   * 격자점 간격: 5km
   * 격자수: 가로 149격자(745km), 세로 253격자 (1,265km)
   * 4개 모서리 격자점 위경도:
   * 좌측상단(43.3935, 123.3102)
   * 좌측하단(31.7944, 123.7613)
   * 우측상단(43.2175, 132.7750)
   * 우측하단(31.6518, 131.6423)
   */
  let RE = 6371.00877; // 지구 반경(km)
  let GRID = 5.0; // 격자 간격(km)
  let SLAT1 = 30.0; // 표준위도(degree)
  let SLAT2 = 60.0; // 표준위도 (degree)
  let OLON = 126.0; // 기준점의 경도 (degree)
  let OLAT = 38.0; // 기준점의 위도 (degree)
  let XO = 43; // 기준점의 X좌표 [격자거리]
  let YO = 136; // 기준점의 Y좌표 [격자거리]

  const DEGRAD = Math.PI / 180.0;
  const RADDEG = 180.0 / Math.PI;

  const re = RE / GRID;
  const slat1 = SLAT1 * DEGRAD;
  const slat2 = SLAT2 * DEGRAD;
  const olon = OLON * DEGRAD;
  const olat = OLAT * DEGRAD;

  let sn =
    Math.tan(Math.PI * 0.25 + slat2 * 0.5) /
    Math.tan(Math.PI * 0.25 + slat1 * 0.5);
  sn = Math.log(Math.cos(slat1) / Math.cos(slat2)) / Math.log(sn);
  const sf = Math.tan(Math.PI * 0.25 + slat1 * 0.5);
  const sfPow = (Math.pow(sf, sn) * Math.cos(slat1)) / sn;
  const ro = Math.tan(Math.PI * 0.25 + olat * 0.5);
  const roCalc = (re * sfPow) / Math.pow(ro, sn);
  const rs = {};

  if (code === "toXY") {
    rs["lat"] = v1;
    rs["lng"] = v2;
    let ra = Math.tan(Math.PI * 0.25 + v1 * DEGRAD * 0.5);
    ra = (re * sfPow) / Math.pow(ra, sn);
    let theta = v2 * DEGRAD - olon;

    if (theta > Math.PI) {
      theta -= 2.0 * Math.PI;
    }

    if (theta < -Math.PI) {
      theta += 2.0 * Math.PI;
    }

    theta = theta * sn;
    rs["x"] = Math.floor(ra * Math.sin(theta) + XO + 0.5);
    rs["y"] = Math.floor(roCalc - ra * Math.cos(theta) + YO + 0.5);
  } else if (code === "toLatLng") {
    rs["x"] = v1;
    rs["y"] = v2;
    const xn = v1 - XO;
    const yn = roCalc - v2 + YO;
    let ra = Math.sqrt(xn * xn + yn * yn);

    if (sn < 0.0) {
      ra = -ra;
    }

    let alat = Math.pow((re * sfPow) / ra, 1.0 / sn);
    alat = 2.0 * Math.atan(alat) - Math.PI * 0.5;

    let theta;
    if (Math.abs(xn) <= 0.0) {
      theta = 0.0;
    } else {
      if (Math.abs(yn) <= 0.0) {
        theta = Math.PI * 0.5;
        if (xn < 0.0) {
          theta = -theta;
        }
      } else {
        theta = Math.atan2(xn, yn);
      }
    }

    const alon = theta / sn + olon;
    rs["lat"] = alat * RADDEG;
    rs["lng"] = alon * RADDEG;
  }
  return rs;
}

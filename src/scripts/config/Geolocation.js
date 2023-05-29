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

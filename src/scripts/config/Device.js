const environment = navigator.userAgent;
const touch = navigator.maxTouchPoints;
const screenWidth = window.screen.availWidth;
let environmentResult;
switch (true) {
  case Boolean(environment.match(/Android/i)):
    environmentResult = "Android";
    break;
  // window
  case Boolean(environment.match(/Window/i)) && touch === 0:
    environmentResult = "Window Desktop";
    break;
  // iPhone 375 ~ 744
  case Boolean(environment.match(/iPhone/i)) ||
    (touch > 1 && screenWidth >= 375 && screenWidth < 744):
    environmentResult = "iOS";
    break;
  // iPad 744 ~ 1200
  case Boolean(environment.match(/iPad/i)) ||
    (touch > 1 && screenWidth >= 744 && screenWidth < 1024):
    environmentResult = "iPad OS";
    break;
  // Mac 1200 ~
  case Boolean(environment.match(/Mac OS/i)) ||
    (touch === 0 && screenWidth >= 1024):
    environmentResult = "Mac OS";
    break;

  default:
    break;
}

export default environmentResult;

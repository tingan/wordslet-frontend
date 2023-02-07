export function check_loggedin() {
  if (localStorage.getItem("token")) {
    return true;
  } else {
    return false;
  }
}

export function get_user() {
  const token = localStorage.getItem("token");
  if (!token) return null;
  const encodedPayload = token.split(".")[1];
  return JSON.parse(window.atob(encodedPayload));
}

export function get_token() {
  const token = localStorage.getItem("token");
  if (!token) return null;
  return token;
}

export function isValidEmail(email) {
  return /\S+@\S+\.\S+/.test(email);
}

export function shuffle_array(arrayOld) {
  const array = [...arrayOld];
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function speech(char) {
  if ("speechSynthesis" in window) {
    // Speech Synthesis supported 🎉
    var msg = new SpeechSynthesisUtterance();
    msg.text = char;
    msg.lang = "zh-CN";
    msg.voice = speechSynthesis.getVoices().filter(function (voice) {
      return voice.name == "Google 普通话（中国大陆）";
    })[0];
    window.speechSynthesis.speak(msg);
  }
}

export function shuffle(arr) {
  let array = [...arr];
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

export function appendObjTo(thatArray, newObj) {
  const frozenObj = Object.freeze(newObj);
  return Object.freeze(thatArray.concat(frozenObj));
}

let answers = new Array(8);
let on_game = false;
let userName = 'DEFAULT';
const MAX_FAILURE_CNT = 10;
var time_spent;

// init initializes user name and answers.
function init() {
  // get user name
  userName = prompt('사용자 이름을 입력하세요.', 'DEFAULT');

  for (let i = 0; i < 8; i++) {
    // generate a random integer in [0, 23]
    var randomNbr = Math.floor(24 * Math.random());
    // remove duplicates
    while (answers.includes(randomNbr))
      randomNbr = Math.floor(24 * Math.random());
    answers[i] = randomNbr;
  }
}

function startGame() {
  document.getElementById('start_btn').style.backgroundColor = 'green';
  document.getElementById('start_msg').innerHTML = '';
  document.getElementById('info').innerHTML = '숨은 그림을 보세요.';

  let startCnt = 5;
  document.getElementById('time_left').innerHTML = startCnt;

  answers.forEach((answer) => {
    document.getElementById('card' + answer.toString()).src = '../assets/img2.gif';
  });

  var cnt = setInterval(function () {
    if (startCnt == 1) {
      clearInterval(cnt);
      answers.forEach((answer) => {
        document.getElementById('card' + answer.toString()).src = '../assets/img1.gif';
      });
      on_game = true;
      onGame();
    }
    startCnt--;
    document.getElementById('time_left').innerHTML = startCnt;
  }, 1000)
}

function onGame() {
  let timeOut = 16;
  document.getElementById('time_left').innerHTML = timeOut;

  var cnt = setInterval(function () {
    if (timeOut == 1) {
      clearInterval(cnt);
      alert('Fail! Time Out!');
      return;
    }
    if (parseInt(document.getElementById('failure_cnt').innerHTML) > MAX_FAILURE_CNT) {
      clearInterval(cnt);
      alert('Fail! Max Failure Exceeded!');
      return;
    }
    if (parseInt(document.getElementById('remain_cnt').innerHTML) == 0) {
      clearInterval(cnt);
      alert('Success!');
      // TODO: Ranking System
      return;
    }
    timeOut--;
    document.getElementById('time_left').innerHTML = timeOut;
  }, 1000);

  // TODO: alert ranking info.
}

// flipOver decreases remain count if selected card is answer else increases failure count.
function flipOver(id) {
  if (!on_game)
    return;

  const idx = parseInt(id.replace('card', ''));
  if (answers.includes(idx)) {
    document.getElementById(id).src = '../assets/img2.gif';
    document.getElementById('remain_cnt').innerHTML--;
  } else
    document.getElementById('failure_cnt').innerHTML++;
}

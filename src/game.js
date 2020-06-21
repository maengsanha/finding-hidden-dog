let answers = new Array(8);
let on_game = false;
let userName = 'DEFAULT';
const MAX_FAILURE_CNT = 10;

// init initializes user name and answers.
function init() {
  // get user name
  userName = prompt('사용자 이름을 입력하세요.', 'DEFAULT');

  for (let i = 0; i < answers.length; i++) {
    // generate a random integer in [0, 23]
    var randomNbr = Math.floor(24 * Math.random());
    // remove duplicates
    while (answers.includes(randomNbr))
      randomNbr = Math.floor(24 * Math.random());
    answers[i] = randomNbr;
  }
} // end init.

// startGame shows answers for 5 seconds.
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
} // end startGame.

// onGame alerts success or failure. If succeeded, show ranking informations.
function onGame() {
  document.getElementById('info').innerHTML = '최대 실패 가능 횟수: 10';
  let timeOut = 16;
  document.getElementById('time_left').innerHTML = timeOut;
  const time_start = new Date().getTime();

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
      const time_end = new Date().getTime();
      const time_spent = time_end - time_start;
      alert('time spent: ' + time_spent / 1000 + 'sec');
      // endGame(time_spent / 1000);
      return;
    }
    timeOut--;
    document.getElementById('time_left').innerHTML = timeOut;
  }, 1000);
} // end onGame.

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
} // end flipOver.

// endGame sends score data to Firebase, receives top 10 scores.
function endGame(timeSpent) {
  if (userName == 'DEFAULT')
    timeSpent = -1;
  // insert score data into FireStore

  // end sending data

  // get top 10 scores.

  // end getting data

  return;
} // end endGame.

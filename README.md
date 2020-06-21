### 숨어있는 강아지 찾기

- 프로젝트 목표

  숨어 있는 강아지 찾기 게임의 기본 상황을 포함하여 업그레이드된 게임을 제작



- GitHub repository: `https://github.com/joshua-dev/finding-hidden-dog`

  

1. 개요

   

   제한 시간 안에 숨겨진 강아지를 모두 찾고, 걸린 시간을 기준으로 랭킹을 올릴 수 있는 게임이다.

   화면 구현은 html과 css, javascript를 사용했고 랭킹 정보를 저장하기 위해 [Google Firebase](https://firebase.google.com/)를 사용했다.

   

2. 화면 구성

   

   1. 로그인 화면

      

      <img src="https://user-images.githubusercontent.com/62831866/85227079-f7078700-b415-11ea-9fd0-3152cbdb11f8.png">

      `src` 폴더의 `index.html`을 열어 게임을 시작한다.

      우선 사용자 이름을 입력한다. (기본 값인 DEFAULT를 사용할 경우엔 점수가 랭킹에 반영되지 않으니 주의!)

      `게임 시작` 버튼을 누르면 게임이 시작된다.

   

   2. 게임 시작 화면

      

      <img src="https://user-images.githubusercontent.com/62831866/85227286-819cb600-b417-11ea-85c1-d7007e193233.png">

      게임이 시작되면 숨겨진 강아지들을 5초 간 보여주고, 5초가 지나면 다시 알에 숨는다.

      

   3. 게임 성공

      

      <img src="https://user-images.githubusercontent.com/62831866/85227345-d3ddd700-b417-11ea-81b1-879a01fb3d34.png">

      제한 시간 안에 강아지들을 모두 찾으면 사용자 이름과 소요 시간이 데이터베이스에 저장되고 상위 10위까지의 랭킹 정보를 보여준다.

      

   4. 게임 실패 (최대 실패 횟수 초과)

      

      <img src="https://user-images.githubusercontent.com/62831866/85227388-199a9f80-b418-11ea-8859-edf60b94e83c.png">

      최대 실패 횟수를 초과할 경우 게임이 즉시 종료된다.

      

   5. 게임 실패 (제한 시간 초과)

      

      <img src="https://user-images.githubusercontent.com/62831866/85227398-2a4b1580-b418-11ea-885e-6319609bf025.png">

      제한 시간을 초과할 경우에도 게임이 즉시 종료된다.





3. 소스 코드 설명

   

   1. game.js

      

      다음과 같은 함수들로 구성된다.

      

      - init: 사용자 이름을 입력 받고 강아지가 숨을 알 8개를 랜덤하게 선택

        ```javascript
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
        ```

        

      - startGame: 게임이 시작되면 html 요소들의 값을 변경하고 숨겨진 강아지들을 5초 간 보여줌

        ```javascript
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
        ```

        

      - onGame: 16초 간 카운트 다운하며 게임 성공인지, 실패인지를 판별

        ```javascript
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
        ```

        

      - flipOver: 게임 도중 사용자가 알 사진을 클릭했을 때, 정답인지 오답인지 판별

        ```javascript
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
        ```

        

      - endGame: 게임 성공 시 랭킹 정보를 업데이트하고 상위 10위까지의 정보를 보여줌

        ```javascript
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
        
        ```

        

   2. index.js

      

      게임 성공 시 점수 정보를 데이터베이스에 저장하는 **insert**함수와 상위 10위까지의 랭킹 정보를 반환하는 **get** 함수로 구성된다.

      Firebase는 **FaaS**(Function as a Service) 방식을 따르므로 프로젝트 생성 후 함수만 작성하여 배포하면 즉시 사용 가능하다는 장점이 있다.

      데이터베이스로 사용한 **FireStore**는 NoSQL DB로, 쿼리문이 javascript 문법과 유사하여 개발자 친화적이라는 장점이 있다.

      

      1. insert

         public DNS(IPv4): `https://us-central1-finding-hidden-dog.cloudfunctions.net/insert`

         ```javascript
         // insert inserts data into database.
         exports.insert = functions.https.onRequest((request, response) => {
           // add new data into database.
           db.collection('scores')
             .doc()
             .set({
               user_name: request.body.user_name,
               time_spent: parseFloat(request.body.time_spent)
             });
         })  // end insert.
         ```

         사용자 이름과 소요 시간을 담은 데이터를 요청의 body로 받아 DB에 저장한다.

         

      2. get

         public DNS(IPv4): `https://us-central1-finding-hidden-dog.cloudfunctions.net/get`

         ```javascript
         // get gets top ten score datas from database.
         exports.get = functions.https.onRequest((request, response) => {
           response.send(
             db.collection('scores')
               .where('time_spent', '>', 0)
               .orderBy('time_spent')
               .limit(10));
         })  // end get.
         ```

         DB에서 상위 10위까지의 랭킹 정보를 반환한다.

         이 때, 걸린 시간이 0 이하일 경우 비정상 데이터라고 판단하여 결과에 포함시키지 않는다.


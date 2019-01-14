#node.js (express) 기본서버정리

1. 미들웨어
익스프레스 프레임워크의 장점 중 하나가 미들웨어를 사용한다는 겁니다. Middleware가 뭘까요? 이름처럼 요청에 대한 응답 과정 중간에 껴서 어떠한 동작을 해주는 프로그램입니다. 익스프레스는 요청이 들어올 때 그에 따른 응답을 보내주는데요. 응답을 보내기 전에 미들웨어가 지정한 동작을 수행합니다. 전 시간에 보았던 express.static이 미들웨어의 한 종류로, 정적 파일의 기본 경로를 정해주는 역할을 합니다.

미들웨어에는 수 많은 것들이 있는데 대표적으로 Morgan, Compression, Session, Body-parser, Cookie-parser, Method-override, Cors, Multer 등이 있습니다. 모두 npm에서 다운받을 수 있습니다. 

간단히 소개하자면, Morgan은 익스프레스 프레임워크가 동작하면서 나오는 메시지들을 콘솔에 표시해줍니다. Compression은 이름처럼 페이지를 압축해서 전송해주고요. Session은 세션을, Body-parser은 폼에서 전송되는 POST 값을, Cookie-parser는 쿠키를 사용할 수 있게 해줍니다. Method-override는 REST API에서 PUT과 DELETE 메소드를 사용할 수 있게 합니다. Cors는 크로스오리진(다른 도메인 간의 AJAX 요청)을 가능하게 하고요. Multer는 파일업로드를 할 때 주로 쓰입니다.

전 시간에 봤던 express.static도 미들웨어의 한 종류입니다. 예전에는 상술했던 대부분의 미들웨어가 express에 포함되어 있었지만 이제는 express.static을 제외하고 다 분리되어 따로 npm install로 설치해야합니다.


2. next() 는 프로미스다.
작업순서가 순차적으로 지정되는것 동기적으로 실행되는것이다.
특정작업후 특정작업을 수행할 수도 있습니다. 

app.use(({next}) => { // next 가 객체이니까 {}안에 넣어줘야됨 es6
  console.log('use-2');
  next();
});



3. 라우터 
클라이언트에서 보내는 주소에 따라 다른 처리를 하는 것을 의미하는데요. 익스프레스는 REST API에 따라 처리하는 데 그 방법이 아주 간단합니다.

app 객체에 app[REST메소드]('주소', 콜백함수) 이렇게 연결하는데요. 앞에서 app.get('/', 콜백) 하는 것을 보셨죠? 바로 / 주소로 GET 요청이 올 때 콜백하라고 등록한 겁니다. app.get 외에, app.post, app.put, app.delete 메소드를 사용합니다. (put과 delete를 사용하려면 위에서 알려드린 method-override 패키지를 설치해야합니다)

주소 부분은 정규 표현식도 가능하고 :(콜론)을 사용한 와일드카드도 가능합니다. 예를 들어 app.get('/post/:id')인 경우 /post/a도 적용되고, /post/b도 적용됩니다.

와일드카드를 사용할 때는 순서가 중요합니다.

app.get('/post/:id', () => {});
app.get('/post/a', () => {});
이렇게 되어있다면 /post/a에 요청이 왔을 때 한 눈에 보기엔 사람들은 두 번째 라우터에 걸릴거라고 생각하지만 /post/:id에 먼저 걸립니다. /post/a의 콜백 함수는 실행되지 않습니다. 따라서 와일드카드 라우터는 항상 다른 라우터들보다 뒤에 적어주는 것이 좋습니다.

이렇게 app에 계속 이벤트 리스너처럼 연결하면 되는데, 라우팅은 반복되는 부분이 많기 때문에 주로 모듈로 분리해서 사용합니다. server.js에서 라우팅 부분을 지우고, route.js 파일을 만들어봅시다.

route.js

const express = require('express');
const path = require('path');
const router = express.Router(); // 라우터 분리
router.get('/', (req, res) => { // app 대신 router에 연결
  res.sendFile(path.join(__dirname, 'html', 'main.html'));
});
router.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'html', 'about.html'));
});
module.exports = router; // 모듈로 만드는 부분
express에서는 express.Router()을 사용해 라우터를 분리할 수 있습니다. module.exports가 바로 모듈을 만드는 코드입니다. 이 부분이 있어야 다른 파일에서 여기서 export한 것을 require할 수 있습니다. 모듈 시스템에 대한 자세한 강좌는 여기를 참고하세요. 

이렇게 만든 route.js파일을 server.js에서 불러옵니다. 이전 시간과 변화는 없지만 코드를 분리했다는 것에 의미를 둡시다. 이렇게 코드를 잘게 분리해야 나중에 유지보수가 쉽습니다. 수백 수천 줄이 있는 하나의 긴 파일에서 코드를 찾는 것보다는 기능별로 분리된 파일에서 찾는 게 더 쉽겠죠?

const route = require('./route.js');
...
app.use('/', route);
app.use((req, res, next) => { // 404 처리 부분
  res.status(404).send('일치하는 주소가 없습니다!');
});
app.use((err, req, res, next) => { // 에러 처리 부분
  console.error(err.stack); // 에러 메시지 표시
  res.status(500).send('서버 에러!'); // 500 상태 표시 후 에러 메시지 전송
});
app.listen(8080, ...);
제일 위에 const route = require('./routes.js');를 했는데 이 부분이 route 변수에 아까 module.exports로 export했던 router을 연결하겠다는 뜻입니다. app.use로 라우팅을 하는 것의 장점은, 그룹화가 쉽다는 겁니다. app.use('/category', route1); 이런 코드가 있으면 route1에 있는 라우터들은 모두 category 주소 아래에 그룹화됩니다. route1에 router.get('/javascript', 콜백)라는 코드가 있다면, 자동으로 '/category/javascript' 주소로 연결됩니다.

에러 처리 부분을 볼까요. 먼저 위의 라우터에서 하나도 일치하는 라우트가 없을 때 404 에러를 브라우저로 돌려줍니다. 404 에러는 서버의 에러가 아니기 때문에 딱히 서버에 기록하거나 하지는 않습니다.

그 아래는 서버 에러를 처리하는 부분입니다. 일반 app.use에 비해 err 매개변수 하나가 더 있습니다. 바로 next(err)로 넘겨줬던 에러가 최종적으로 도착하는 부분입니다. next(err)가 호출되는 순간 다른 app.use는 모두
건너뛰고 바로 err 매개변수가 있는 app.use로 넘어옵니다. 이 부분이 없으면 next로 에러를 넘겨주었을 시 처리할 부분이 없어 서버가 죽어버립니다. 에러를 기록하고 브라우저에 서버에서 에러가 발생했다고 알려줍니다.


4. REST API 
웹 어플리케이션에서 데이터베이스 정보를 입력하고 읽어 와야됩니다.
그런데 웹브라우저에서 데이터베이스를 직접 접속해서 바꿀수 있다면 보안상 문제가 됩니다. 그래서 일반적으로 REST API를 만들어 사용합니다.

REST API는 요청 종류에 따라 get,post,delete,put,patch를 사용합니다.


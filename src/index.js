export default function BaseballGame() {
  let _computerInputNumber = getComputerInputNumber();
  let _retryCount = 0;
  addSubmitButtonEvent();
  
  /*
   ** Play Game
   */

  function printResult({ strikeCount, ballCount }) {
    let $result = document.getElementById('retryResult');
    if (!$result) {
      $result = document.getElementById('result');
      $result.innerHTML += `<div id="retryResult"></div>`;
      $result = document.getElementById('retryResult');
    }

    let result = '';
    if (strikeCount === 0 && ballCount === 0) {
      result = '낫싱';
    }
    result += ballCount === 0 ? '' : `${ballCount}볼`;
    result += strikeCount === 0 ? '' : `${strikeCount}스트라이크`;

    $result.innerHTML += `<p>${result}</p>`;
    return result;
  }

  function getStrikeBall({ computerInputNumbers, userInputNumbers }) {
    let ballCount = 0;
    let strikeCount = 0;
    for (let i = 0; i < 3; i++) {
      if (computerInputNumbers[i] === userInputNumbers[i]) {
        strikeCount++;
      } else {
        if (computerInputNumbers.includes(userInputNumbers[i])) {
          ballCount++;
        }
      }
    }
    return { strikeCount, ballCount };
  }

  function correctAnswer() {
    let $result = document.getElementById('retryResult');
    if (!$result) {
      $result = document.getElementById('result');
    }
    $result.innerHTML +=
      '<p>🎉<strong>정답을 맞추셨습니다!</strong>🎉</p>' +
      '<p>게임을 새로 시작하시겠습니까? <button id="game-restart-button">게임 재시작</button></p>';
    return '🎉정답을 맞추셨습니다!🎉';
  }

  const play = function(computerInputNumbers, userInputNumbers) {
    console.log('computerInputNumbers', computerInputNumbers);
    let result = '';
    let { strikeCount, ballCount } = getStrikeBall({
      computerInputNumbers: String(computerInputNumbers).split(''),
      userInputNumbers: String(userInputNumbers).split(''),
    });
    console.log('strikeCount', strikeCount, 'ballCount', ballCount);
    if (strikeCount === 3) {
      result = correctAnswer();
      addResetButtonEvent();
    } else {
      result = printResult({ strikeCount, ballCount });
      const _$app = document.getElementById('app');
      let _$retryResult = document.getElementById('retryResult');
      _retryCount++;
      if (_$retryResult === null) {
        _$app.innerHTML += `<div id="retryResult"></div>`;
        _$retryResult = document.getElementById('retryResult');
        _$retryResult.innerHTML +=
          `<input type="text" id="user-input${_retryCount}" />` +
          `<button id="submit${_retryCount}">확인</button>` +
          '<h3>📄 결과</h3>' +
          `<div id="result${_retryCount === 0 ? '' : _retryCount}"></div>`;
      } else {
        _$retryResult.innerHTML +=
          `<input type="text" id="user-input${_retryCount}" />` +
          `<button id="submit${_retryCount}">확인</button>` +
          '<h3>📄 결과</h3>' +
          `<div id="result${_retryCount === 0 ? '' : _retryCount}"></div>`;
      }
    }
    addSubmitButtonEvent();
    return result;
  };
  
  /*
   ** Computer Input
   */

  function getRandomSingleDigit() {
    const min = 1;
    const max = 10;

    return Math.floor(Math.random() * (max - min)) + min;
  }

  function getComputerInputNumber() {
    let computerInput = new Set();

    while (computerInput.size != 3) {
      computerInput.add(getRandomSingleDigit());
    }
    return Number([...computerInput].join(''));
  }

  /*
   ** User Input
   */

  function checkValidInput(userInput) {
    const _userInput = userInput.split('').filter((x) => parseInt(x));
    if (userInput.length !== _userInput.length || _userInput.length !== 3) {
      return false;
    }
    return parseInt(userInput);
  }

  function getUserInputNumber(_retryCount) {
    return document.getElementById(
      `user-input${_retryCount === 0 ? '' : _retryCount}`,
    ).value;
  }

  /*
   ** Init
   */

  function init() {
    _computerInputNumber = getComputerInputNumber();
    // initialize submit input value
    document.getElementById('user-input').value = '';
    // remove submit EventListener
    for (let i = 1; i < _retryCount; i++) {
      let $submitButton = document.getElementById(
        `submit${_retryCount === 1 ? '' : _retryCount}`,
      );
      $submitButton.removeEventListener('click', () => clickResetButton());
    }
    // remove reset EventListener
    const _$resetButton = document.getElementById(`game-restart-button`);
    _$resetButton.removeEventListener('click', () => clickResetButton());
    _retryCount = 0;
    const _$retryResult = document.getElementById('retryResult');
    _$retryResult.remove();
  }

  /*
   ** Event Listener
   */

  function clickSubmitButton() {
    const _userInput = getUserInputNumber(_retryCount);
    console.log(_retryCount, _userInput);
    if (!checkValidInput(_userInput)) {
      alert('유효한 input을 입력해주세요.');
      return;
    }
    console.log(play(_computerInputNumber, _userInput));
  }

  function addSubmitButtonEvent() {
    const $submitButton = document.getElementById(
      `submit${_retryCount === 0 ? '' : _retryCount}`,
    );
    $submitButton.addEventListener('click', () => clickSubmitButton());
  }

  function clickResetButton() {
    init();
    addSubmitButtonEvent();
  }

  function addResetButtonEvent() {
    const _$resetButton = document.getElementById(`game-restart-button`);
    _$resetButton.addEventListener('click', () => clickResetButton());
  }
}

new BaseballGame();
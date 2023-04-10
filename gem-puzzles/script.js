const App = () => {
  const state = {
    finalArray: [],
    randomArray: [],
    size: 4,
    time: 0,
    steps: 0,
    timerId: 0,
    timeValue: document.querySelector(".time__value"),
  };

  const createFinalArray = () => {
    for (let i = 0; i < state.size ** 2 - 1; i++) {
      state.finalArray.push(i + 1);
    }
    state.finalArray.push(0);
  };

  const createRandomArray = () => {
    state.randomArray = [];
    for (let i = 0; i < state.size ** 2 - 1; i++) {
      state.randomArray.push(i + 1);
    }
    state.randomArray.push(0);
    state.randomArray = state.randomArray.sort(function () {
      return Math.random() - 0.5;
    });
    checkArray();
  };

  const checkArray = () => {
    const length = state.randomArray.length;
    let sum = 0;
    for (let i = 0; i < length; i++) {
      for (let j = i + 1; j <= length; j++) {
        if (state.randomArray[i] > state.randomArray[j]) {
          sum += 1;
        }
      }
    }
    sum += Math.trunc(state.randomArray.indexOf(0) / state.size) + 1;
    if (sum % 2 === 1) createRandomArray();
  };

  const createElement = (typeElem, className, parent, text) => {
    const elem = document.createElement(typeElem);
    elem.className = className;
    if (text) elem.innerHTML = text;
    parent.appendChild(elem);
    return elem;
  };

  const loadPage = () => {
    const wrapper = createElement("div", "wrapper", document.body);

    const buttons__wrapper = createElement("div", "buttons__wrapper", wrapper);
    start = createElement(
      "button",
      "buttons buttons__start",
      buttons__wrapper,
      "New game"
    );
    save = createElement(
      "button",
      "buttons buttons__save",
      buttons__wrapper,
      "Save game"
    );
    load = createElement(
      "button",
      "buttons buttons__load",
      buttons__wrapper,
      "Load game"
    );
    results = createElement(
      "button",
      "buttons buttons__results",
      buttons__wrapper,
      "Best score"
    );

    const counters = createElement("div", "counters", wrapper);
    const step = createElement("div", "counters__item step", counters);
    stepsDescription = createElement(
      "div",
      "step__description",
      step,
      "Total steps: "
    );
    stepsValue = createElement("div", "step__value", step, "0");
    const time = createElement("div", "counters__item time", counters);
    timeDescription = createElement(
      "div",
      "time__description",
      time,
      "Total time: "
    );
    timeValue = createElement("div", "time__value", time, "00 : 00");

    field = createElement("div", "game__field", wrapper);
    resultWrapper = createElement("div", "result__wrapper", wrapper);

    const footerWrapper = createElement("div", "footer__wrapper", wrapper);
    start = createElement(
      "button",
      "buttons buttons__finish",
      footerWrapper,
      "Finish game"
    );

    const fieldSize = createElement("div", "size", footerWrapper);

    const select = document.createElement("select");
    select.className = "size__select";
    select.id = "size__select";
    fieldSize.appendChild(select);
    for (let i = 3; i < 9; i += 1) {
      let option = document.createElement("option");
      option.id = `size__select_${i}`;
      option.innerHTML = `${i}x${i}`;
      select.appendChild(option);
    }
    select.options[1].selected = true;
    select.addEventListener("change", changeSize);
  };

  const loadResultDiv = (arrayResult) => {
    stopTimer();
    const gameField = document.querySelector(".game__field");

    const buttonDiv = createElement(
      "div",
      "result__close-button",
      resultWrapper
    );
    resultWrapper.style.top = gameField.offsetTop + "px";
    resultWrapper.style.position = "absolute";
    const button = createElement("button", "buttons__close", buttonDiv);

    button.addEventListener("click", deleteResultDiv);

    const img = createElement("img", "close__img", button);
    img.src = "./img/cross.png";
    createElement(
      "div",
      "result__title",
      resultWrapper,
      "best results in the number of steps"
    );
    const resultDescription = createElement(
      "div",
      "result__description description",
      resultWrapper
    );
    let pElem = createElement("p", "description__title", resultDescription);
    span = createElement("span", "description__span", pElem, "size");
    span = createElement("span", "description__span", pElem, "time");
    span = createElement("span", "description__span", pElem, "total steps");

    let j = 1;
    for (let i = 0; i < arrayResult.length; i += 3) {
      pElem = createElement("p", "description__p", resultDescription);
      span = createElement("span", "description__span", pElem, j);
      span = createElement("span", "description__span", pElem, arrayResult[i]);
      span = createElement(
        "span",
        "description__span",
        pElem,
        arrayResult[i + 1]
      );
      span = createElement(
        "span",
        "description__span",
        pElem,
        arrayResult[i + 2]
      );
      j++;
    }
  };

  const loadField = () => {
    const gameField = document.querySelector(".game__field");
    gameField.classList.toggle("disabled", false);

    const buttonsFinish = document.querySelector(".buttons__finish");
    buttonsFinish.classList.toggle("disabled", false);

    for (let i = 0; i < state.randomArray.length; i++) {
      let elemNumber =
        state.randomArray[i] === 0
          ? state.randomArray.length - 1
          : state.randomArray[i] - 1;
      let elem = document.getElementsByClassName("game__item")[elemNumber];
      if (elem) elem.style.order = i;
    }

    document.querySelectorAll(".game__item").forEach((item) => {
      item.addEventListener("click", moveItem);
    });
  };

  const correctField = () => {
    for (let i = 0; i < state.finalArray.length; i++) {
      const text = state.finalArray[i] === 0 ? "" : state.finalArray[i];
      const className =
        state.finalArray[i] === 0
          ? `game__item game__item_${state.size} zero dropzone`
          : `game__item game__item_${state.size} draggable`;
      const parrentDiv = createElement("div", className, field, `${text}`);
      parrentDiv.id = state.finalArray[i];

      if (state.finalArray[i] !== 0) {
        parrentDiv.draggable = true;
      }
    }
  };

  const deleteField = () => {
    document.querySelectorAll(".game__item").forEach((item) => {
      item.removeEventListener("click", moveItem);
    });

    field.innerHTML = "";
  };

  const startTimer = () => {
    state.timerId = setInterval(() => {
      state.time += 1;
      timeValue.innerHTML = getTime();
    }, 1000);
  };

  const stopTimer = () => {
    clearTimeout(state.timerId);
  };

  const getTime = () => {
    const time = state.time;
    let min = Math.floor(time / 60);
    min = min < 10 ? `0${min}` : min;
    let sec = Math.floor(time % 60);
    sec = sec < 10 ? `0${sec}` : sec;
    return `${min} : ${sec}`;
  };

  const clearTimer = () => {
    clearTimeout(state.timerId);
    state.time = 0;
    timeValue.innerHTML = "00 : 00";
  };

  const checkFinish = () => {
    for (let i = 0; i < state.randomArray.length; i += 1) {
      if (state.randomArray[i] !== state.finalArray[i]) return false;
    }
    return true;
  };

  const finishGame = () => {
    stopTimer();
    saveResult();
    let gameField = document.querySelector(".game__field");
    gameField.classList.add("disabled");
    let snd = new Audio("music/win.mp3");
    snd.play();
    snd.currentTime = 0;
    console.log(state.time);
    setTimeout(() => {
      alert(
        `Ура! Вы решили головоломку за ${state.time} секунд и ${state.steps} ходов!`
      );
    }, 400);
  };

  const moveItem = (e) => {
    const element = e.path[0];
    let zeroPos = state.randomArray.indexOf(0);
    let curPos = state.randomArray.indexOf(Number(element.id));
    let diffPos = Math.abs(zeroPos - curPos);

    if ((zeroPos + 1) % state.size === 0 && Math.abs(zeroPos - curPos) === 1) {
      diffPos = zeroPos - curPos;
    } else if (zeroPos % state.size === 0 && Math.abs(zeroPos - curPos) === 1) {
      diffPos = curPos - zeroPos;
    }
    let diffPos2 = zeroPos - curPos;
    let translate;
    if (diffPos2 === -1) {
      translate = "translateX(-101%)";
    } else if (diffPos2 === 1) {
      translate = "translateX(101%)";
    } else if (diffPos2 % state.size === 0 && diffPos2 < 0) {
      translate = "translateY(-101%)";
    } else if (diffPos2 % state.size === 0 && diffPos2 > 0) {
      translate = "translateY(101%)";
    }

    if (diffPos === state.size || diffPos === 1) {
      let snd = new Audio("music/sounds_move.mp3");
      snd.play();
      snd.currentTime = 0;

      element.classList.add("transition");
      element.style.transform = translate;
      setTimeout(() => {
        element.classList.toggle("transition");
        element.style.transform = "none";
        element.style.order = zeroPos;
        document.querySelectorAll(".zero")[0].style.order = curPos;
      }, 350);

      state.randomArray[zeroPos] = Number(element.id);
      state.randomArray[curPos] = 0;
      if (state.steps === 0) {
        startTimer();
      }

      state.steps += 1;
      document.querySelectorAll(".step__value")[0].innerHTML = state.steps;

      if (checkFinish()) {
        finishGame();
      }
    }
  };

  const changeSize = () => {
    let selection = document.getElementById("size__select");
    let selectedOption = selection.options[selection.selectedIndex];

    state.size = Number(selectedOption.id.slice(-1));
    startGame();
  };

  const startGame = () => {
    let gameField = document.querySelector(".game__field");
    gameField.classList.toggle("disabled", true);

    state.finalArray = [];
    state.randomArray = [];
    state.steps = 0;
    clearTimer();
    document.querySelectorAll(".step__value")[0].innerHTML = state.steps;

    createFinalArray();
    createRandomArray();
    deleteField();
    correctField();
    loadField();
  };

  const saveGame = () => {
    localStorage.setItem("arrRand", state.randomArray);
    localStorage.setItem("size", state.size);
    localStorage.setItem("time", state.time);
    localStorage.setItem("step", state.steps);
  };

  const loadGame = () => {
    stopTimer();
    let arrRand = localStorage.getItem("arrRand");
    state.randomArray = arrRand.split(",").map((string) => parseFloat(string));
    state.size = Number(localStorage.getItem("size"));
    state.time = Number(localStorage.getItem("time"));
    state.steps = Number(localStorage.getItem("step"));

    state.finalArray = [];
    createFinalArray();
    deleteField();
    correctField();
    loadField();

    document.querySelectorAll(".size__select")[0][
      state.size - 3
    ].selected = true;
    document.querySelectorAll(".step__value")[0].innerHTML = state.steps;
    timeValue.innerHTML = getTime();
    if (state.steps !== 0) startTimer();
  };

  const blockFinish = (item, snd) => {
    item.classList.toggle("transition");
    item.style.transform = "none";
    snd.play();
    snd.currentTime = 0;
  };

  const timer = (ms) => {
    return new Promise((res) => setTimeout(res, ms));
  };

  const finishGameBtn = async () => {
    const buttons = document.querySelectorAll(".buttons");
    buttons.forEach((e) => e.classList.toggle("disabled", true));
    stopTimer();
    const gameItem = document.querySelectorAll(".game__item");
    let zeroPos = state.randomArray.indexOf(0);
    let maxNumb = state.size ** 2 - 1;
    let snd = new Audio("music/sounds_move.mp3");
    for (let i = 0; i < maxNumb; i++) {
      if (state.randomArray[i] !== i + 1) {
        let numPos = Number(gameItem[i].style.order);
        if (state.randomArray[i] === 0) {
          let topZero = Math.trunc(zeroPos / state.size),
            topCur = Math.trunc(numPos / state.size),
            leftZero = zeroPos % state.size,
            leftCur = numPos % state.size;
          gameItem[i].classList.add("transition");
          gameItem[i].style.transform = `translateY(${
            (topCur - topZero) * -102
          }%) translateX(${(leftCur - leftZero) * -102}%)`;
          await timer(500);

          state.randomArray[numPos] = 0;
          state.randomArray[i] = i + 1;
          gameItem[i].style.order = i;
          gameItem[maxNumb].style.order = numPos;
          zeroPos = numPos;

          blockFinish(gameItem[i], snd);
        } else {
          //переносим текущую фишку на пустое место
          let curNum = state.randomArray[i];
          let topZero = Math.trunc(zeroPos / state.size),
            topCur = Math.trunc(i / state.size),
            leftZero = zeroPos % state.size,
            leftCur = i % state.size;
          gameItem[curNum - 1].classList.add("transition");
          gameItem[curNum - 1].style.transform = `translateY(${
            (topCur - topZero) * -102
          }%) translateX(${(leftCur - leftZero) * -102}%)`;
          await timer(500);

          state.randomArray[zeroPos] = state.randomArray[i];
          state.randomArray[i] = 0;
          gameItem[curNum - 1].style.order = zeroPos;
          gameItem[maxNumb].style.order = i;
          zeroPos = i;

          gameItem[curNum - 1].classList.toggle("transition");
          gameItem[curNum - 1].style.transform = "none";
          snd.play();
          snd.currentTime = 0;

          //переносим нужную фишку
          topZero = Math.trunc(zeroPos / state.size);
          topCur = Math.trunc(numPos / state.size);
          leftZero = zeroPos % state.size;
          leftCur = numPos % state.size;
          gameItem[i].classList.add("transition");
          gameItem[i].style.transform = `translateY(${
            (topCur - topZero) * -102
          }%) translateX(${(leftCur - leftZero) * -102}%)`;
          await timer(500);

          state.randomArray[numPos] = 0;
          state.randomArray[i] = i + 1;
          gameItem[i].style.order = i;
          gameItem[maxNumb].style.order = numPos;
          zeroPos = numPos;

          blockFinish(gameItem[i], snd);
        }
      }
    }
    let gameField = document.querySelector(".game__field");
    gameField.classList.add("disabled");
    snd = new Audio("music/win.mp3");
    snd.play();
    snd.currentTime = 0;
    buttons.forEach((e) => e.classList.toggle("disabled", false));
    document
      .querySelector(".buttons__finish")
      .classList.toggle("disabled", true);
  };

  loadPage();
  startGame();

  document
    .querySelector(".buttons__start")
    .addEventListener("click", startGame);
  document.querySelector(".buttons__save").addEventListener("click", saveGame);
  document.querySelector(".buttons__load").addEventListener("click", loadGame);
  document
    .querySelector(".buttons__finish")
    .addEventListener("click", finishGameBtn);

  const buttonsResult = document.querySelector(".buttons__results");

  let dragged;

  /* events fired on the draggable target */
  document.addEventListener("drag", function (event) {}, false);

  document.addEventListener(
    "dragstart",
    function (event) {
      // store a ref. on the dragged elem
      dragged = event.target;
      // make it half transparent
      event.target.style.opacity = 0.5;
    },
    false
  );

  document.addEventListener(
    "dragend",
    function (event) {
      // reset the transparency
      event.target.style.opacity = "";
    },
    false
  );

  /* events fired on the drop targets */
  document.addEventListener(
    "dragover",
    function (event) {
      // prevent default to allow drop
      event.preventDefault();
    },
    false
  );

  document.addEventListener(
    "dragenter",
    function (event) {
      // highlight potential drop target when the draggable element enters it
      if (event.target.className.includes("dropzone")) {
        event.target.style.background = "OliveDrab";
      }
    },
    false
  );

  document.addEventListener(
    "dragleave",
    function (event) {
      // reset background of potential drop target when the draggable element leaves it
      if (event.target.className.includes("dropzone")) {
        event.target.style.background = "";
      }
    },
    false
  );

  document.addEventListener(
    "drop",
    function (event) {
      // prevent default action (open as link for some elements)
      event.preventDefault();
      // move dragged elem to the selected drop target
      let zeroPos = state.randomArray.indexOf(0);
      let curPos = state.randomArray.indexOf(Number(dragged.id));
      let diffPos = Math.abs(zeroPos - curPos);
      if (
        (zeroPos + 1) % state.size === 0 &&
        Math.abs(zeroPos - curPos) === 1
      ) {
        diffPos = zeroPos - curPos;
      } else if (
        zeroPos % state.size === 0 &&
        Math.abs(zeroPos - curPos) === 1
      ) {
        diffPos = curPos - zeroPos;
      }

      if (diffPos === state.size || diffPos === 1) {
        if (event.target.className.includes("dropzone")) {
          let tmp = event.target.style.order;
          event.target.style.order = dragged.style.order;
          dragged.style.order = tmp;
          event.target.style.background = "";

          let snd = new Audio("music/sounds_move.mp3");
          snd.play();
          snd.currentTime = 0;

          if (state.steps === 0) {
            startTimer();
          }
          state.steps += 1;
          document.querySelectorAll(".step__value")[0].innerHTML = state.steps;

          state.randomArray[tmp] = Number(dragged.id);
          state.randomArray[event.target.style.order] = 0;

          //check finish
          if (checkFinish()) {
            finishGame();
          }
        }
      } else {
        event.target.style.background = "";
      }
    },
    false
  );

  //best result
  const saveResult = () => {
    let strResult = localStorage.getItem("arrResult");
    let arrayResult;
    if (strResult === null) {
      arrayResult = [];
    } else {
      arrayResult = strResult.length === 0 ? [] : strResult.split(",");
    }
    let rec = false;

    for (let i = 2; i < arrayResult.length; i += 3) {
      if (Number(arrayResult[i]) >= state.steps) {
        arrayResult.splice(
          i - 2,
          0,
          `${state.size}x${state.size}`,
          getTime(),
          state.steps
        );
        rec = true;
        break;
      }
    }
    if (!rec) {
      arrayResult.push(`${state.size}x${state.size}`);
      arrayResult.push(getTime());
      arrayResult.push(state.steps);
    }

    if (arrayResult.length < 30) {
      localStorage.setItem("arrResult", arrayResult);
    } else {
      localStorage.setItem("arrResult", arrayResult.slice(0, 30));
    }
  };

  const loadResult = () => {
    let strResult = localStorage.getItem("arrResult");
    let arrayResult =
      strResult === "" || strResult === null ? [] : strResult.split(",");
    let gameField = document.querySelector(".game__field");
    gameField.classList.add("invisible");
    loadResultDiv(arrayResult);
  };

  const deleteResultDiv = (e) => {
    const btnCls = document.querySelector(".buttons__close");
    let gameField = document.querySelector(".game__field");
    document.querySelector(".buttons__results").classList.toggle("disabled");
    if (!gameField.className.includes("disabled") && state.steps !== 0) {
      startTimer();
    }
    btnCls.removeEventListener("click", deleteResultDiv);
    btnCls.parentNode.parentNode.innerHTML = "";
    gameField.classList.toggle("invisible");
  };

  buttonsResult.addEventListener("click", loadResult);
};

document.addEventListener("DOMContentLoaded", App);

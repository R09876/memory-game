const choiceImg = document.querySelector('#img-choice');
const choiceSize = document.querySelector('#size-choice');
const board = document.querySelector('#board');
const timer = document.querySelector('#timer');
const attempt = document.querySelector('#attempt');
const tmp = document.querySelector('#tmp');
const btnsUp = document.querySelectorAll('[data-up]');
const restart = document.querySelector('#restart');
const restartBtn = document.querySelector('[btn-restart]');
const sections = document.querySelectorAll('section');
let SQUARE_COUNT;
let img;
let copyImg;
let interval;
let match = [];
let sec = 0;
let min = 0;
let step = 0; //попытки
let cardOne;
let cardTwo;
let deskEnable = true;

//Добавляет на кнопки событие смены экранов

const addSectionMove = () => {
  btnsUp.forEach(item => {
    item.addEventListener('click',() => {
      const parent = item.closest('section')
      if((!parent.classList.contains('up'))) {
        parent.classList.add('up');
      }
    });
  })
}

//Перемешивает массив

const mix = (arr) => {
  for (let i = arr.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

//Формирует массив картинок

const getArray = () => {
  copyImg = img.slice(0, (SQUARE_COUNT/2)); //обрезает массив под нужный размер поля
  copyImg.push(...copyImg); // дублирует картинки
  mix(copyImg);
}

//Добавляет на страницу карточки с картинками

const setImges = () => {
  for(let i=0; i < SQUARE_COUNT; i++) {
    const square = tmp.content.cloneNode(true);
    const img = square.querySelector('img');
    img.src=`img/${copyImg[i]}.jpg`

    board.append(square);
  }
}


//добавляет выбор массива картинок

const chooseImages = () => {
  choiceImg.addEventListener('click',(evt) => {
    const target = evt.target;

    if(target.closest('.tw')) {
      img = ['w', 'sss', 'sum', 'rm', 'vv','v', 'ar', 'es', 'ren', 'em','ch', 'k', 'j','el', 'be', 'e', 'su', 'ec'];
    } else {
      img = ['b', 'n', 'rh', 'rr', 's','dr', 'tr', 'jr', 'sp', 'rx','bg', 'c', 'rn','r', 'kf', 'f', 'i', 'sb']
    }
  });
}

//выводит время на страницу

const setTime = () => {
  sec++

  if(sec < 10) {
    timer.innerHTML = `00:0${sec}`
  }

  if(sec== 60) {
    min++
    sec = 0;
  }

  if(sec < 10 && min < 10) {
    timer.innerHTML = `0${min}:0${sec}`
  }

  if(sec >= 10 && min < 10) {
    timer.innerHTML = `0${min}:${sec}`
  }

  if(sec < 10 && min >= 10) {
    timer.innerHTML = `${min}:0${sec}`
  }

  if(sec >= 10 && min >= 10) {
    timer.innerHTML = `${min}:${sec}`
  }
}

//выводит количество попыток на страницу

const addAttempt = () => {
  step++

  attempt.innerHTML = `${step}`
}

//таймер

const initTimer = () => {
  interval = setInterval(() => {
    setTime();
  }, 1000);
}

//добавляет выбор размера поля

const chooseSize = () => {
  choiceSize.addEventListener('click',(evt) => {
    const target = evt.target;

    if(target.closest('.big')) {
      SQUARE_COUNT = 36;
      if(!board.classList.contains('big')) {
        board.classList.add('big');
      }
    } else {
      SQUARE_COUNT = 16;
      if(board.classList.contains('big')) {
        board.classList.remove('big');
      }
    }

    getArray();
    setImges();
    initTimer();
  });
}

//сбрасывает все значения до первоначальных

const setInitialValues = () => {
  board.innerHTML = '';

  sec = 0;
  min = 0;
  step = 0;
  restart.style="";
  timer.innerHTML = '00:00'
  attempt.innerHTML = '0'
  deskEnable = true;
  match = [];
}

//добавляет событие очистки на кнопку рестарта

const addEventOnRestartBtn = () => {
  restartBtn.addEventListener('click',() => {
    sections.forEach(item => {
      if((item.classList.contains('up'))) {
        item.classList.remove('up');
      }
    });
    setInitialValues();
  });
}

//добавляет событие на доску

const boardEvent = () => {
  board.addEventListener('click',(evt) => {
    const target = evt.target.parentNode;

    if (target.classList.contains('matched') || target.classList.contains('is-active')) {
      return;
    }

    if(deskEnable) {
      if(target.closest('.cell')) {
        target.classList.add('is-active');
      }

      if(!cardOne) {
        cardOne = target;
      } else  {
        deskEnable = false;
        cardTwo = target;
        addAttempt();
        if(cardOne.children[1].src !== cardTwo.children[1].src) {
          setTimeout(() => {
            target.classList.remove('is-active');
            cardOne.classList.remove('is-active');
          }, 500);
        } else {
          target.classList.add('matched');
          cardOne.classList.add('matched');
          match.push(target);
          match.push(cardOne);
        }

        setTimeout(() => {
          cardOne = null;
          cardTwo = null;
          deskEnable = true;
        }, 500);
      }
    }

    //победа

    if(match.length === SQUARE_COUNT && match.length != 0) {
      clearInterval(interval);
      setTimeout(() => {
        restart.style="opacity: 1; z-index: 10"
      }, 500);
      addEventOnRestartBtn();
    }
  });
}

const startGame = () => {
  chooseImages();
  chooseSize();
  addSectionMove();
  boardEvent();
}

startGame();

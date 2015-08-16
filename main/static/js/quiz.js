function range(start,end) {
  if (end === undefined) { end = start; start = 0; }
  return Array.apply(null, Array(end)).map(function (_, i) {return i+start;});
}
function shuffle(array) {
  var counter = array.length,index, temp;
  while (counter > 0) {
    // Pick a random index
    index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }
  return array;
}

class Quiz {
  constructor(options) {
    this.letters = "abcdefghijklmnopqrstuvwxyz";
    window.QUIZ.current = this;
  }
  next(options) {
    this.input = '';
    this.currentIndex += 1;
    if (this.currentIndex == this.questions.length) {
      this.gameOver();
    }
    this.question = this.questions[this.currentIndex];
    this.key = this.question;
    this.getVerbose();
    this.getAnswer();
  }
  gameOver() {
    document.getElementById('content').innerHTML = "<game-over></game-over>";
    riot.mount('game-over');
    this.scores.push({
      fails: this.fails,
      ms: new Date().valueOf() - this.start,
      count: this.questions.length,
      date: new Date().valueOf()
    });
    localStorage.setItem('scores',JSON.stringify(QUIZ.scores));
  }
  keyPress(e) {
    if (47 < event.which && event.which < 58) {
      this.pressNumber(event.which-48);
      return false;
    }
    return true;
  }
  pressNumber(number) {
    this.input += number;
    if (this.input.indexOf(this.answer) != -1) { // correct!
      this.last_question = [this.verbose,'=',this.answer].join(' ');
      if (this.input.indexOf(this.answer) != 0) { this.fail += 1; }
      this.next();
    }
    riot.update();
  }  
  getGames() {
    
  }
  startGame(game) {
    this.game = game;
    this.fails = 0;
    this.start = new Date().valueOf();
    $("#content").html("<question>");
    riot.mount("question,numpad");
    QUIZ.scores[this.name] = QUIZ.scores[this.name] || {};
    this.scores = QUIZ.scores[this.name][game] = QUIZ.scores[this.name][game] || [];
  }
}

class LettersQuiz extends Quiz {
  constructor(options) {
    super(options);
    this.name = "Letters";
    this.icon = 'letters-quiz';
    this.icon_text = "d>#";
  }
  makeQuestions() {
    this.questions = shuffle(range(0,26));
  }
  getVerbose() {
    this.verbose = this.letters[this.question] + ">#";
    this.keys = [this.letters[this.question]];
  }
  getAnswer() {
    this.answer = this.question + 1;
  }
}
  
class MathQuiz extends Quiz {
  constructor(operator,options) {
    super(options);
    this.operator = operator;
  }
  startGame(game) {
    super.startGame(game);
    console.log(game);
    this.operand = game;
    this.max_question = this.max_question || Math.max(this.operand+3,10);
    this.makeQuestions();
    this.currentIndex = -1;
    this.next();
    riot.update();
  }
  getGames() {
    super.getGames()
    var games = range(2,25);
    var out = [];
    for (var i=0;i<games.length; i++) {
      out.push({verbose:games[i]});
    }
    return out;
  }
  makeQuestions() {
    this.max_question = 4;
    this.questions = shuffle(range(2,this.max_question+1));
  }
  getAnswer() {
    this.answer = Math.floor(eval(this.verbose));
  }
  getVerbose() {
    this.verbose = [this.question,this.operator,this.operand].join(' ')
    this.keys = [this.question,this.operand];
  }
}

class AdditionQuiz extends MathQuiz {
  constructor(options) {
    super("+",options)
    this.icon = "plus"
    this.name = "Addition"
  }
}

class SubtractionQuiz extends MathQuiz {
  constructor(options) {
    super("-",options)
    this.icon = "minus"
    this.name = "Subtraction"
  }
}

class MultiplyQuiz extends MathQuiz {
  constructor(options) {
    super("*",options)
    this.icon = "times"
    this.name = "Multiplication"
  }
}

class DivisionQuiz extends MathQuiz {
  constructor(options) {
    super("/",options)
    this.name = "Division"
    this.icon = 'divide'
  }
}
    
class ModuloQuiz extends MathQuiz {
  constructor(options) {
    super("%",options)
    this.name = "Modulo"
    this.icon = 'modulo'
  }
}

window.QUIZ = {
  AdditionQuiz: AdditionQuiz,
  SubtractionQuiz: SubtractionQuiz,
  MultiplyQuiz: MultiplyQuiz,
  DivisionQuiz: DivisionQuiz,
  ModuloQuiz: ModuloQuiz,
  LettersQuiz: LettersQuiz
}

QUIZ.scores = JSON.parse(localStorage.getItem('scores') || "{}");
QUIZ.resetScores = function() { localStorage.removeItem('scores'); }
QUIZ.resetAll = function() { 
  document.getElementById("content").innerHTML = "<quizlist></quizlist>";
  riot.mount("quizlist");
}

window.QUIZ.list = [
  new AdditionQuiz({}),
  new SubtractionQuiz({}),
  new MultiplyQuiz({}),
  new DivisionQuiz({}),
  new ModuloQuiz({}),
  new LettersQuiz({})
]

document.addEventListener("keypress",function(event) {
  if (47 < event.which && event.which < 58) { QUIZ.current.pressNumber(event.which-48); return false; }
  return true;
});

QUIZ.resetAll();

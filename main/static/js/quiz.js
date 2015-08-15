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
    window.quiz.current = this;
  }
  next(options) {
    this.input = '';
    this.start = new Date().valueOf();
    this.currentIndex += 1;
    if (this.currentIndex == this.questions.length) {
      if (!this.fails) { this.gameOver(); }
    }
    this.question = this.questions[this.currentIndex];
    this.key = this.question;
    this.getVerbose();
    this.getAnswer();
  }
  gameOver() {
    document.getElementById('content').innerHTML = "<scorelist></scorelist>";
    riot.mount('scorelist');
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
      this.setScore();
      this.next();
    }
    riot.update();
  }
  setScore() {
    var value = {
      fail: this.input.indexOf(this.answer) != 0,
      ms: new Date().valueOf() - this.start,
    };
    for (var i=0;i<this.keys.length;i++) {
      var key = this.keys[i];
      quiz.scores[this.name] = quiz.scores[this.name] || {};
      quiz.scores[this.name][key] = quiz.scores[this.name][key] || [];
      quiz.scores[this.name][key].push(value);
    }
    // remove all but 5 most recent values
    quiz.scores[this.name][key].splice(0,quiz.scores[this.name][key].length-5);
    this.save();
  }  
  save() {
    localStorage.setItem('scores',JSON.stringify(quiz.scores));
  }
  getScores() {
    var scores = quiz.scores[this.name];
    var out = [];
    for (var key in scores) {
      var list = scores[key];
      var score = { fail:0, ms:0, key: key, count: list.length };
      for (var i=0;i<list.length;i++) {
        score.fail += list[i].fail;
        score.ms += list[i].ms;
      }
      score.ms = Math.round(score.ms/list.length);
      out.push(score);
    }
    out.sort(function(a,b) {
      if (a.key == b.key) { return 0; }
      return (a.key<b.key)?-1:1
    });
    return out;
  }
  getGames() {
    
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
  selectGame(operand) {
    this.operand = operand;
    this.max_question = this.max_question || Math.max(this.operand+3,10);
    this.makeQuestions();
    this.currentIndex = -1;
    this.next();
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
    this.questions = range(2,this.max_question+1)
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

window.quiz = {
  AdditionQuiz: AdditionQuiz,
  SubtractionQuiz: SubtractionQuiz,
  MultiplyQuiz: MultiplyQuiz,
  DivisionQuiz: DivisionQuiz,
  ModuloQuiz: ModuloQuiz,
  LettersQuiz: LettersQuiz
}

quiz.scores = JSON.parse(localStorage.getItem('scores') || "{}");

window.quizes = [
  new AdditionQuiz({}),
  new SubtractionQuiz({}),
  new MultiplyQuiz({}),
  new DivisionQuiz({}),
  new ModuloQuiz({}),
  new LettersQuiz({})
]

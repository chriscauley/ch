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
    this.makeQuestions();
    this.currentIndex = -1;
    this.next();
    window.quiz.current = this;
  }
  next(options) {
    this.input = '';
    this.start = new Date().valueOf();
    this.currentIndex += 1;
    if (this.currentIndex == this.questions.length) { this.gameOver(); }
    this.question = this.questions[this.currentIndex];
    this.getVerbose();
    this.getAnswer();
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
      console.log({
        fail: this.input.indexOf(this.answer) != 0,
        ms: new Date().valueOf() - this.start,
      });
      this.last_question = [this.verbose,'=',this.answer].join(' ');
      this.next();
    }
    riot.update();
  }
  getIcon() {
    return "<i class='fa fa-#{ this.icon }'></i>";
  }
}

class LettersQuiz extends Quiz {
  constructor(options) {
    super(options);
    this.name = "Letters";
    this.scoreKeys = ['letters'];
  }
  makeQuestions() {
    this.questions = shuffle(range(0,25));
  }
  getVerbose() {
    this.verbose = this.letters[this.question] + ">#";
  }
  getAnswer() {
    this.answer = this.question + 1;
  }
  getIcon() {
    return "<i class='fa'>d&gt;#</i>"
  }
}
  
class MathQuiz extends Quiz {
  constructor(operator,options) {
    super(options);
    this.operand = options.operand || Math.floor(Math.random()*(10-2)+2);
    var max_question = options.max_question || Math.pow(this.operand,3);
    this.question = Math.floor(Math.random()*(max_question-this.operand+1)+this.operand+1);
  }
  makeQuestions() {
    this.questions = shuffle(range(2,20));
  }
  getAnswer() {
    this.answer = eval(this.verbose)
  }
  getVerbose() {
    this.verbose = [this.question,this.operator,this.operand].join(' ')
  }
}

class AdditionQuiz extends MathQuiz {
  constructor(options) {
    super("+",options)
    this.icon = "plus"
    this.name = "Addition"
    this.scoreKeys = ['addition','add'+this.operand]
  }
}

class SubtractionQuiz extends MathQuiz {
  constructor(options) {
    super("-",options)
    this.icon = "minus"
    this.name = "Subtraction"
    this.scoreKeys = ['subtration','sub'+this.operand]
  }
}

class MultiplyQuiz extends MathQuiz {
  constructor(options) {
    super("*",options)
    this.icon = "times"
    this.name = "Multiplication"
    this.scoreKeys = ['multiplication','mul'+this.operand]
  }
}

class DivisionQuiz extends MathQuiz {
  constructor(options) {
    super("/",options)
    this.name = "Division"
    this.scoreKeys = ['division','div'+this.operand]
  }
  getIcon() {
    return "<i class='fa'>&divide;</i>"
  }
}
    
class ModuloQuiz extends MathQuiz {
  constructor(options) {
    super("%",options)
    this.name = "Modulo"
    this.scoreKeys = ['modulo','mod'+this.operand]
  }
  getIcon() {
    return "<i class='fa'>%</i>"
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

window.quizes = [
  new AdditionQuiz({}),
  new SubtractionQuiz({}),
  new MultiplyQuiz({}),
  new DivisionQuiz({}),
  new ModuloQuiz({}),
  new LettersQuiz({})
]

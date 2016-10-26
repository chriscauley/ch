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
  getSlug() {
    return this.name.toLowerCase();
  }
  next(options) {
    $(".bot-note").hide();
    this.input = '';
    this.currentIndex += 1;
    if (this.currentIndex == this.questions.length) {
      return this.gameOver();
    }
    this.question = this.questions[this.currentIndex];
    this.key = this.question;
    this.getVerbose();
    this.getAnswer();
  }
  gameOver() {
    this.scores.push({
      fails: this.fails,
      ms: new Date().valueOf() - this.start,
      count: this.questions.length,
      date: new Date().valueOf()
    });
    document.getElementById('content').innerHTML = "<game-over></game-over>";
    riot.mount('game-over');
    localStorage.setItem('scores',JSON.stringify(QUIZ.scores));
  }
  pressNumber(number) {
    this.input += number;
    if (this.input.indexOf(this.answer) != -1) { // correct!
      this.last_question = [this.verbose,'=',this.answer].join(' ');
      if (this.input.indexOf(this.answer) != 0) { this.fails += 1; }
      this.next();
    }
    riot.update();
  }
  clearInput() {
    this.input = this.input.slice(0,this.input.length-1);
    this.deleted += 1;
    var notes = [
      "Pressing delete does nothing.",
      "When you make a mistake, just type the right answer.",
      "Seirously don't press backspace.",
      "It just makes you feel better.",
      "If you type 10 + 3 = 1413 is counts as a right answer because it ends in 13.",
      "Don't you get it yet?",
      "Write 'backspace' on a piece of paper. Push that instead.",
      "Stop pressing backspace, just type the right answer when you mess up",
      "Are you trolling me or something?",
      "Looking for a hidden easter egg or something?",
      "Think I'm going to sing a song or show some crazy gif?",
      "...",
      "... ...",
      "... ... ...",
      "&#9834;This was a triumph!&#9835;",
      "&#9834;I'm making a note here:\nHuge success!&#9835;",
      "&#9834;It's hard to overstate\nmy satisfaction.&#9835;",
      "&#9834;Aperture Science&#9835;",
      "&#9834;We do what we must\nbecause we can&#9835;",
      "&#9834;For the good of all of us.&#9835;",
      "&#9834;Except the ones who are dead.&#9835;",
      "&#9834;But there's no sense crying\nover every mistake.&#9835;",
      "&#9834;You just keep on trying\ntil you run out of cake.&#9835;",
      "&#9834;And the science gets done.&#9835;",
      "&#9834;And you make a neat gun&#9835;",
      "&#9834;for the people who are still alive.&#9835;",
      "&#9834;I'm not even angry...&#9835;",
      "&#9834;I'm being so sincere right now.&#9835;",
      "&#9834;Even though you broke my heart\nand killed me.&#9835;",
      "&#9834;And tore me to pieces.&#9835;",
      "&#9834;And threw every piece into a fire.&#9835;",
      "&#9834;As they burned it hurt because&#9835;",
      "&#9834;I was so happy for you!&#9835;",
      "&#9834;Now, these points of data\nmake a beautiful line.&#9835;",
      "&#9834;And we're out of beta.\nWe're releasing on time!&#9835;",
      "&#9834;So I'm GLaD I got burned!&#9835;",
      "&#9834;Think of all the things we learned!&#9835;",
      "&#9834;for the people who are\nstill alive.&#9835;",
      "&#9834;Go ahead and leave me...&#9835;",
      "&#9834;I think I'd prefer to stay inside...&#9835;",
      "&#9834;Maybe you'll find someone else\nto help you.&#9835;",
      "&#9834;Maybe Black Mesa?&#9835;",
      "&#9834;That was a joke.\nHa Ha.\nFat Chance!&#9835;",
      "&#9834;Anyway this cake is great!&#9835;",
      "&#9834;It's so delicious and moist!&#9835;",
      "&#9834;Look at me: still talking\nwhen there's science to do!&#9835;",
      "&#9834;When I look out there,\nit makes me glad I'm not you.&#9835;",
      "&#9834;I've experiments to run.&#9835;",
      "&#9834;There is research to be done.&#9835;",
      "&#9834;On the people who are\nstill alive.&#9835;",
      "&#9834;And believe me I am\nstill alive.&#9835;",
      "&#9834;I'm doing science and I'm\nstill alive.&#9835;",
      "&#9834;I feel fantastic and I'm\nstill alive.&#9835;",
      "&#9834;While you're dying I'll be\nstill alive.&#9835;",
      "&#9834;And when you're dead I will be\nstill alive.&#9835;",
      "&#9834;Still alive.\nStill alive&#9835;",
      "Pressing delete does nothing.",
      "When you make a mistake, just type the right answer.",
      "Seirously don't press backspace.",
      "It just makes you feel better.",
      "Holy crap, still here?",
      "No fooling you!",
      "I know it's weird that I programmed this, but at this point I'm even more afraid that you read all this. Seek help."
    ];
    if (this.deleted > notes) { return; }
    $(".bot-note").show().html(notes[this.deleted%notes.length]);
    riot.update();
  }
  getGames() {
    
  }
  startGame(game) {
    this.deleted = -1;
    this.game = game;
    this.fails = 0;
    this.start = new Date().valueOf();
    uR.mountElement("question");
    QUIZ.scores[this.name] = QUIZ.scores[this.name] || {};
    this.scores = QUIZ.scores[this.name][game] = QUIZ.scores[this.name][game] || [];
    this.makeQuestions();
    this.currentIndex = -1;
    this.next();
    riot.update();
  }
}

class LettersQuiz extends Quiz {
  constructor(options) {
    super(options);
    this.name = "Letters";
    this.icon = 'letters-quiz';
    this.icon_text = "d>#";
  }
  getGames() {
    var out = [];
    uR.forEach(this.letters,function(l){
      out.push({verbose: l});
    });
    return out;
  }
  makeQuestions() {
    this.questions = shuffle(range(0,26));
  }
  getVerbose() {
    this.verbose = this.letters[this.question] + ">#";
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
    this.operand = game;
    this.max_question = this.max_question || Math.max(this.operand+3,10);
    this.max_question = 3; //#! TODO remove when not in debug mode
    this.questions = shuffle(range(2,this.max_question+1));
  }
  getAnswer() {
    this.answer = Math.floor(eval(this.verbose));
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
  }
}

class SubtractionQuiz extends MathQuiz {
  constructor(options) {
    super("-",options)
    this.icon = "minus"
    this.name = "Subtraction"
  }
  makeQuestions() {
    super.makeQuestions()
    var that = this;
    this.questions = this.questions.map(function(q) { return q + that.game });
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
  makeQuestions() {
    super.makeQuestions()
    var that = this;
    this.questions = this.questions.map(function(q) { return q * that.game });
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

QUIZ.map = {};
uR.forEach(QUIZ.list,function(q) { QUIZ.map[q.getSlug()] = q; });

$(document).keydown(function(event) {
  if (47 < event.which && event.which < 58) { QUIZ.current.pressNumber(event.which-48); return false; }
  if (event.which == 8) { QUIZ.current.clearInput(); return false; }
  return true;
});

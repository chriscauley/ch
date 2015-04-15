var Question = can.Model.LocalStorage({
  storageName: 'ch'
}, {});

var scores = {}

function Modulo(divisor) {
  var divisor = divisor || Math.floor(Math.random()*(10-2)+2);
  var max_question = Math.pow(divisor,3);
  var question = Math.floor(Math.random()*(max_question-divisor+1)+divisor+1);
  var answers = [];
  for (var i=0;i<divisor;i++) { answers.push(i); }
  return {
    verbose: question + " % " + divisor,
    answer: question%divisor,
    answers: answers,
    scoreKeys: ['modulo','mod'+divisor],
  }
}


can.Component.extend({
  tag: 'question',
  template: can.view("/static/mustache/question.html"),
  viewModel: function(attrs)  {
    var fails = 0;
    var start = new Date().valueOf();
    attrs.question = new Modulo();
    attrs.checkAnswer = function(that) {
      if (that == attrs.question.answer) {
        console.log({
          fails: fails,
          ms: new Date().valueOf() - start,
        });
      }
      else { fails ++; }
    }
    return attrs;
  },
});
$(function() {
  var q = can.mustache("<question></question>")({});
  $("body").append(q);
});

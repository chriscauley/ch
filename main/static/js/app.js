var Question = can.Model.LocalStorage({
  storageName: 'ch'
}, {});

var scores = {};

document.addEventListener("keypress",function(event) {
  if (47 < event.which && event.which < 58) { pressNumber(event.which-48); return false; }
  return true;
});

can.Component.extend({
  tag: 'question',
  template: can.view("/static/mustache/question.html"),
  viewModel: function(attrs)  {
    attrs.input = new can.List();
    attrs.digits = [1,2,3,4,5,6,7,8,9,0];
    attrs = new can.Map(attrs);
    var quiz = attrs.quiz = new window.quiz.LettersQuiz({attrs:attrs});
    window.pressNumber = attrs.pressNumber = quiz.pressNumber.bind(quiz);
    return attrs;
  },
});
$(function() {
  var q = can.mustache("<question></question>")({});
  $("#content").html(q);
});

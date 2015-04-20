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
    var fails = 0;
    var start = new Date().valueOf();
    attrs.input = new can.List();
    attrs.digits = [1,2,3,4,5,6,7,8,9,0];
    attrs.question = new window.quiz.AdditionQuiz({});
    window.pressNumber = attrs.pressNumber = function(that) {
      attrs.input.push(that);
      var input = attrs.input.join('')
      if (input.indexOf(attrs.question.answer) != -1) { // Correct!
        console.log({
          fail: input.indexOf(attrs.question.answer) != 0,
          ms: new Date().valueOf() - start,
        });
        var q = can.mustache("<question></question>")({});
        $("#content").html(q);
      }
    }
    return attrs;
  },
});
$(function() {
  var q = can.mustache("<question></question>")({});
  $("#content").html(q);
});

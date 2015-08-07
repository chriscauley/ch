<question>
  <div class="question-box" data-last-question={ quiz.last_question }>
    { quiz.verbose } = <span class="answer">{ quiz.input }</span>
  </div>
  <numpad></numpad>
  this.on("update",function() {
    this.quiz = window.quiz.current;
  });
</question>

<numpad>
  <button class="btn btn-primary number" onclick={ parent.pressNumber } each={ digits }>{ n }</button>
  this.digits = [];
  for (var i=1;i<11;i++) { this.digits.push({n:i%10}) }
  pressNumber(e) {
    window.quiz.current.pressNumber(e.item.n);
  }
</numpad>

<quizlist>
  <div class="row">
    <div class="half" each={ quizzes }>
      <button class="btn btn-primary btn-block" onclick={ parent.click }>
        <i class="fa fa-{ icon }"></i> { name }</button>
    </div>
  </div>
  this.on('update',function() {
    this.quizzes = window.quizes;
  });
  click(e) {
    quiz.current = e.item;
    $("#content").html("<gamelist>");
    riot.mount("gamelist");
  }
</quizlist>

<gamelist>
  <button class="btn btn-primary btn-block" each={ games } onclick={ parent.click }>
    {{ verbose }}</button>
  this.on("update",function() {
    this.games = window.quiz.current.getGames();
  });
  click(e) {
    quiz.current.selectGame(e.item.verbose);
    $("#content").html("<question>");
    riot.mount("question,numpad");
  }
</gamelist>

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

<scorelist>
  <div each={ scores }>
    { key }: { ms }ms
    <span if={ fail }>({ fail }/{ count } wrong)</span>
  </div>
  this.on("update",function() {
    this.scores = window.quiz.current.getScores();
  });
</scorelist>

<quizlist>
  <div class="row">
    <div class="half" each={ quizzes }>
      <button class="btn btn-primary btn-block" onclick={ parent.click }>
        <i class="fa fa-{ icon }"></i> { name }</button>
    </div>
  </div>
  this.on('update',function() {
    this.quizzes = window.QUIZ.list;
  });
  click(e) {
    uR.route("/game/"+e.item.getSlug()+"/");
  }
</quizlist>

<gamelist>
  <button class="btn btn-primary btn-block" each={ games } onclick={ parent.click }>
    {{ verbose }}</button>
  this.on("update",function() {
    this.games = window.QUIZ.current.getGames();
  });
  click(e) {
    QUIZ.current.startGame(e.item);
  }
</gamelist>

<question>
  <div class="question-box" data-last-question={ quiz.last_question }>
    { quiz.verbose } = <span class="answer">{ quiz.input }</span>
  </div>
  <numpad></numpad>
  <div class="bot-note btn btn-warning btn-block"></div>

  this.on("update",function() {
    this.quiz = window.QUIZ.current;
  });
</question>

<numpad>
  <button class="btn btn-primary number" onclick={ parent.pressNumber } each={ digits }>{ n }</button>
  <div class="clear-wrap">
    <button class="btn btn-primary number fa fa-times-circle" onclick={ clear }></button></div>
  this.digits = [];
  for (var i=1;i<11;i++) { this.digits.push({n:i%10}) }
  clear() {
    window.QUIZ.current.clearInput();
  }
  pressNumber(e) {
    window.QUIZ.current.pressNumber(e.item.n);
  }
</numpad>

<game-over>
  <h1>{ quiz.name } { verbose }</h1>
  <div class="well">
    <li>This game:</li>
    <li>{ last.accuracy }% Correct</li>
    <li>{ last.spq } seconds/question</li>
  </div>
  <div class="well" if={ scores.length > 1 }>
    <li>Played { scores.length } times</li>
    <li>{ total_accuracy }% Correct</li>
    <li>{ total_spq } seconds/question</li>
  </div>
  <div if={ scores.length > 3 } class="well">
    <h2>Last 3 Games:</h2>
    <li>{ accuracy3 }% Correct</li>
    <li>{ spq3 } seconds/question</li>
  </div>
  <div class="row">
    <div class="half">
      <button onclick={ goHome } class="btn btn-primary btn-block fa fa-home"></button>
    </div>
    <div class="half">
      <button onclick={ reset } class="btn btn-primary btn-block fa fa-refresh"></button>
    </div>
  </div>

  reset(e) {
    this.quiz.startGame(this.quiz.game);
  }
  goHome(e) {
    uR.route("/");
  }

  this.on("update",function() {
    this.quiz = window.QUIZ.current;
    this.verbose = this.quiz.game.verbose.replace(/ /g,"");
    this.scores = this.quiz.scores;
    this.total_fails = this.total_count = this.total_ms = this.fails3 = this.count3 = this.ms3 = 0;
    var last = this.scores[this.scores.length-1]
    this.last = {
      accuracy: ((last.count - last.fails) / last.count * 100).toFixed(0),
      spq: (last.ms*0.001 / last.count).toFixed(1)
    }
    for (var i=0;i<this.scores.length;i++) {
      var score = this.scores[i];
      this.total_fails += score.fails;
      this.total_count += score.count;
      this.total_ms += score.ms;
      if (i > this.scores.length - 3) {
        this.fails3 += score.fails;
        this.count3 += score.count;
        this.ms3 += score.ms;
      }
    }
    this.total_accuracy = Math.floor((this.total_count - this.total_fails) / this.total_count * 100);
    this.total_spq = (this.total_ms*0.001 / this.total_count).toFixed(1);
    if (this.count3) {
      this.accuracy3 = Math.floor((this.count3 - this.fails3) / this.count3 * 100);
      this.spq3 = (this.ms3*0.001 / this.count3).toFixed(1);
    }
  });
</game-over>

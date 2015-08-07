<question>
  <div class="question-box" data-last-question="{{ last_question }}">
  { opts.verbose } = <span class="answer">{{#each input }}{{.}}{{/each}}</span>
  </div>
  
</question>

<numpad>
  <button class="btn btn-primary number" onclick={ parent.pressNumber }>{ . }</button>
  pressNumber(e) {

  }
</numpad>

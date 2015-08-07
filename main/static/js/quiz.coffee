shuffle = (array) ->
  counter = array.length
  while (counter > 0)
    # Pick a random index
    index = Math.floor(Math.random() * counter);

    # Decrease counter by 1
    counter--;

    # And swap the last element with it
    temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;

  return array;

class Quiz
  constructor: (@options) ->
    @attrs = @options.attrs # This is the can.Component().attrs that control two way binding
    @makeQuestions()
    @currentIndex = -1
    @next()
  next: (@options) ->
    @start = new Date().valueOf();
    @currentIndex += 1
    if @currentIndex == @questions.length
      @gameOver()
    @question = @questions[@currentIndex]
    @getVerbose()
    @getAnswer()
    @attrs.attr('verbose', @verbose)
    @attrs.input.splice(0,@attrs.input.length)
  getVerbose: () -> "pass"
  getAnswer: () -> "pass"
  makeQuestions: () -> "pass"
  keyPress: (e) ->
    if 47 < event.which && event.which < 58
      @pressNumber(event.which-48)
      return false
    return true;
  pressNumber: (number) ->
    @attrs.input.push(number)
    input = @attrs.input.join('')
    if input.indexOf(@answer) != -1 # correct!
      console.log({
        fail: input.indexOf(@answer) != 0,
        ms: new Date().valueOf() - @start,
      })
      @attrs.attr('last_question', [@verbose,'=',@answer].join(' '))
      @next()
  getIcon: () ->
    return "<i class='fa fa-#{ @icon }'></i>"

class LettersQuiz extends Quiz
  constructor: (@options) ->
    @name = "Letters"
    @letters = "abcdefghijklmnopqrstuvwxyz"
    super @options
    @scoreKeys = ['letters']
  makeQuestions: () -> @questions = shuffle([0..25])
  getVerbose: () -> @verbose = @letters[@question] + ">#"
  getAnswer: () -> @answer = @question + 1
  getIcon: () ->
    return "<i class='fa'>d&gt;#</i>"
  
class MathQuiz extends Quiz
  constructor: (@operator,@options) ->
    @operand = @options.operand || Math.floor(Math.random()*(10-2)+2)
    max_question = @options.max_question || Math.pow(@operand,3)
    @question = Math.floor(Math.random()*(max_question-@operand+1)+@operand+1)
  makeQuestions: () ->
    @questions = shuffle([2..20])
  getAnswer: () ->
    @answer = eval(@verbose)
  getVerbose: () ->
    @verbose = [@question,@operator,@operand].join(' ')

class AdditionQuiz extends MathQuiz
  constructor: (@options) ->
    @icon = "plus"
    @name = "Addition"
    super "+",@options
    @scoreKeys = ['addition','add'+@operand]

class SubtractionQuiz extends MathQuiz
  constructor: (@options) ->
    @icon = "minus"
    @name = "Subtraction"
    super "-",@options
    @scoreKeys = ['subtration','sub'+@operand]

class MultiplyQuiz extends MathQuiz
  constructor: (@options) ->
    @icon = "times"
    @name = "Multiplication"
    super "*",@options
    @scoreKeys = ['multiplication','mul'+@operand]

class DivisionQuiz extends MathQuiz
  constructor: (@options) ->
    @name = "Division"
    super "/",@options
    @scoreKeys = ['division','div'+@operand]
  getIcon: () ->
    return "<i class='fa'>&divide;</i>"
    
class ModuloQuiz extends MathQuiz
  constructor: (@options) ->
    @name = "Modulo"
    super "%",@options
    @scoreKeys = ['modulo','mod'+@operand]
  getIcon: () ->
    return "<i class='fa'>%</i>"

window.quiz = {
  AdditionQuiz: AdditionQuiz
  SubtractionQuiz: SubtractionQuiz
  MultiplyQuiz: MultiplyQuiz
  DivisionQuiz: DivisionQuiz
  ModuloQuiz: ModuloQuiz
  LettersQuiz: LettersQuiz
}

window.quizes = [
  new AdditionQuiz({})
  new SubtractionQuiz({})
  new MultiplyQuiz({})
  new DivisionQuiz({})
  new ModuloQuiz({})
  new LettersQuiz({})
]

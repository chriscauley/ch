class MathQuiz
  constructor: (@operator,@options) ->
    @operand = @options.operand || Math.floor(Math.random()*(10-2)+2)
    max_question = @options.max_question || Math.pow(@operand,3)
    @question = Math.floor(Math.random()*(max_question-@operand+1)+@operand+1)
    @verbose = [@question,@operator,@operand].join(' ')
    @answer = eval(@verbose)
    @answer = @question + @operand

class AdditionQuiz extends MathQuiz
  constructor: (@options) ->
    super "+",@options
    @scoreKeys = ['addition','add'+@operand]

class SubtractionQuiz extends MathQuiz
  constructor: (@options) ->
    super "-",@options
    @scoreKeys = ['subtration','sub'+@operand]

class MultiplyQuiz extends MathQuiz
  constructor: (@options) ->
    super "*",@options
    @scoreKeys = ['multiplication','mul'+@operand]

class DivisionQuiz extends MathQuiz
  constructor: (@options) ->
    super "/",@options
    @scoreKeys = ['division','div'+@operand]

class ModuloQuiz extends MathQuiz
  constructor: (@options) ->
    super "%",@options
    @scoreKeys = ['modulo','mod'+@operand]

window.quiz = {
  AdditionQuiz: AdditionQuiz
  SubtractionQuiz: SubtractionQuiz
  MultiplyQuiz: MultiplyQuiz
  DivisionQuiz: DivisionQuiz
  ModuloQuiz: ModuloQuiz
}

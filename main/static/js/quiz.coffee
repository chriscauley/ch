class Modulo
  constructor: (@options) ->
    operand = @options.operand || Math.floor(Math.random()*(10-2)+2)
    max_question = Math.pow(operand,3)
    question = Math.floor(Math.random()*(max_question-operand+1)+operand+1)
    @answers = [0 .. operand-1]
    @verbose = question + " % " + operand
    @answer = question%operand
    @scoreKeys = ['modulo','mod'+operand]

class Mulitply
  constructor: (@options) ->
    operand = @options.operand || Math.floor(Math.random()*(10-2)+2)
    max_question = Math.pow(operand,3)
    question = Math.floor(Math.random()*(max_question-operand+1)+operand+1)
    @answers = [0 .. operand-1]
    @verbose = question + " % " + operand
    @answer = question%operand
    @scoreKeys = ['modulo','mod'+operand]
    

window.Modulo = Modulo

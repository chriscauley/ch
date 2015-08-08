var scores = {};

document.addEventListener("keypress",function(event) {
  if (47 < event.which && event.which < 58) { quiz.current.pressNumber(event.which-48); return false; }
  return true;
});

riot.mount("quizlist")

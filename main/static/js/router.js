uR._routes = {
  "^/$": function(path,data) {},
  "/(game)/(.*)/": function(path,data) {
    uR.mountElement("gamelist");
    QUIZ.current = QUIZ.map[data.matches[2]];
  }
}

uR.config.mount_to="#content";

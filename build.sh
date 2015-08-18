cp main/static/less/bs.css .build/
cp main/static/tags/question.tag .build/
lessc main/static/less/base.less .build/ch.css
babel main/static/js/quiz.js >.build/ch.js

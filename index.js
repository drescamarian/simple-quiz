const readline = require("readline");
const fs = require("fs");
const path = require("path");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const quiz = {
  questions: [],
  currentQuestion: 0,
  score: 0,
  name: "",
  loadQuestions: function () {
    let questions = JSON.parse(
      fs.readFileSync(path.join(__dirname, "questions.json"), "utf-8")
    );
    let randomQuestions = [];
    while (randomQuestions.length < 5) {
      let randomIndex = Math.floor(Math.random() * questions.length);
      if (!randomQuestions.includes(questions[randomIndex])) {
        randomQuestions.push(questions[randomIndex]);
      }
    }
    this.questions = randomQuestions;
  },
  askName: function () {
    rl.question("What is your name? ", (name) => {
      if (name === "") {
        name = "Player";
      }
      console.log(`Hello ${name}!`);
      this.name = name;
      quiz.askQuestion();
    });
  },
  askQuestion: function () {
    rl.question(quiz.questions[quiz.currentQuestion].question, (answer) => {
      if (
        answer.toLowerCase().trim() ===
        quiz.questions[quiz.currentQuestion].answer.toLowerCase().trim()
      ) {
        quiz.score++;
        console.log("Correct!");
      } else {
        console.log("Wrong!");
      }
      quiz.currentQuestion++;
      if (quiz.currentQuestion < quiz.questions.length) {
        quiz.askQuestion();
      } else {
        console.log(
          `You got ${quiz.score} out of ${quiz.questions.length} questions correct!`
        );
        quiz.storeScore();
      }
    });
  },
  storeScore: function () {
    fs.appendFileSync(
      path.join(__dirname, "scores.txt"),
      `${this.name}: ${this.score}\n`
    );
    quiz.playAgain();
  },
  playAgain: function () {
    rl.question("Do you want to play again? (yes/no) ", (answer) => {
      if (answer.toLowerCase().trim() === "yes") {
        quiz.currentQuestion = 0;
        quiz.score = 0;
        quiz.askQuestion();
      } else {
        let scores = fs.readFileSync(
          path.join(__dirname, "scores.txt"),
          "utf-8"
        );
        let firstPlace = "";
        let secondPlace = "";
        let thirdPlace = "";
        let firstPlaceScore = 0;
        let secondPlaceScore = 0;
        let thirdPlaceScore = 0;
        let lines = scores.split("\n");
        for (let i = 0; i < lines.length; i++) {
          let line = lines[i];
          if (line !== "") {
            let name = line.split(":")[0];
            let score = parseInt(line.split(":")[1]);
            if (score > firstPlaceScore) {
              thirdPlace = secondPlace;
              thirdPlaceScore = secondPlaceScore;
              secondPlace = firstPlace;
              secondPlaceScore = firstPlaceScore;
              firstPlace = name;
              firstPlaceScore = score;
            } else if (score > secondPlaceScore) {
              thirdPlace = secondPlace;
              thirdPlaceScore = secondPlaceScore;
              secondPlace = name;
              secondPlaceScore = score;
            } else if (score > thirdPlaceScore) {
              thirdPlace = name;
              thirdPlaceScore = score;
            }
          }
        }
        console.log(`1. ${firstPlace}: ${firstPlaceScore}`);
        console.log(`2. ${secondPlace}: ${secondPlaceScore}`);
        console.log(`3. ${thirdPlace}: ${thirdPlaceScore}`);
        rl.close();
      }
    });
  },
};

quiz.loadQuestions();
quiz.askName();
quiz.askQuestion();
quiz.storeScore();

/*
 The quescions.json file contains the questions and answers for the quiz.
  the question format is as follows:
  { | index  |   |            text    |  new line  | }
    "question": " |YOUR QUESTION HEARE|  \n",
    "answer": " |YOUR ANSWER HEARE| "
  } "," - is a comma that separates the questions and answers is the required format for a json file
!------------------------------------------------------------------------------!
  The quiz object contains the following properties:
  questions: an array of questions
  currentQuestion: the index of the current question
  score: the number of correct answers

*/

/* 
  the quiz object contains the following methods:
  loadQuestions: a method that loads the questions from the questions.json file
  askQuestion: a method that asks the current question and checks the answer

*/

/* Dis is the begening of the file:
   You can install these dependencies by running the following command in the terminal:
  npm install readline fs path --save || npm i readline fs path -S
  "You need to get 'npm init' first to get the package.json file"
  "And the package.json file is required to install the dependencies"
  "Don't forget to add the packages to ignode file" 


The dependencies for this project are:
  - readline - is a node module that allows us to read input from the command line
  - fs - is a node module that allows us to read and write files
  - path - is a node module that allows us to work with file paths

  You can run the program by running the following command in the terminal:
  node index.js || npm start

*/

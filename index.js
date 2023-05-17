import readline from "readline";
import chalk from "chalk";
import fs from "fs";
import { dirname } from "path";
import path from "path";
import { fileURLToPath } from "url";
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const __dirname = dirname(fileURLToPath(import.meta.url));

const quiz = {
  questions: [],
  currentQuestion: 0,
  score: 0,
  name: "",
  askQuestionsSets: "",
  // Ask the user for the questions set and load the questions
  askQuestionSet: function () {
    console.clear();
    rl.question(
      "What questions set do you want to load?\n1. Kids questions\n2. General questions\n3. World Capitals\n4. General questions v2\nYour chose => ",
      (answer) => {
        if (answer > 0 && answer <= 4) {
          this.loadQuestion(answer);
        } else {
          console.log("Invalid input! Loading default questions set.");
          this.askQuestionSet();
          return;
        }
      }
    );
  },

  loadQuestion: function (load) {
    let readQuescion = JSON.parse(
      fs.readFileSync(path.join(__dirname, `questions${load}.json`), "utf-8")
    );
    let shuffle = readQuescion.sort(() => Math.random() - 0.5);
    this.questions = shuffle;
    if (load === 1) {
      this.askQuestionsSets = "Kids questions";
    }
    if (load === 2) {
      this.askQuestionsSets = "General questions";
    }
    if (load === 3) {
      this.askQuestionsSets = "World Capitals";
    }
    if (load === 4) {
      this.askQuestionsSets = "General questions v2";
    }
    this.askName();
  },

  // Ask the user for his name
  askName: function () {
    rl.question("What is your name? => ", (name) => {
      if (name === "") {
        name = "Player";
      }
      console.log(chalk.magenta(`Hello ${name}! Welcome to the quiz! `));
      console.log(`There are ${this.questions.length} questions in this quiz!`);
      console.log("Type your answer and press enter to submit it.");
      console.log("Type 'exit' to exit the quiz.");
      console.log("Good luck!");
      this.name = name;
      this.askQuestion();
    });
  },
  // Ask the user the current question and await for the loadQuestion to finish
  askQuestion: function () {
    rl.question(
      this.questions[this.currentQuestion].question + "\n",
      (answer) => {
        if (
          answer.toLowerCase().trim() ===
          this.questions[this.currentQuestion].answer.toLowerCase().trim()
        ) {
          this.score++;
          console.log(chalk.green.bold("Correct!" + "\n"));
        } else if (answer === "exit") {
          console.log(
            chalk.blue(
              `You got ${this.score} out of ${this.questions.length} questions correct!`
            )
          );
          this.storeScore();
        } else {
          console.log(
            chalk.red("Wrong! The correct answer is: ") +
              chalk.green(this.questions[this.currentQuestion].answer) +
              "\n"
          );
        }
        this.currentQuestion++;
        if (this.currentQuestion < this.questions.length) {
          this.askQuestion();
        } else {
          console.log(
            chalk.blue(
              `You got ${this.score} out of ${this.questions.length} questions correct!`
            )
          );
          this.storeScore();
        }
      }
    );
  },
  // Store the user's score in a file
  storeScore: function () {
    fs.appendFileSync(
      path.join(__dirname, "scores.txt"),
      `${this.name}: ${this.score} : ${this.askQuestionsSets}\n`
    );
    this.playAgain();
  },
  // Ask the user if he wants to play again ore exit the game and print the top 3 scores
  playAgain: function () {
    rl.question("Do you want to play again? (yes/no) ", (answer) => {
      if (answer.toLowerCase().trim() === "yes") {
        this.currentQuestion = 0;
        this.score = 0;
        this.questions = this.questions.sort(() => Math.random() - 0.5);
        console.clear();
        this.askQuestion();
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
quiz.askQuestionSet();
// quiz.loadQuestion();
// quiz.askName();
// quiz.askQuestion();
// quiz.storeScore();

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

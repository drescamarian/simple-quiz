// heare i import the readline, fs and path modules
const readline = require("readline");
const fs = require("fs"); // fs is a file sistem module
const path = require("path"); // path is a module that allows us to work with file paths
// heare i create a readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
// heare i create a quiz object that will contain the questions and answers for the quiz and the current question and score
const quiz = {
  questions: [], // heare i create an empty array that will contain the questions
  currentQuestion: 0, // heare i create a variable that will contain the index of the current question
  score: 0, // heare i create a variable that will contain the number of correct answers
  loadQuestions: function () { // heare i create a method that loads the questions from the questions.json file
    const questions = JSON.parse( fs.readFileSync(path.join(__dirname, "questions.json"))); // heare i parse the questions.json file
    this.questions = questions; // heare i set the questions property to the questions array
  },
};

quiz.loadQuestions(); // heare i call the loadQuestions method to load the questions from the questions.json file
// heare i create a function that asks the current question and checks the answer
function askQuestion() {
  const question = quiz.questions[quiz.currentQuestion]; // heare i get the current question
  rl.question(question.question, (answer) => { // heare i ask the current question
    if (answer.toLowerCase() === question.answer.toLowerCase()) { // heare i check the answer
      quiz.score++; // heare i increment the score
      console.log("Correct!"); // heare i print the result
    } else {
      console.log("Incorrect!"); // heare i print the result
    }
    quiz.currentQuestion++; // heare i increment the current question
    if (quiz.currentQuestion === quiz.questions.length) { // heare i check if the quiz is over
      console.log(`You scored ${quiz.score} out of ${quiz.questions.length}`); // heare i print the final score
      rl.close(); // heare i close the readline interface
    } else {
      askQuestion(); // heare i call the askQuestion function to ask the next question and check the answer
    }
  });
}

askQuestion(); // heare i call the askQuestion function to ask the current question and check the answer

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
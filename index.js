import readline from "readline";
import chalk from "chalk";
import fs from "fs";
import path, { dirname } from "path";
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
  text: [],
  static: [],
  language: "",
  // Ask the user for the language
  askLanguage: function () {
    // console.clear();
    rl.question(
      "Choose your language: \n1 → English\n2 → German\n3 → Romana\n4 → Polski\n",
      (answer) => {
        console.clear();
        let filepath = "";
        if (answer == 1) {
          filepath = "en";
        } else if (answer == 2) {
          filepath = "de";
        } else if (answer == 3) {
          filepath = "ro";
        } else if (answer == 4) {
          filepath = "pl";
        } else {
          console.log("Please choose a number from 1 to 4");
          this.askLanguage();
          return;
        }
        this.language += "/index-" + filepath;
        this.text = fs.readFileSync(
          path.join(__dirname, `/index-${filepath}`, `statictext.txt`),
          "utf-8"
        );
        this.static = this.text.split("\n").map((line) => {
          if (line !== "") {
            let first = line.split(":")[0];
            let second = line.split(":")[1];
            let therd = line.split(":")[2];
            return { first, second, therd };
          }
        });
        this.askQuestionSet();
      }
    );
  },
  // Ask the user for the questions set and load the questions
  askQuestionSet: function () {
    console.clear();
    console.log(chalk.yellow(this.static[0].first));
    console.log(chalk.yellow(this.static[1].first));
    rl.question(
      this.static[2].first +
        "\n" +
        this.static[3].first +
        "\n" +
        this.static[4].first +
        "\n" +
        this.static[5].first +
        "\n" +
        this.static[6].first +
        "\n" +
        this.static[7].first,
      (answer) => {
        if (answer > 0 && answer <= 4) {
          this.loadQuestion(answer);
        } else {
          console.log(this.static[8].first);
          this.askQuestionSet();
          return;
        }
      }
    );
  },

  loadQuestion: function (load) {
    let readQuescion = JSON.parse(
      fs.readFileSync(
        path.join(__dirname, this.language, `questions${load}.json`),
        "utf-8"
      )
    );
    let shuffle = readQuescion.sort(() => Math.random() - 0.5);
    this.questions = shuffle;
    if (load == 1) {
      this.askQuestionsSets = this.static[9].first;
    }
    if (load == 2) {
      this.askQuestionsSets = this.static[10].first;
    }
    if (load == 3) {
      this.askQuestionsSets = this.static[11].first;
    }
    if (load == 4) {
      this.askQuestionsSets = this.static[12].first;
    }
    this.askName();
  },

  // Ask the user for his name
  askName: function () {
    rl.question(this.static[13].first, (name) => {
      if (name === "") {
        name = "Player";
      }
      console.log(
        chalk.magenta(this.static[14].first + name + this.static[14].second)
      );
      console.log(
        chalk.yellow(
          this.static[15].first + this.questions.length + this.static[15].second
        )
      );
      console.log(chalk.green(this.static[16].first));
      console.log(chalk.green(this.static[17].first));
      console.log(chalk.cyanBright(this.static[18].first));
      this.name = name;
      this.askQuestion();
    });
  },
  // Ask the user the current question and await for the loadQuestion to finish
  askQuestion: function () {
    rl.question(
      chalk.greenBright(this.questions[this.currentQuestion].question) +
        "\n" +
        chalk.cyan(this.questions[this.currentQuestion].take) +
        "\n" +
        chalk.cyan(this.static[19].first),
      (answer) => {
        if (
          answer.toLowerCase().trim() ===
          this.questions[this.currentQuestion].answer.toLowerCase().trim()
        ) {
          this.score++;
          console.log(chalk.green.bold(this.static[20].first));
        } else if (answer === "exit") {
          console.log(
            chalk.blue(
              this.static[21].first +
                this.score +
                this.static[21].second +
                this.questions.length +
                this.static[21].therd
            )
          );
          this.storeScore();
        } else {
          console.log(
            chalk.red(this.static[22].first) +
              chalk.greenBright(this.static[22].second) +
              chalk.green(this.questions[this.currentQuestion].answer)
          );
        }
        this.currentQuestion++;
        if (this.currentQuestion < this.questions.length) {
          this.askQuestion();
        } else {
          console.log(
            chalk.blue(
              this.static[23].first +
                this.score +
                this.static[23].second +
                this.questions.length +
                this.static[23].therd
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
    rl.question(this.static[24].first, (answer) => {
      if (answer.toLowerCase().trim() === "yes") {
        this.currentQuestion = 0;
        this.score = 0;
        this.questions = this.questions.sort(() => Math.random() - 0.5);
        console.clear();
        this.askQuestionSet(); // jump to begining wihtout loading the questions
      } else {
        let scores = fs.readFileSync(
          path.join(__dirname, "scores.txt"),
          "utf-8"
        );
        scores = scores.trim();
        let lines = scores.split("\n");
        let score = lines.map((line) => {
          if (line !== "") {
            let name = line.split(":")[0];
            let score = parseInt(line.split(":")[1]);
            let Set = line.split(":")[2];
            return { name, score, Set };
          }
        });
        score = score.sort((a, b) => b.score - a.score);
        let bgcolors = [
          { color: "bgBlue" },
          { color: "bgRed" },
          { color: "bgWhite" },
          { color: "bgYellow" },
          { color: "bgGreen" },
          { color: "bgMagenta" },
          { color: "bgCyan" },
          { color: "bgBlack" },
          { color: "bgBlueBright" },
          { color: "bgRedBright" },
          { color: "bgWhiteBright" },
          { color: "bgYellowBright" },
          { color: "bgGreenBright" },
          { color: "bgMagentaBright" },
          { color: "bgCyanBright" },
          { color: "bgBlackBright" },
        ];
        let color = [
          { color: "blackBright" },
          { color: "blue" },
          { color: "red" },
          { color: "white" },
          { color: "yellow" },
          { color: "green" },
          { color: "magenta" },
          { color: "cyan" },
          { color: "black" },
          { color: "blueBright" },
          { color: "redBright" },
          { color: "whiteBright" },
          { color: "yellowBright" },
          { color: "greenBright" },
          { color: "magentaBright" },
          { color: "cyanBright" },
        ];
        for (let i = 0; i < Math.min(score.length, 16); i++) {
          console.log(
            chalk[bgcolors[i].color][color[i].color](
              `${i + 1}. ${score[i].name}: ${score[i].score} in ${score[i].Set}`
            )
          );
        }
        rl.close();
      }
    });
  },
};
quiz.askLanguage();

/*
 The quescions.json file contains the questions and answers for the quiz.
  the question format is as follows:
  { | index  |   |            text    |  new line  | }
    "question": " |YOUR QUESTION HEARE|  ", 
    "take": "A => first\nB => second\nC => therd\nD => forth", tear are 4 variants of answers only one is correct 
    "answer": " A || B || C || D " for the answer you can use the first letter of the answer or the full answer
  } "," - is a comma that separates the questions and answers is the required format for a json file
!------------------------------------------------------------------------------!
  The quiz object contains the following properties:
  questions: an array of questions
  currentQuestion: the index of the current question
  score: the number of correct answers
*/
/*
  The statictext.txt file contains the text for the quiz.
  the text format is as follows:
┌─────────┬───────────────────────────────────────────────────┬─────────────────────────────┬────────────────────────┐
│ (index) │                       first                       │           second            │         therd          │
├─────────┼───────────────────────────────────────────────────┼─────────────────────────────┼────────────────────────┤
│    0    │              'Welcome to the quiz! '              │             ''              │           ''           │
│    1    │        'Please choose a questions set => '        │             ''              │           ''           │
│    2    │    'What questions set do you want to load? '     │             ''              │           ''           │
│    3    │               '1. Kids questions '                │             ''              │           ''           │
│    4    │              '2. General Version 1 '              │             ''              │           ''           │
│    5    │               '3. World Capitals '                │             ''              │           ''           │
│    6    │              '4. General Version 2 '              │             ''              │           ''           │
│    7    │                 'Your chose => '                  │             ''              │           ''           │
│    8    │ 'Invalid input! Loading default questions set. '  │             ''              │           ''           │
│    9    │                 'Kids questions '                 │             ''              │           ''           │
│   10    │               'General Version 1 '                │             ''              │           ''           │
│   11    │                 'World Capitals '                 │             ''              │           ''           │
│   12    │               'General Version 2 '                │             ''              │           ''           │
│   13    │             'What is your name? => '              │             ''              │           ''           │
│   14    │                     'Hello '                      │  ' Welcome to the quiz! '   │           ''           │
│   15    │                   'There are '                    │ ' questions in this quiz! ' │           ''           │
│   16    │ 'Type your answer and press enter to submit it. ' │             ''              │           ''           │
│   17    │         "Type 'exit' to exit the quiz. "          │             ''              │           ''           │
│   18    │                   'Good luck! '                   │             ''              │           ''           │
│   19    │                 'Your answer => '                 │             ''              │           ''           │
│   20    │                    'Correct! '                    │             ''              │           ''           │
│   21    │                    'You got '                     │         ' out of '          │ ' questions correct! ' │
│   22    │                     'Wrong! '                     │ ' The correct answer is  '  │           ''           │
│   23    │                    'You got '                     │         ' out of '          │ ' questions correct! ' │
│   24    │      'Do you want to play again? (yes/no) '       │             ''              │           ''           │
└─────────┴───────────────────────────────────────────────────┴─────────────────────────────┴────────────────────────┘
!------------------------------------------------------------------------------!
  Use in the code as follows:
  this.static[0].first
  this.static[0].second
  this.static[0].therd
  this.static[1].first
  this.static[1].second
  this.static[1].therd
  For the text cam be set with index 0 to 24 and the first, second and therd can be set with index 0 to 2
  first - is the first line of the text
  second - is the second line of the text
  therd - is the therd line of the text
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

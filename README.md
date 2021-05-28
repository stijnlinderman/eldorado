# The Quest for El Dorado

'The Quest for El Dorado' is a deck building type of racing game across tiles that represent different kinds of landscapes towards the finish, which is El Dorado, the legendary city of gold in South America. Players need to pay for every step across the board using cards drawn from their own personal deck and can improve the effectivity of their personal deck by buying extra cards from the game market. The first player that reaches El Dorado, wins the game.

Note: in this repository, the game is referred to as 'El Dorado'.

[Read the rules of the original board game](https://www.ultraboardgames.com/the-quest-for-el-dorado/game-rules.php).

## Digital version

In this digital version, the original game is mimicked. The current version features the following dynamics:
* Create a custom map by hardcoding it in the backend;
* View the game in the browser by going to http://localhost:3000;
* Four kinds of fields: jungle, sea, treasure and El Dorado;
* Play the game with 1 player;
* Take steps, one field at a time, towards the finish;
* Win the game by reaching the finish.

## Installation and usage

The installation, usage and testing of this repository requires running the described commands in the folders as mentioned using a Windows command line tool like command prompt.

1. Get this repository to your local machine;
1. Run the 'gradlew run' command in the root directory of this repository;
1. Run the 'npm run start' command in the /client directory of this repository;
The application should now be accesible by going to http://localhost:3000 in your browser.

##### Running tests

1. Before testing, run the 'gradlew build' command in the root directory of this repository
1. After the building is finished, execute the testing process by running the 'gradlew test' command in the root directory of this repository
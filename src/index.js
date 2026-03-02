import { Player, Computer } from './modules/player.js';
import { GameController } from './modules/game-controller.js';
import { BoardDisplay } from './modules/board-display.js';
import './style.css';

// create players
const human = new Player();
const computer = new Computer();

// instantiate game controller
const gameController = new GameController(human, computer, true);

// build board ui;
const boardDisplay = new BoardDisplay(human.gameBoard.boardSize, (coord) =>
  gameController.playRound(coord),
);

const boardsContainer = document.querySelector('.boards-container');
boardsContainer.appendChild(boardDisplay.ownBoard);
boardsContainer.appendChild(boardDisplay.opponentBoard);

// placeShips
computer.placeRandomly();
const humanCoords = human.placeRandomly();

// show ships
BoardDisplay.showFleet(humanCoords, boardDisplay.ownBoard);

import { GameController } from '../src/modules/game-controller';
import { Player, Computer } from '../src/modules/player';

describe('Game controller', () => {
  let player1, player2, computer, gameController;
  beforeEach(() => {
    player1 = new Player();
    player2 = new Player();
    computer = new Computer();
  });

  describe('PlayRound', () => {
    describe('When both players are human', () => {
      beforeEach(() => {
        gameController = new GameController(player1, player2, false);
      });

      test('swap players after a valid attack with no winner', () => {
        jest.spyOn(player2.gameBoard, 'receiveAttack').mockReturnValue({
          success: true,
          hit: false,
        });

        gameController.playRound([1, 2]);
        expect(gameController.currentPlayer).toEqual(player2);
        expect(gameController.opponent).toEqual(player1);
      });

      test('does not swap players on invalid attack', () => {
        jest.spyOn(player2.gameBoard, 'receiveAttack').mockReturnValue({
          success: false,
          hit: false,
        });

        gameController.playRound([1, 2]);
        expect(gameController.currentPlayer).toEqual(player1);
        expect(gameController.opponent).toEqual(player2);
      });

      test('return invalid when attack fails', () => {
        jest.spyOn(player2.gameBoard, 'receiveAttack').mockReturnValue({
          success: false,
          hit: false,
        });

        const result = gameController.playRound([1, 5]);
        expect(result).toEqual({ invalid: true });
      });

      test('exit when player wins, no swapping', () => {
        jest.spyOn(player2.gameBoard, 'receiveAttack').mockReturnValue({
          success: true,
          hit: false,
        });

        jest
          .spyOn(gameController.opponent.gameBoard, 'hasAllShipsSunk')
          .mockReturnValue(true);

        const result = gameController.playRound([1, 2]);
        expect(result.winner).toEqual(player1);
        expect(gameController.currentPlayer).toEqual(player1);
      });
    });

    describe('When playing vs computer', () => {
      beforeEach(() => {
        gameController = new GameController(player1, computer, true);
      });

      test('human and computer both attack with normal round', () => {
        const result = gameController.playRound([1, 2]);

        expect(result.human).toBeDefined();
        expect(result.computer).toBeDefined();
      });

      test('current player persists after both attacks', () => {
        gameController.playRound([1, 2]);
        expect(gameController.currentPlayer).toEqual(player1);
      });

      test('computer does not attack when human wins', () => {
        const chooseTarget = jest.spyOn(computer, 'chooseTarget');

        jest.spyOn(computer.gameBoard, 'hasAllShipsSunk').mockReturnValue(true);

        gameController.playRound([1, 2]);
        expect(chooseTarget).not.toHaveBeenCalled();
      });

      test('invalid human attack does not trigger computer attack', () => {
        const chooseTarget = jest.spyOn(computer, 'chooseTarget');

        jest.spyOn(computer.gameBoard, 'receiveAttack').mockReturnValue({
          success: false,
          hit: false,
        });

        gameController.playRound([1, 2]);
        expect(chooseTarget).not.toHaveBeenCalled();
      });
    });
  });
});

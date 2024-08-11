function Gameboard() {
  const rows = (columns = 3);
  let board = [];

  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push(0);
    }
  }

  const addMark = function (row, column, symbol) {
    board[row][column] = symbol;
  };

  const getBoard = () => board;

  return { getBoard, addMark };
}

function GameController(playerOne, playerTwo) {
  let gameBoard = Gameboard().getBoard();
  const players = [
    {
      name: playerOne,
      symbol: "X",
      symbolsInLine: 0,
      victories: 0,
    },
    {
      name: playerTwo,
      symbol: "O",
      symbolsInLine: 0,
      victories: 0,
    },
  ];
  let [firstPlayer, secondPlayer] = players;

  let activePlayer = players[0];
  const switchActivePlayer = () =>
    (activePlayer = activePlayer === players[0] ? players[1] : players[0]);

  const checkWinner = function () {
    //diagonal check
    const winLines = 3;
    let winner = "";
    let rightDiagonalPlayer;
    let leftDiagonalPlayer;
    let rightDiagonal = false;
    let leftDiagonal = false;
    if (gameBoard[0][0] === firstPlayer.symbol)
      rightDiagonalPlayer = firstPlayer;
    if (gameBoard[0][0] === secondPlayer.symbol)
      rightDiagonalPlayer = secondPlayer;
    if (gameBoard[0][2] === firstPlayer.symbol)
      leftDiagonalPlayer = firstPlayer;
    if (gameBoard[0][2] === secondPlayer.symbol)
      leftDiagonalPlayer = secondPlayer;

    for (let i = 0; i < gameBoard.length; i++) {
      rightDiagonal =
        gameBoard[i][i] === rightDiagonalPlayer?.symbol ? true : false;
      leftDiagonal =
        gameBoard[i][gameBoard.length - i - 1] === leftDiagonalPlayer?.symbol
          ? true
          : false;
    }
    if (rightDiagonal) winner = rightDiagonalPlayer.name;
    if (leftDiagonal) winner = leftDiagonalPlayer.name;

    //horizontal check
    for (let j = 0; j < gameBoard.length; j++) {
      for (let k = 0; k < gameBoard[j].length; k++) {
        if (gameBoard[j][k] === firstPlayer.symbol) {
          firstPlayer.symbolsInLine++;
          secondPlayer.symbolsInLine = 0;
        } else if (gameBoard[j][k] === secondPlayer.symbol) {
          secondPlayer.symbolsInLine++;
          firstPlayer.symbolsInLine = 0;
        } else firstPlayer.symbolsInLine = secondPlayer.symbolsInLine = 0;

        if (firstPlayer.symbolsInLine === winLines) winner = firstPlayer.name;
        if (secondPlayer.symbolsInLine === winLines) winner = secondPlayer.name;
      }
    }

    //vertical win check
    for (let i = 0; i < gameBoard.length + 1; i++) {
      for (let j = 0; j < gameBoard.length; j++) {
        if (gameBoard[j][i] === firstPlayer.symbol) {
          firstPlayer.symbolsInLine++;
          secondPlayer.symbolsInLine = 0;
        } else if (gameBoard[j][i] === secondPlayer.symbol) {
          secondPlayer.symbolsInLine++;
          firstPlayer.symbolsInLine = 0;
        } else firstPlayer.symbolsInLine = secondPlayer.symbolsInLine = 0;

        if (firstPlayer.symbolsInLine === winLines) winner = firstPlayer.name;
        if (secondPlayer.symbolsInLine === winLines) winner = secondPlayer.name;
      }
    }

    return winner;
  };

  const updateBoard = (target, symbol) => {
    if (target.includes("first")) gameBoard[0][0] = symbol;
    if (target.includes("second")) gameBoard[0][1] = symbol;
    if (target.includes("third")) gameBoard[0][2] = symbol;

    if (target.includes("fourth")) gameBoard[1][0] = symbol;
    if (target.includes("fifth")) gameBoard[1][1] = symbol;
    if (target.includes("sixth")) gameBoard[1][2] = symbol;

    if (target.includes("seventh")) gameBoard[2][0] = symbol;
    if (target.includes("eight")) gameBoard[2][1] = symbol;
    if (target.includes("ninth")) gameBoard[2][2] = symbol;
  };

  const resetBoard = (board) => {
    setTimeout(() => {
      gameBoard = Gameboard().getBoard();
      Array.from(board.children).forEach((element) => {
        Array.from(element.children).forEach((input) => {
          input.value = null;
        });
      });
    }, 1000);
  };

  const getPlayers = () => players;
  const getActivePlayer = () => activePlayer;

  return {
    getPlayers,
    getActivePlayer,
    checkWinner,
    switchActivePlayer,
    updateBoard,
    resetBoard,
  };
}

function SceneController() {
  const gameController = GameController("A", "B");
  const boardElement = document.querySelector(".board-container");
  const resetButton = document.querySelector(".reset-game");
  const players = gameController.getPlayers();
  const [first, second] = players;
  let activePlayer = gameController.getActivePlayer();
  let winner;

  boardElement.addEventListener("click", (e) => {
    if (e.target.value) return;

    e.target.value = activePlayer.symbol;
    gameController.updateBoard(e.target.id, activePlayer.symbol);
    winner = gameController.checkWinner();
    if (winner === first.name) {
      first.victories++;
      updateVictoryCounter(first.victories, second.victories);
      gameController.resetBoard(boardElement);
    }
    if (winner === second.name) {
      second.victories++;
      updateVictoryCounter(first.victories, second.victories);
      gameController.resetBoard(boardElement);
    }
    gameController.switchActivePlayer();
    activePlayer = gameController.getActivePlayer();
  });

  resetButton.addEventListener("click", () => {
    first.victories = 0;
    second.victories = 0;
    updateVictoryCounter(0, 0);
    gameController.resetBoard(boardElement);
  });
}

function updateVictoryCounter(playerOne, playerTwo) {
  const xPlayerVictoryCounter = document.querySelector(".x-player-counter");
  const oPlayerVictoryCounter = document.querySelector(".o-player-counter");

  xPlayerVictoryCounter.innerHTML = `X:${playerOne}`;
  oPlayerVictoryCounter.innerHTML = `O:${playerTwo}`;
}

SceneController();

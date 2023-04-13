import "./styles.css";
import { useReducer } from "react";

const NUM_ROWS = 3;
const NUM_COLS = 3;

export default function App() {
  const [
    { board, winner, currentPlayer, isTiedGame, isOver },
    dispatch
  ] = useReducer(reducer, generateEmptyState());

  return (
    <div className="App">
      <h1>Let's Play Tic Tac Toe</h1>
      {winner === null && !isTiedGame && <h4>Player {currentPlayer}'s Turn</h4>}
      {winner !== null && <h4>Player {winner} Wins!</h4>}
      {isTiedGame && <h4>OH! Its a Tie!!</h4>}
      <div className="board">
        {board.map((colEntries, colIndex) => {
          return (
            <div className="column" key={colIndex}>
              {colEntries.map((val, index) => {
                return (
                  <div
                    key={index}
                    className={`tile`}
                    onClick={() => {
                      dispatch({
                        type: "MAKE_MOVE",
                        payload: { colIndex: colIndex, rowIndex: index }
                      });
                    }}
                  >
                    <span className={`player player-${val}`}>
                      {val === 1 ? "X" : val === 2 ? "O" : null}
                    </span>
                  </div>
                );
              })}
            </div>
          );
        })}
        {isOver && (
          <button
            className="restart-button"
            onClick={() => {
              dispatch({ type: "RESTART" });
            }}
          >
            RESTART GAME
          </button>
        )}
      </div>
    </div>
  );
}

function reducer(state, action) {
  switch (action.type) {
    case "RESTART":
      return generateEmptyState();
    case "MAKE_MOVE":
      const colIndex = action.payload.colIndex;
      const rowIndex = action.payload.rowIndex;
      const { board, currentPlayer, isOver } = state;

      if (board[colIndex][rowIndex] !== null || isOver) return state;

      const boardCopy = [...board];
      boardCopy[colIndex][rowIndex] = currentPlayer;

      const didWinVertical = didWin(
        rowIndex,
        colIndex,
        1,
        0,
        boardCopy,
        currentPlayer
      );
      const didWinHorizontal = didWin(
        rowIndex,
        colIndex,
        0,
        1,
        boardCopy,
        currentPlayer
      );
      const didWinDiagonal =
        didWin(rowIndex, colIndex, 1, 1, boardCopy, currentPlayer) ||
        didWin(rowIndex, colIndex, -1, 1, boardCopy, currentPlayer);

      const winner =
        didWinVertical || didWinHorizontal || didWinDiagonal
          ? currentPlayer
          : null;
      const isGameBoardFull = boardCopy.every((column) =>
        column.every((entry) => entry !== null)
      );

      return {
        board: boardCopy,
        currentPlayer: currentPlayer === 1 ? 2 : 1,
        winner,
        isTiedGame: winner === null && isGameBoardFull,
        isOver: winner !== null || isGameBoardFull
      };
    default:
      throw new Error("Invalid Action Type");
  }
}

function generateEmptyState() {
  return {
    board: new Array(NUM_COLS)
      .fill(null)
      .map((_) => new Array(NUM_ROWS).fill(null)),
    currentPlayer: 1,
    winner: null,
    isTiedGame: false,
    isOver: false
  };
}

function didWin(
  startingRowIndex,
  startingColumnIndex,
  rowIncrement,
  colIncrement,
  board,
  currentPlayer
) {
  // Implementation of BFS
  let consecutiveSpots = 0;
  let currRow = startingRowIndex;
  let currCol = startingColumnIndex;

  while (
    currRow < NUM_ROWS &&
    currCol < NUM_COLS &&
    board[currCol][currRow] === currentPlayer
  ) {
    consecutiveSpots++;
    currRow += rowIncrement;
    currCol += colIncrement;
  }

  currRow = startingRowIndex - rowIncrement;
  currCol = startingColumnIndex - colIncrement;
  while (
    currRow >= 0 &&
    currCol >= 0 &&
    board[currCol][currRow] === currentPlayer
  ) {
    consecutiveSpots++;
    currRow -= rowIncrement;
    currCol -= colIncrement;
  }

  return consecutiveSpots === 3;
}

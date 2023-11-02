import { useState } from "react";
import "./App.css";

export default function Game() {
  const [history, setHistory] = useState<(string | null)[][]>([
    Array(9).fill(null),
  ]);
  const [currentMove, setCurrentMove] = useState<number>(0);
  const xIsNext: boolean = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  const winner = calculateWinner(currentSquares);
  let status: string;

  if (winner) {
    status = winner === "draw" ? "Draw" : "Winner : " + winner;
  } else {
    status = "Player : " + (xIsNext ? "X" : "O");
  }

  function handlePlay(nextSquares: (string | null)[]) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove: number) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((_squares, move, row) => {
    let desc: string;
    if (move > 0) {
      desc = "You are at move #" + move;
    } else {
      desc = "Game start";
    }
    return (
      <div key={move}>
        {move + 1 === row.length ? (
          <div className="history-current">{desc}</div>
        ) : (
          <button className="history-btn" onClick={() => jumpTo(move)}>
            {desc}
          </button>
        )}
      </div>
    );
  });

  function restartGame() {
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
  }

  return (
    <div className="game">
      <div className="game-board">
        <div className="status">{status}</div>
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
        {(history.length >= 10 || winner) && (
          <button className="restart" onClick={() => restartGame()}>
            Restart game
          </button>
        )}
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function Board(props: {
  xIsNext: boolean;
  squares: (string | null)[];
  onPlay: (squares: (string | null)[]) => void;
}) {
  const { squares, xIsNext, onPlay } = props;

  function handleClick(i: number) {
    if (squares[i] || calculateWinner(squares)) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  }

  return (
    <>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

function Square(props: { value: string | null; onSquareClick: () => void }) {
  return (
    <button className="square" onClick={props.onSquareClick}>
      {props.value ? props.value : ""}
    </button>
  );
}

function calculateWinner(squares: (string | null)[]) {
  const winningLines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < winningLines.length; i++) {
    const [a, b, c] = winningLines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  if (!squares.includes(null)) {
    return "draw";
  }
  return null;
}

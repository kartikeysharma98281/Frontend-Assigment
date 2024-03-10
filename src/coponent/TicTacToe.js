import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TicTacToe.css';

const TicTacToe = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState('X');
  const [winner, setWinner] = useState(null);
  const [winningSequence, setWinningSequence] = useState([]);
  const [isBotTurn, setIsBotTurn] = useState(false);

  const handleClick = async (index) => {
    if (board[index] !== null || winner !== null) return;

    setBoard(board.map((value, i) => (i === index ? currentPlayer : value)));
    setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');

    if (checkWinner(currentPlayer)) {
      setWinner(currentPlayer);
      setWinningSequence(findWinningSequence(currentPlayer));
    } else if (!isBotTurn) {
      setIsBotTurn(true);
    }
  };

  const checkWinner = (player) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    return lines.some((line) => line.every((index) => board[index] === player));
  };

  const findWinningSequence = (player) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    return lines.find((line) => line.every((index) => board[index] === player));
  };

  useEffect(() => {
    if (isBotTurn) {
      axios
        .post('https://hiring-react-assignment.vercel.app/api/bot', board)
        .then((response) => {
          const index = response.data;
          console.log("index: ", index);
          handleClick(index);
          setIsBotTurn(false);
        });
    }
  }, [isBotTurn, board, handleClick]);

  return (
    <div className="Game">
      <h1>{winner ? `Winner: ${winner}` : 'Tic Tac Toe'}</h1>
      <div className="board">
        {board.map((value, index) => (
          <div
            key={index}
            className={`box ${value ? 'filled' : ''} ${
              winningSequence.includes(index) ? 'winning' : ''
            }`}
            onClick={() => handleClick(index)}
            style={{ color: value === 'X' ? 'red' : 'green' }}
          >
            {value}
          </div>
        ))}
      </div>
      <div>
        <button className='reset' onClick={() => window.location.reload()}>Reset</button>
      </div>
    </div>
  );
};

export default TicTacToe;
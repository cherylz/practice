import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className="square" name={`btn-${props.squareNumber}`} value={props.squareNumber} onClick={props.onClick}>
      {props.contentOnDisplay}
    </button>
  )
}

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    this.props.onClick(e.target.value);
  }

  renderSquare(i) {
    return (
      <Square
        squareNumber={i}
        contentOnDisplay={this.props.squaresOnDisplay[i - 1]}
        onClick={this.handleClick}
      />
    )
  }
// think: why don't we need to bind 'this' in the above function?
// think: do we need a key for each button? got this question when using array.map to generate each row.

// think: why do we need 'this' when call renderSquare() below?
  render() {
    return (
      <div className="game-board">
        <div className="board-row">
          {this.renderSquare(1)}
          {this.renderSquare(2)}
          {this.renderSquare(3)}
        </div>
        <div className="board-row">
          {this.renderSquare(4)}
          {this.renderSquare(5)}
          {this.renderSquare(6)}
        </div>
        <div className="board-row">
          {this.renderSquare(7)}
          {this.renderSquare(8)}
          {this.renderSquare(9)}
        </div>
      </div>
    )
  }
}

function Status(props) {
  const statusText = props.nextOnDisplay ?
    `Next player: ${props.nextOnDisplay}` :
    `Winner: ${props.winnerOnDisplay}`;

  return(
    <p className="status-text">{statusText}</p>
  )
}

function Moves(props) {
  const history = props.history;
  const stepsList = history.map((step, index) => {
    if (!index) {
      return(
        <li key={index}>
          <button data-step={index} onClick={props.onClick}>Go to game start</button>
        </li>
      )
    }
    return(
      <li key={index}>
        <button data-step={index} onClick={props.onClick}>Go to move #{index}</button>
      </li>
    )
  })
    // think: assign the key to the list or to the button?

  return(
    <ol className="moves">
      {stepsList}
    </ol>
  )
}
// Think: do we need to have a child component for each move?

class Notice extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    this.props.onClick(e.target.dataset.step);
  }

  render() {
    return(
      <div className="notice-board">
        <Status
          nextOnDisplay={this.props.nextOnDisplay}
          winnerOnDisplay={this.props.winnerOnDisplay}
        />
        <Moves
          history={this.props.history}
          onClick={this.handleClick}
        />
      </div>
    )
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: Array(1).fill(Array(9).fill(null)),
      stepOnDisplay: 0
    };

    this.handleClick = this.handleClick.bind(this);
    this.jumpTo = this.jumpTo.bind(this);
  }

  handleClick(squareNumber) {
    const history = this.state.history;
    let stepOnDisplay = this.state.stepOnDisplay;

    const contentOnDisplay = history[stepOnDisplay][squareNumber - 1];
    const winnerOnDisplay = calculateWinner(history[stepOnDisplay]);

    if (contentOnDisplay || winnerOnDisplay) {
      return;
    }

    stepOnDisplay++;
    const current = history[stepOnDisplay - 1].slice();
    current[squareNumber - 1] = stepOnDisplay % 2 ? "X" : "O";
    const rewrite = history.filter((step, index) => index < stepOnDisplay); // in case the user jumps to a previous step and plays from there
    rewrite.push(current);

    this.setState({
      history: rewrite, // mistake-list: history: rewrite.push(current). didn't realize array.push would return the new length of the array
      stepOnDisplay: stepOnDisplay
    });
  }

  jumpTo(step) {
    this.setState({
      stepOnDisplay: step
    });
  }

  render() {
    const history = this.state.history;
    const stepOnDisplay = this.state.stepOnDisplay;
    const squaresOnDisplay = history[stepOnDisplay];
    const winnerOnDisplay = calculateWinner(squaresOnDisplay);
    const nextOnDisplay = winnerOnDisplay ? null : stepOnDisplay % 2 ? "O" : "X";

    return(
      <div className="container">
        <Board
          squaresOnDisplay={squaresOnDisplay}
          onClick={this.handleClick}
        />
        <Notice
          nextOnDisplay={nextOnDisplay}
          winnerOnDisplay={winnerOnDisplay}
          history={history}
          onClick={this.jumpTo}
        />
      </div>
    )
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares) {
  const patterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < patterns.length; i++) {
    const [a, b, c] = patterns[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null; // go to mistake-list: I had wrongly put this in the for loop.
}

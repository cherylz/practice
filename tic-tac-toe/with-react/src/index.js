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
  /* if we start to handle the click event in this component, we can do as follows. note that for both approaches, remember to update the handleClick function in the Game component.

  handleClick = (e) => {
    this.props.onClick(e.target.value);
  }

  // or:

  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    this.props.onClick(e.target.value); // this `this` is the `this` we need to bind with the context `Board` to mean `Board`. The `this` inside `bind(this)` above means `Board`.
  }
  */

  renderSquare(i) {
    return (
      <Square
        squareNumber={i}
        contentOnDisplay={this.props.squaresOnDisplay[i - 1]}
        onClick={this.props.onClick}
      />
    )
  }

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

  return(
    <ol className="moves">
      {stepsList}
    </ol>
  )
}

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

  handleClick(e) {
    const squareNumber = e.target.value;
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
    const rewrite = history.slice(0, stepOnDisplay); // an easy-to-omit case: the user jumps to a previous step and makes a new move from there. this ensures that if it happens, we throw away all the “future” history that would now become incorrect.
    rewrite.push(current);

    this.setState({
      history: rewrite,
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
  return null;
}

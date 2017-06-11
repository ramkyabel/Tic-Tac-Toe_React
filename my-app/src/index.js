import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


function Square (props) {

	return (
		<button className="square" onClick={props.onClick}>
		{props.value}
		</button>
		);

}

class Board extends React.Component {

	renderSquare (i) {
		return (
			<Square key={"square " + i}
			value={this.props.squares[i]}
			onClick={() => this.props.onClick (i)}
			/>
			);
	}

	render () {

		const board = [];

		for (var i = 0, z = 0; i < 3; i++)
		{
			const row = [];
			for (var j = 0; j < 3; j++, z++)
			{
				row.push (this.renderSquare(z));
			}
			board.push (<div key={"row " + i} className = "board-row">{row}</div>);
		}

		return (
			<div> 
			{board.map (line => line)}
			</div>
			);
	}
}

class Game extends React.Component 
{
	constructor () {
		super ();				
		this.state = {
			history: [{
				squares: Array(9).fill (null),
				clickedLocation: [0,0],
			}],
			sort: true,
			haveWinner: false,
			stepNumber: 0,
			xIsNext: 'X',
		};
	}

	handleClick (i) {
		const history = this.state.history;
		var indexCurrent = this.state.sort ? history.length - 1 : 0;
		const current = history[indexCurrent];
		const squares = current.squares.slice ();
		const winner = this.state.haveWinner;

		if (winner || squares[i])
		{
			console.log ('we have a winner or button already filled')
			return;
		}

		squares[i] = this.state.xIsNext ? 'X' : '0';

		if(this.state.sort)
		{

			this.setState ({
				history: history.concat ([{
					squares: squares,
					clickedLocation: [Math.floor (i/3) + 1, i % 3 + 1],
				}]),
				stepNumber: history.length,
				xIsNext: !this.state.xIsNext,
			});	
		}
		else
		{
			history.unshift ({
				squares: squares,
				clickedLocation: [Math.floor (i/3) + 1, i % 3 + 1],
			});

			this.setState ({
				history: history,
				stepNumber: 0,
				xIsNext: !this.state.xIsNext,
			});	
		}

		const theWinner = declareWinner (squares);
		if (theWinner)
		{
			this.setState ({haveWinner: theWinner});
		}
	}

	jumpTo (step) {
		this.setState ({
			stepNumber: step,
			xIsNext: (step % 2) ? false : true,
		});
	}


	sort ()
	{
		this.setState (
		{
			sort: !this.state.sort,
			history: this.state.history.reverse (),
		});
	}

	render ()
	{
		const history = this.state.history;
		const current = history[this.state.stepNumber]; 
		const winner = this.state.haveWinner;
		const Sort = this.state.sort ? "Ascending" : "Descending";
		const moves = history.map ((step,move) => {
			console.log ("This move is " + move);
			let moveUpd = move;
			if (this.state.sort === false)
			{
				moveUpd = (this.state.history.length - 1) - moveUpd;
			}
			console.log ("This moveUpd is " +  moveUpd);
			if (move === history.length - 1)
			{
				console.log ("END");
			}

			const desc = moveUpd ?
			'Move #' + moveUpd :
			'Game start';

			return (
				<li key={moveUpd} style = {(move === this.state.stepNumber) ?
					{fontWeight: 'bold'} : {fontWeight: 'normal'}} >
					<a onClick={() => this.jumpTo(move)}>{desc}</a>
					</li>
					);

		});

		let status;
		if (winner) {
			status = 'Winner: ' + winner;
		}
		else {
			status = 'Next Player: ' + (this.state.xIsNext ? 'X' : '0');
		}

		return (
			<div className="game">
			<div className="game-board">
			<Board 
			squares={current.squares}
			onClick={(i) => this.handleClick (i)} 
			/>
			</div>
			<div className="game-info">
			<div> {status} </div>
			<ol> {moves} </ol>
			<button className="buttonClass" onClick={() => this.sort()}> {Sort}</button>

			</div>
			</div>
			);
	}
}

ReactDOM.render (
	<Game />, 
	document.getElementById('root')
	);

function declareWinner (squares)
{
	const lines = [
	[0,1,2],
	[3,4,5],
	[6,7,8],
	[0,3,6],
	[1,4,7],
	[2,5,8],
	[0,4,8],
	[2,4,6]
	];

	for (var i = 0; i < lines.length; i++)
	{
		const [a,b,c] = lines[i];
		if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c])
		{
			return squares[a];
		}
	}
	return null;
}	
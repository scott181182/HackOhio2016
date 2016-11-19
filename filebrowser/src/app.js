import React, {Component} from 'react';
import ReactDOM from 'react-dom';

class Main extends Component {
    constructor(props){
		super();

		this.state = {
			testing: true
		};
	}

	render() {
		return (
			<div>
				<h1>This is just a test?</h1>
				<h2>{this.state.testing ? "Yes!" : "No :("}</h2>
			</div>
		);
	}
}

var main = document.getElementById('main');
ReactDOM.render(<Main />, main);
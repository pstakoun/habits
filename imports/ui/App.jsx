import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';
import { Habits } from '../api/habits.js';
import Habit from './Habit.jsx';
 
class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			hideCompleted: false,
		};
	}

	handleSubmit(event) {
		event.preventDefault();

		const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();

		Habits.insert({
			text,
			createdAt: new Date(),
		});

		ReactDOM.findDOMNode(this.refs.textInput).value = '';
	}

	toggleHideCompleted() {
		this.setState({
			hideCompleted: !this.state.hideCompleted,
		});
	}

 	renderHabits() {
		let filteredHabits = this.props.habits;
		if (this.state.hideCompleted) {
			filteredHabits = filteredHabits.filter(habit => !habit.completed);
		}
		return filteredHabits.map((habit) => (
			<Habit key={habit._id} habit={habit} />
		));
	}
 
 	render() {
		return (
			<div className="container">
				<header>
					<h1>Habits</h1>

					<label className="hide-completed">
						<input type="checkbox" readOnly
							completed={this.state.hideCompleted}
							onClick={this.toggleHideCompleted.bind(this)}
						/>
						Hide Completed
					</label>

					<form className="new-habit" onSubmit={this.handleSubmit.bind(this)}>
						<input type="text" ref="textInput" placeholder="Add new habit" />
					</form>
				</header>
 				<ul>
					{this.renderHabits()}
				</ul>
			</div>
		);
	}
}

App.propTypes = {
	habits: PropTypes.array.isRequired,
};

export default createContainer(() => {
	return {
		habits: Habits.find({}).fetch(),
	};
}, App);

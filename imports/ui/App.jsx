import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Habits } from '../api/habits.js';
import Habit from './Habit.jsx';
 
class App extends Component {
 	renderHabits() {
		return this.props.habits.map((habit) => (
			<Habit key={habit._id} habit={habit} />
		));
	}
 
 	render() {
		return (
			<div className="container">
				<header>
					<h1>Habits</h1>
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

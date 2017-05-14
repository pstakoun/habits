import React, { Component } from 'react';
 
import Habit from './Habit.jsx';
 
// App component - represents the whole app
export default class App extends Component {
	getHabits() {
		return [
			{ _id: 1, text: 'This is habit 1' },
			{ _id: 2, text: 'This is habit 2' },
			{ _id: 3, text: 'This is habit 3' },
		];
	}
 
 	renderHabits() {
		return this.getHabits().map((habit) => (
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

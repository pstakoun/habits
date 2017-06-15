import React, { Component, PropTypes } from 'react';
import { Habits } from '../api/habits.js';

export default class Habit extends Component {
	toggleCompleted() {
		Habits.update(this.props.habit._id, {
			$set: { completed: !this.props.habit.completed },
		});
	}

	deleteHabit() {
		Habits.remove(this.props.habit._id);
	}

	render() {
		const habitClassName = this.props.habit.completed ? 'completed' : '';

		return (
			<li className={habitClassName}>
				<button className="delete" onClick={this.deleteHabit.bind(this)}>
					&times;
				</button>

				<input type="checkbox" readOnly
					checked={this.props.habit.completed}
					onClick={this.toggleCompleted.bind(this)}
				/>

				<span className="text">{this.props.habit.text}</span>
			</li>
		);
	}
}
 
Habit.propTypes = {
	habit: PropTypes.object.isRequired,
};

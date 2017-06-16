import React, { Component, PropTypes } from 'react';
import { Habits } from '../api/habits.js';
import { GetDate } from '../helpers/habits.js';

export default class Habit extends Component {
	toggleCompleted() {
		if (this.props.habit.datesCompleted.includes(GetDate())) {
			Habits.update(this.props.habit._id, {
				$pull: { datesCompleted: GetDate() },
			});
		} else {
			Habits.update(this.props.habit._id, {
				$push: { datesCompleted: GetDate() },
			});
		}
	}

	deleteHabit() {
		Habits.remove(this.props.habit._id);
	}

	render() {
		const completed = this.props.habit.datesCompleted.includes(GetDate());
		const habitClassName = completed ? 'completed' : '';

		return (
			<li className={habitClassName}>
				<button className="delete" onClick={this.deleteHabit.bind(this)}>
					&times;
				</button>

				<input type="checkbox" readOnly
					checked={completed}
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

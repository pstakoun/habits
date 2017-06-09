import React, { Component, PropTypes } from 'react';
import { Habits } from '../api/habits.js';

export default class Habit extends Component {
	toggleChecked() {
		Habits.update(this.props.habit._id, {
			$set: { checked: !this.props.habit.checked },
		});
	}

	deleteHabit() {
		Habits.remove(this.props.habit._id);
	}

	render() {
		const habitClassName = this.props.habit.checked ? 'checked' : '';

		return (
			<li className={habitClassName}>
				<button className="delete" onClick={this.deleteHabit.bind(this)}>
					&times;
				</button>

				<input type="checkbox" readOnly
					checked={this.props.habit.checked}
					onClick={this.toggleChecked.bind(this)}
				/>

				<span className="text">{this.props.habit.text}</span>
			</li>
		);
	}
}
 
Habit.propTypes = {
	habit: PropTypes.object.isRequired,
};

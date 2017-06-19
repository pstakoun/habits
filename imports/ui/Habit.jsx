import React, { Component, PropTypes } from 'react';
import { Habits } from '../api/habits.js';
import { GetDate } from '../helpers/habits.js';

var LineChart = require("react-chartjs").Line;

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
			<div className="row">
				<li id={this.props.habit._id} className={habitClassName}>
					<div className="col-sm-6">
						<button className="delete" onClick={this.deleteHabit.bind(this)}>
							&times;
						</button>

						<input type="checkbox" readOnly
							checked={completed}
							onClick={this.toggleCompleted.bind(this)}
						/>

						<span className="text">{this.props.habit.text}</span>
					</div>
					<div className="col-sm-6">
						<LineChart data={null} options={null} />
					</div>
				</li>
			</div>
		);
	}
}
 
Habit.propTypes = {
	habit: PropTypes.object.isRequired,
};

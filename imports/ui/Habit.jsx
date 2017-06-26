import React, { Component, PropTypes } from 'react';
import { Habits } from '../api/habits.js';
import { GetDate } from '../helpers/habits.js';
import { HandleGoogleAuth, GoogleSignedIn } from '../helpers/google.js';

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
		if (confirm('Are you sure you want to delete this habit?')) {
			Habits.remove(this.props.habit._id);
		}
	}

	setHabitReminder() {
		if (!GoogleSignedIn) {
			HandleGoogleAuth();
		}
	}

	render() {
		const completed = this.props.habit.datesCompleted.includes(GetDate());
		const habitClassName = completed ? 'completed' : '';
		var chartData = {
			labels: [],
			datasets: [{
				data: []
			}]
		};

		// UTC SCREWS THIS UP!!! Works after 8 PM... TODO
		for (var i = Math.floor((new Date() - this.props.habit.createdAt) / (1000* 60 * 60 * 24)); i > -1; i--) {
			chartData.labels.push('');
			var count = 0;
			for (var j = 0; j < this.props.habit.datesCompleted.length; j++) {
				console.log();
				if (Math.floor((new Date() - new Date(this.props.habit.datesCompleted[j].substring(0, 4)+'-'+this.props.habit.datesCompleted[j].substring(4, 6)+'-'+this.props.habit.datesCompleted[j].substring(6,8))) / (1000* 60 * 60 * 24)) > i) {
					count++;
				}
			}
			chartData.datasets[0].data.push(count);
		}

		return (
			<div className="row">
				<li id={this.props.habit._id} className={habitClassName}>
					<div className="col-sm-6">
						<button onClick={this.deleteHabit.bind(this)}>
							<i className="fa fa-trash-o" aria-hidden="true"></i>
						</button>

						<button onClick={this.setHabitReminder.bind(this)}>
							<i className="fa fa-bell-o" aria-hidden="true"></i>
						</button>

						<input type="checkbox" readOnly
							checked={completed}
							onClick={this.toggleCompleted.bind(this)}
						/>

						<span className="text">{this.props.habit.text}</span>
					</div>
					<div className="col-sm-6">
						<LineChart data={chartData} height="100" width="555" />
					</div>
				</li>
			</div>
		);
	}
}
 
Habit.propTypes = {
	habit: PropTypes.object.isRequired,
};

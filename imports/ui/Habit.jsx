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
		var chartData = {
			labels: [],
			datasets: [{
				data: []
			}]
		};

		for (var i = 7; i > 0; i--) {
			chartData.labels.push('');
			var count = 0;
			for (var j = 0; j < this.props.habit.datesCompleted.length; j++) {
				console.log();
				if (Math.floor(new Date() - new Date(this.props.habit.datesCompleted[j].substring(0, 4)+'-'+this.props.habit.datesCompleted[j].substring(4, 6)+'-'+this.props.habit.datesCompleted[j].substring(6,8))) / (1000* 60 * 60 * 24) > i) {
					count++;
				}
			}
			chartData.datasets[0].data.push(count);
		}

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

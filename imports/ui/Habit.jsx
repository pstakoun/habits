import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Habits } from '../api/habits.js';
import { GetDate } from '../helpers/habits.js';
import { HandleGoogleAuth, GoogleSignedIn } from '../helpers/google.js';

var LineChart = require("react-chartjs").Line;

export default class Habit extends Component {
	constructor(props) {
		super(props);

		this.state = {
			showTime: false,
		};
	}

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

	toggleShowTime() {
		this.setState({
			showTime: !this.state.showTime
		});
	}

	setHabitReminder(event) {
		event.preventDefault();

		if (GoogleSignedIn()) {
			var text = this.props.habit.text;
			var time = ReactDOM.findDOMNode(this.refs.timeInput).value.trim().split(':');
			var start = new Date();
			start.setHours(parseInt(time[0]), parseInt(time[1]), 0);
			var end = new Date(start.getTime() + 30*60000);
			window.gapi.client.load('calendar', 'v3', function() {
				var event = {
					'summary': text,
					'start': {
						'dateTime': start.toISOString(),
						'timeZone': 'America/Toronto'
					},
					'end': {
						'dateTime': end.toISOString(),
						'timeZone': 'America/Toronto'
					},
					'recurrence': [
						'RRULE:FREQ=DAILY'
					]
				};

				console.log(JSON.stringify(event));

				var request = window.gapi.client.calendar.events.insert({
					'calendarId': 'primary',
					'resource': event
				});

				request.execute(function(event) {
					alert(event.htmlLink);
				});
			});
		} else {
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

		var chartOptions = {
			scales: {
				yAxis: [{
					ticks: {
						beginAtZero: true
					}
				}]
			}
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

						<form className="set-time" onSubmit={this.setHabitReminder.bind(this)}>
							<input type={this.state.showTime ? "time" : "hidden"} ref="timeInput" />
							<input type="submit" className="hidden" />
						</form>

						<button onClick={this.toggleShowTime.bind(this)}>
							<i className="fa fa-bell-o" aria-hidden="true"></i>
						</button>

						<input type="checkbox" readOnly
							checked={completed}
							onClick={this.toggleCompleted.bind(this)}
						/>

						<span className="text">{this.props.habit.text}</span>
					</div>
					<div className="col-sm-6">
						<LineChart data={chartData} options={chartOptions} height="100" width="555" />
					</div>
				</li>
			</div>
		);
	}
}
 
Habit.propTypes = {
	habit: PropTypes.object.isRequired,
};

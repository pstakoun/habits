import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';
import { Habits } from '../api/habits.js';
import Habit from './Habit.jsx';
import { GetDate } from '../helpers/habits.js';

class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			hideCompleted: false,
		};
	}

	componentDidMount() {
		this.loadGoogleAPI();
	}

	loadGoogleAPI() {
		const script = document.createElement("script");
		script.src = "https://apis.google.com/js/api.js";
		document.body.appendChild(script);

		script.onload = () => {
			window.gapi.load('client:auth2', this.initClient.bind(this));
		}
	}

	initClient() {
		window.gapi.client.init({
			discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
			clientId: '649545190512-qi80ml37nptf8pvf8kne34gbhqpn0u7b.apps.googleusercontent.com',
			scope: 'https://www.googleapis.com/auth/calendar'
		}).then(this.postInitClient.bind(this));
	}

	postInitClient() {
		gapi.auth2.getAuthInstance().isSignedIn.listen(this.updateSigninStatus.bind(this));
		this.updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
		this.refs.authorizeButton.onclick = this.handleAuthClick.bind(this);
		this.refs.signoutButton.onclick = this.handleSignoutClick.bind(this);
	}

	updateSigninStatus(isSignedIn) {
		if (isSignedIn) {
			this.refs.authorizeButton.style.display = 'none';
			this.refs.signoutButton.style.display = 'block';
		} else {
			this.refs.authorizeButton.style.display = 'block';
			this.refs.signoutButton.style.display = 'none';
		}
	}

	handleAuthClick(event) {
		window.gapi.auth2.getAuthInstance().signIn();
	}

	handleSignoutClick(event) {
		window.gapi.auth2.getAuthInstance().signOut();
	}

	handleSubmit(event) {
		event.preventDefault();

		const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();

		Habits.insert({
			text,
			createdAt: new Date(),
			datesCompleted: [],
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
			filteredHabits = filteredHabits.filter(habit => !habit.datesCompleted.includes(GetDate()));
		}
		return filteredHabits.map((habit) => (
			<Habit key={habit._id} habit={habit} />
		));
	}
 
	render() {
		return (
			<div className="container">
				<header>
					<h1>Habit Tracker</h1>

					<label className="hide-completed">
						<input type="checkbox" readOnly
							checked={this.state.hideCompleted}
							onClick={this.toggleHideCompleted.bind(this)}
						/>
						Hide Completed
					</label>

					<button ref="authorizeButton" style={{display: 'none', color: 'black'}}>Authorize</button>
					<button ref="signoutButton" style={{display: 'none', color: 'black'}}>Sign Out</button>

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

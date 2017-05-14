import React, { Component, PropTypes } from 'react';
 
export default class Habit extends Component {
  render() {
    return (
      <li>{this.props.habit.text}</li>
    );
  }
}
 
Habit.propTypes = {
	// This component gets the task to display through a React prop.
	// We can use propTypes to indicate it is required
	habit: PropTypes.object.isRequired,
};

import React from 'react'
import { Meteor } from 'meteor/meteor';
import ReactDOM from 'react-dom'

// Import global CSS stylesheet
import '/imports/ui/stylesheets/styles.css';
import Routes from '/imports/startup/client/Routes.jsx'
import AppState from './AppState'

let state = new AppState();
ReactDOM.render(<Routes state={state}/>, document.getElementById("app"));
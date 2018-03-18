import React from 'react';
import {withRouter, BrowserRouter, Switch, Redirect, Route} from 'react-router-dom';
import {observer} from 'mobx-react';

// route components
import App from '../../ui/components/App.jsx';
import Login from '../../ui/components/Login.jsx';
import NotFound from '../../ui/components/NotFound.jsx';

// Route to home page - will render login page or redirect to dashboard overview if logged in


const Routes = observer(class Routes extends React.Component {
	render() {
		const state = this.props.state;
		console.log("Current login status is: " + state.isLoggedIn);
		return (
			<BrowserRouter>
                <Switch>
                    <Route exact
                           path="/"
                           render={
                                () => {
                                    if (state.isLoggedIn) {
                                        return (<App state={state} route={"Home"}/>)
                                    }
                                    else {
                                        return <Redirect to="/login"/>
                                    }
                                }
                           }
                    />
                    <Route exact
                           path="/login"
                           render={
                                () => {
                                    if (state.isLoggedIn) {
                                        return (<Redirect to="/"/>)
                                    }
                                    else {
                                        return (<Login state={state}/>)
                                    }
                                }
                           }
                    />
                    <Route component={NotFound} />
                </Switch>
            </BrowserRouter>
        )
	}
});

export default Routes;
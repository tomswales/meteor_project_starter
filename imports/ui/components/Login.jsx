import React from 'react';
import {observer} from 'mobx-react';

const Login = observer(class Login extends React.Component {
    render() {
        return (
            <div>
                <h1>Login</h1>
                <p>You are currently logged out. Please enter your login details below</p>
                <form className="pure-form pure-form-stacked">
                    <fieldset>
                        <label htmlFor="email">Username or Email</label>
                        <input
                            id="email"
                            type="text"
                            placeholder="Username or Email"
                            value={this.props.state.enteringEmail || ""}
                            onChange={this.handleEmailChange.bind(this)}
                        />

                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            placeholder="Password"
                            value={this.props.state.enteringPassword || ""}
                            onChange={this.handlePasswordChange.bind(this)}
                        />

                        <button onClick={this.handleSubmit.bind(this)} className="pure-button">Sign in</button>
                    </fieldset>
                </form>
            </div>
        );
    }

    handleSubmit(event) {
        event.preventDefault();
        event.stopPropagation();
        this.props.state.submitLoginDetails();
    }

    handleEmailChange (event) {
        this.props.state.setEnteringEmail(event.target.value);
    }

    handlePasswordChange (event) {
        this.props.state.setEnteringPassword(event.target.value);
    }
});

export default Login;

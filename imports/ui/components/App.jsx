import React from 'react';
import {observer} from 'mobx-react';
import {toJS} from 'mobx';
import Example from './Example/Example.jsx';

const App = observer(class App extends React.Component {
    render() {
        let examples = this.props.state.getExamples;
        let dependents = this.props.state.getDependents;

        let renderExamples;
        renderExamples = examples.map((item) => {
            let itemDependents = dependents.filter((dependent) => {
                return dependent.exampleId == item._id;
            });
            return <Example key={item._id} state={this.props.state} item={item} dependents={itemDependents}/>
        });

        let data = this.props.state.examplesLoading 
        ? 
        (<div>
            Loading data...
        </div>)
        : 
        (<div>
            {renderExamples}
            <button onClick={this.handleAddClick.bind(this)}>Add example</button>
        </div>);

        return (
            <div>
                <h2>{this.props.route}</h2>
                App rendered successfully 
                <div>
                    <button onClick={this.handleLogoutClick.bind(this)}>Log out</button>
                </div>
                <h2>Data:</h2>
                {data}
            </div>
        );

    }

    handleLogoutClick(event) {
        event.preventDefault();
        this.props.state.logout();
    }

    handleAddClick(event) {
        event.preventDefault();
        this.props.state.addExample();
    }
});

export default App;
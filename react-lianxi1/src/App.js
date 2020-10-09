import React, { Component } from 'react';
import TodoList from './views/todoList/index';

class App extends Component {
    render() {
        return (
            <div className="Page">
                <TodoList/>
            </div>
        );
    }
}

export default App;
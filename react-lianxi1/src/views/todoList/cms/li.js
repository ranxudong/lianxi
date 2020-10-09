import React, {Component} from 'react';

class TodoLi extends Component {

    handleDelete() {
        this.props.delete();
    }

    render () {
        return (
            <li onClick={()=>{this.handleDelete()}}>{this.props.content}</li>
        )
    }
}

export default TodoLi;
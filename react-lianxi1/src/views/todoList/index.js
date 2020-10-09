import React, {Component,Fragment} from 'react';
import TodoLi from './cms/li';
import './cms/li.css';

class TodoList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            list: [
                'learn react',
                'learn react native',
                'learn react vue',
            ],
            value: '',
        }
    }
    
    //输入框change事件
    handleInputChnage(e) {
        this.setState({
            value: e.target.value
        });
    }
    
    //添加
    handleBtnClick() {
        this.setState({
            list: [...this.state.list, this.state.value],
            value: ''
        });
    }

    //删除li
    handleRemoveli(item) {
        let list = [...this.state.list];
        list.splice(item, 1);
        this.setState({
            list
        });
    }


    renderList () {
        return (
            this.state.list.map((ele,index)=>{
                return <TodoLi delete={()=>{this.handleRemoveli(index)}}  content={ele} index={index} key={index} />
            })
        );
    }
    
    render () {
        return (
            <Fragment>
                <div>
                    <input value={this.state.value} onChange={(e)=>{this.handleInputChnage(e)}} />
                    <button onClick={()=>{this.handleBtnClick()}} className="btn" style={{background: 'red',}}>添加</button>      
                </div>
                <ul>{this.renderList()}</ul>  
            </Fragment>
        )
    }
}

export default TodoList;
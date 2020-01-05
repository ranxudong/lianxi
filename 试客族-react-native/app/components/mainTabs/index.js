import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    Alert,
    TouchableOpacity,
} from 'react-native';
import {Actions} from 'react-native-router-flux';

import IconStr from '../../common/js/iconFont.js';
import UIcss from '../../common/css/ui.js';

let mainTabs = [
    {
        name: 'Home',
        txt: '首页',
        icon: 'home',
    },
    {
        name: 'Apply',
        txt: '申请',
        icon: 'apply',
    },
    {
        name: 'Orders',
        txt: '订单',
        icon: 'orders',
    },
    {
        name: 'My',
        txt: '我的',
        icon: 'my',
    },
];

class Dome extends Component {
    constructor(props) {
        super(props);

        this.routeName = Actions.state.routes[Actions.state.index].routeName;
    }

    toLink = (str)=>{
        console.log(str);
        if (this.routeName != str) {
            Actions[str]();
        };
    }

    renderHtml = () => {
        let arrDom = [];
        mainTabs.forEach((ele,item)=>{
            if (this.routeName == 'Home' && ele.name == this.routeName) {
                arrDom.push(<TouchableOpacity key={'footTab'+item} style={[UIcss.flexCenter,Incss.tabShop]} onPress={()=>{this.toLink('Shop')}}><Image source={require('./img/shopChat.png')} /></TouchableOpacity>);
            } else {
                arrDom.push(<TouchableOpacity key={'footTab'+item} style={[UIcss.flex1, UIcss.flexCenter]} onPress={()=>{this.toLink(ele.name)}}><Text style={[UIcss.iconFont, ele.name == this.routeName ? Incss.activeTxt : {}]}>{ele.name == this.routeName ? IconStr[ele.icon+'Active'] : IconStr[ele.icon]}</Text><Text style={[ele.name == this.routeName ? Incss.activeTxt : {}]}>{ele.txt}</Text></TouchableOpacity>);
            }
        });
        return arrDom;
    }

    render(){
        return (
            <View style={[Incss.foot, UIcss.flexRow, UIcss.bgColor_fff]}>
                {this.renderHtml()}
            </View>
        );
    }
}

const Incss = StyleSheet.create({
    foot: {
        height: 50,
    },
    tabShop: {
        width: 100,
    },
    activeTxt: {
        color: '#ff695d',
    },
});

export default Dome;
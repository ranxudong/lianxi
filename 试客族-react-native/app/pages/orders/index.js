import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
} from 'react-native';
import {Actions} from 'react-native-router-flux';

import MainTab from '../../components/mainTabs';

import UIcss from '../../common/css/ui.js';

export default class Dome extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <View style={[UIcss.flex1,Incss.container]}>
                <View style={[UIcss.flex1]}>
                    <Text>我是订单页面</Text>
                    <Text>{JSON.stringify(Actions.state)}</Text>
                </View>
                <MainTab />
            </View>
        );
    }
}

const Incss = StyleSheet.create({
    container: {
        backgroundColor: 'blue',
    },
});
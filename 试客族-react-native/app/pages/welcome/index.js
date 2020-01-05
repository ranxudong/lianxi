import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    Alert,
} from 'react-native';
import {Actions} from 'react-native-router-flux';

export default class Dome extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        let _t = setTimeout(()=>{
            Actions.Home({id:'1'});
        }, 1000);
    }

    render() {
        return (
            <View style={styles.container}>
                <Text>我是欢迎页面</Text>
                <Text>{JSON.stringify(Actions.state)}</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'green',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
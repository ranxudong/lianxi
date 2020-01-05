import React, {Component} from 'react';
import {
    StatusBar,
    StyleSheet,
    Text,
    Image,
    View,
    Alert,
    TouchableOpacity
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import LinearGradient from 'react-native-linear-gradient';

import IconStr from '../../common/js/iconFont.js';
import MainTab from '../../components/mainTabs';
import UIcss from '../../common/css/ui.js';

export default class Dome extends Component {
    constructor(props) {
        super(props);
        this.state = {
            news: 15,
        };
    }

    componentDidMount() {
        console.log(Actions.state);
    }

    render() {
        return (
            <View style={[UIcss.flex1,UIcss.bgColor_f3f0f5]}>
                <StatusBar translucent={true} backgroundColor="rgba(0,0,0,0)" barStyle="light-content" />
                <View style={[UIcss.flex1]}>
                    <LinearGradient style={[UIcss.flexRow,Incss.head]} colors={['#ff7360','#ff4d55']} start={{x:0,y:0}} end={{x:1,y:1}}>
                        <TouchableOpacity style={[UIcss.flexCenter,Incss.head_l]}><Text style={[UIcss.iconFont,Incss.head_icon]}>{IconStr.scan}</Text><Text style={[Incss.head_txt]}>扫一扫</Text></TouchableOpacity>
                        <TouchableOpacity style={[UIcss.flexRow,Incss.head_search]}><Text style={[UIcss.iconFont,Incss.head_search_t,{marginRight: 7,}]}>{IconStr.search}</Text><Text style={[Incss.head_search_t]}>搜索内容</Text></TouchableOpacity>
                        <View style={[Incss.head_r]}>
                            <TouchableOpacity style={[UIcss.flexCenter,UIcss.flex1]}>
                                <Text style={[UIcss.iconFont,Incss.head_icon]}>{IconStr.news}</Text>
                                <Text style={[Incss.head_txt]}>消息</Text>
                            </TouchableOpacity>
                            {
                                this.state.news > 0
                                ? <View style={[Incss.head_r_n]}><Text style={[Incss.head_r_n_t]}>{this.state.news}</Text></View>
                                : null
                            }
                        </View>
                    </LinearGradient>
                </View>
                <MainTab />
            </View>
        );
    }
}

const Incss = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'yellow',
    },
    head: {
        height: 64,
        paddingTop: 22,
        alignItems: 'center',
    },
    head_search: {
        flex: 1,
        height: 32,
        backgroundColor: 'rgba(255,255,255,0.3)',
        borderRadius: 32,
        paddingLeft: 12,
        alignItems: 'center',
    },
    head_search_t: {
        fontSize: 14,
        color: '#fff',
    },
    head_txt: {
        fontSize: 10,
        color: '#fff',
    },
    head_icon: {
        color: '#fff',
        fontSize: 18,
    },
    head_l: {
        width: 57,
    },
    head_r: {
        width: 47,
        position: 'relative',
    },
    head_r_n: {
        position: 'absolute',
        top: -7,
        right: 5,
        height: 15,
        justifyContent: 'center',
        backgroundColor: '#fff',
        paddingLeft: 5,
        paddingRight: 5,
        minWidth: 10,
        borderRadius: 15, 
    },
    head_r_n_t: {
        color: '#ff4d55',
        fontSize: 10,
    }
});
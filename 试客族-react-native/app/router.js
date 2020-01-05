import React, {Component} from 'react';
import {StyleSheet,Text,View,StatusBar,Alert} from 'react-native';

import {
    Scene,
    Router,
    Actions,
    Reducer,
    ActionConst,
    Overlay,
    Tabs,
    Modal,
    Drawer,
    Stack,
    Lightbox,
} from 'react-native-router-flux';

import Welcome from './pages/welcome';
import Home from './pages/home';
import Apply from './pages/apply';
import Orders from './pages/orders';
import My from './pages/my';

const onBackPress = () => {
    if (Actions.state.routes[Actions.state.index].routeName != 'Home') {
        Actions.pop();
    }
    return true
}

class Dome extends Component {
    constructor(props) {
        super(props);
    }

    backNo = () =>{
    }

    render () {
        return (
            <Router backAndroidHandler={onBackPress}>
                <Modal>
                    <Scene key="Welcome" hideNavBar component={Welcome} />
                    <Scene key="Home" initial={true} hideNavBar component={Home} />
                    <Scene key="Apply" init={true} component={Apply} />
                    <Scene key="Orders" component={Orders} />
                    <Scene key="My" component={My} />
                </Modal>
            </Router>
        );
    }
}

export default Dome; 
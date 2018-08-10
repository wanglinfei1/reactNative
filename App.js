/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {Platform, Text, View,AsyncStorage} from 'react-native';
import Storage from 'react-native-storage';
import {Provider} from 'react-redux'
import store from './component/redux/store/index'
import AppTab from './component/appTab'
import SplashScreen from 'rn-splash-screen';
var storage = new Storage({
    size: 1000,
    storageBackend: AsyncStorage,
    autoSync:false,
    defaultExpires: 1000 * 3600 * 24 * 7,
    enableCache: true,
})
global.storage = storage;

const instructions = Platform.select({
    ios: 'ios',
    android: 'android',
});

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    componentDidMount() {
        setTimeout(() => {
            SplashScreen.hide();
        }, 1000);
    }
    render() {
        return (
            <Provider store={store}>
                <AppTab/>
            </Provider>
        );
    }
}
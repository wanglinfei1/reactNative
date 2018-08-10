/**
 * Created by wanglinfei on 2017/10/18.
 */
import React, {Component} from 'react';
import {View, Text,TouchableOpacity} from 'react-native'
import {styles} from '../css/styles'
import {StackNavigator} from 'react-navigation';
import USBoxList from './USBoxList'
import MovieDetail from './movieDetail'
import WebViewComponent from './webView'
import Icon from 'react-native-vector-icons/MaterialIcons';
import IconF from 'react-native-vector-icons/FontAwesome';
import VideoPlayer from '../home/videoPlay'
const mYIcon=(<Icon name="navigate-before" size={35} style={{color:'#6435c9'}}></Icon>)
const userIcon=(<IconF name="user" size={25} style={{color:'#6435c9'}}></IconF>)
export const SimpleUS = StackNavigator({
    movieTalk: {screen: USBoxList},
    movieDetail: {screen: MovieDetail,},
    webViewComponent:{screen:WebViewComponent},
    VideoPlayer:{
        screen:VideoPlayer,
        navigationOptions: ({navigation, screenProps})=>({
            header:null,
        })
    },
},{
    navigationOptions: ({navigation, screenProps})=>({
        headerLeft: navigation.state.params ?
            <TouchableOpacity
                style={styles.headerLeft}
                onPress={()=>{navigation.goBack()}}
                longPressDelayTimeout={false}
            >{mYIcon}</TouchableOpacity>
            :<Text></Text>,
        headerTitle: navigation.state.params ? navigation.state.params.title : '榜单',
        headerStyle: styles.headerStyle,
        headerTitleStyle: styles.headerTitleStyle,
        headerRight: <Text></Text>
    })
});
export default class USBox extends Component {
    render() {
        return <SimpleUS/>
    }
}
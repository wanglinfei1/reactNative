/**
 * Created by wanglinfei on 2017/10/19.
 */
import React, {Component} from 'react'
import {View,Text,TouchableOpacity} from 'react-native'
import {StackNavigator} from 'react-navigation';
import SearchComponent from './searchFrom'
import SearchRes from './searchRes'
import MovieDetail from './movieDetail'
import WebViewComponent from './webView'
import TestComponent from '../home/homeComponent'
import {styles} from '../css/styles'
import Icon from 'react-native-vector-icons/MaterialIcons';
import IconF from 'react-native-vector-icons/FontAwesome';
import VideoPlayer from '../home/videoPlay'
const mYIcon=(<Icon name="navigate-before" size={35} style={{color:'#6435c9'}}></Icon>)
const userIcon=(<IconF name="user" size={25} style={{color:'#6435c9'}}></IconF>)
export const SimpleApp = StackNavigator({
    searchFrom:{screen:SearchComponent},
    searchRes:{screen:SearchRes},
    movieDetail:{screen:MovieDetail},
    webViewComponent:{screen:WebViewComponent},
    userComponent:{screen:TestComponent},
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
        headerTitle: navigation.state.params ? navigation.state.params.title : '搜索',
        headerStyle: styles.headerStyle,
        headerTitleStyle: styles.headerTitleStyle,
        headerRight: <Text></Text>
    })
})

export default class Search extends Component{
    render() {
        return <SimpleApp/>
    }
}
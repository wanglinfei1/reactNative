/**
 * Created by wanglinfei on 2017/10/23.
 */
/**
 * Created by wanglinfei on 2017/10/19.
 */
import React, {Component} from 'react'
import {View,Text,TouchableOpacity} from 'react-native'
import {StackNavigator} from 'react-navigation';
import { connect } from 'react-redux';
import {Tab} from '../home/tabComponent'
import WebViewComponent from './webView'
import WebBrowser from '../home/webBrowser'
import VideoPlayer from '../home/videoPlay'
import {styles} from '../css/styles'
import {serverUrl} from '../js/fn'
import Icon from 'react-native-vector-icons/MaterialIcons';
import IconF from 'react-native-vector-icons/FontAwesome';
import MusicPlay from '../home/musicPlay'
const mYIcon=(<Icon name="navigate-before" size={35} style={{color:'#6435c9'}}></Icon>)
const userIcon=(<IconF name="user" size={22} style={{color:'#6435c9'}}></IconF>)

export const Navigator = StackNavigator({
    TabComponent:{screen:Tab},
    WebViewComponent:{screen:WebViewComponent},
    webBrowser:{
        screen:WebBrowser,
        navigationOptions: ({navigation, screenProps})=>({
            header:null,
        })
    },
    VideoPlayer:{
        screen:VideoPlayer,
        navigationOptions: ({navigation, screenProps})=>({
            header:null,
        })
    },
    MusicPlay:{
        screen:MusicPlay,
        navigationOptions: ({navigation, screenProps})=>({
            header:null,
        })
    }
},{
    navigationOptions: ({navigation, screenProps})=>({
        headerLeft: navigation.state.params ?
            <TouchableOpacity
                style={styles.headerLeft}
                onPress={()=>{navigation.goBack()}}
                longPressDelayTimeout={false}
            >{mYIcon}</TouchableOpacity>
            :<Text></Text>,
        headerTitle: navigation.state.params ? '主页--'+navigation.state.params.title : '主页',
        headerStyle: styles.headerStyle,
        headerTitleStyle: styles.headerTitleStyle,
        headerRight: navigation.state.params&&navigation.state.params.userHiden?<Text></Text>:<TouchableOpacity
            onPress={()=>{
                let {navigate}=navigation;
                navigate('WebViewComponent',{title:"调转加载网页",mobile_url:'http://wzytop.top',userHiden:true})
            }}
            style={styles.headerRight}>{userIcon}</TouchableOpacity>
    })
})

class Home extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <Navigator/>
        )
    }
}
const mapStateToProps = state =>({
    mathStore:state.mathStore
})
export default connect(mapStateToProps)(Home)

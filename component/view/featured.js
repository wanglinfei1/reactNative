/**
 * Created by wanglinfei on 2017/10/18.
 */
import React, {Component} from 'react';
import {View, Text,TouchableOpacity} from 'react-native'
import {styles} from '../css/styles'
import {StackNavigator} from 'react-navigation';
import MovieTalk from './movieTalk'
import MovieDetail from './movieDetail'
import WebViewComponent from './webView'
import Icon from 'react-native-vector-icons/MaterialIcons';
import IconF from 'react-native-vector-icons/FontAwesome';
import { connect } from 'react-redux';
import VideoPlayer from '../home/videoPlay'
const mYIcon=(<Icon name="navigate-before" size={35} style={{color:'#6435c9'}}></Icon>)
const userIcon=(<IconF name="user" size={25} style={{color:'#6435c9'}}></IconF>)
export const SimpleApp = StackNavigator({
    movieTalk: {screen: MovieTalk},
    movieDetail: {screen: MovieDetail},
    webViewComponent: {screen: WebViewComponent,},
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
        headerTitle: navigation.state.params ? navigation.state.params.title : '推荐电影',
        headerStyle: styles.headerStyle,
        headerTitleStyle: styles.headerTitleStyle,
        headerRight: <Text></Text>
    })
});
class Featrured extends Component {
    render() {
        return <SimpleApp/>
    }
}
const mapStateToProps = state =>({
    mathStore:state.mathStore
})
export default connect(mapStateToProps)(Featrured)
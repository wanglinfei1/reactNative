/**
 * Created by wanglinfei on 2017/10/18.
 */
import React, {Component} from 'react';
import {View,Text,StyleSheet,Dimensions}from 'react-native'
let {height: deviceHeight, width: deviceWidth} = Dimensions.get('window');
import {connect} from 'react-redux'
import WebView from '../view/webView'
class HomeComponent extends Component {
    constructor(props){
        super(props);
        this.state={}
    }
    getMessage(e){
        console.log(e.nativeEvent)
    }
    render() {
        return (
            <WebView
                changeTabState = {false}
                getMessage = {this.getMessage}
                mobile_url = "http://wzytop.top/home.html"
            />
        )
    }
}
const styles = StyleSheet.create({
    items:{
    },
    itemText:{
        paddingTop:12,
        width:deviceWidth,
        paddingBottom:12,
        alignSelf: 'center',
        color:'#6435c9',
        fontSize:14,
        paddingLeft:30,
        paddingRight:30,
        borderBottomWidth:1,
        borderColor:'rgba(100,53,201,0.1)',
        textAlign:'center'
    }
})
const mapStateToProps = state => ({
    mathStore:state.mathStore,
    musicPlayReducer:state.musicPlayReducer
})
export default connect(mapStateToProps)(HomeComponent)
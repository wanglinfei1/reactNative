/**
 * Created by wanglinfei on 2017/10/18.
 */
import React, {Component} from 'react';
import {View,Text,StyleSheet,Dimensions,TouchableOpacity}from 'react-native'
let {height: deviceHeight, width: deviceWidth} = Dimensions.get('window');
import {connect} from 'react-redux'
import WebView from '../view/webView'
import {serverUrl,serverHtmlUrl} from '../js/fn'
class HomeComponent extends Component {
    constructor(props){
        super(props);
        this.state={
          postMessage:0
        }
        this.injectedJavaScript="window.REACTDATA = window.REACTDATA||{};REACTDATA.aaaa='aaaa'"
    }
    getMessage(data){//console.log(data)
    }
    postDataToHtml(){
      var oldData = this.state.postMessage;
      this.setState({
        postMessage:oldData+1
      })
    }
    render() {
        return (
            <View style={{flex:1,flexDirection:'column'}}>
            <TouchableOpacity
                activeOpacity={0.5}
                onPress={this.postDataToHtml.bind(this)}
                style={[{backgroundColor: '#38acff',width:100,height:30,borderRadius:5, padding: 5,margin:5,alignSelf:'center'}]}>
                <Text style={{alignSelf:'center'}}>注入</Text>
            </TouchableOpacity>
            <View style={{flex:1,flexDirection:'column'}}>
            <WebView
                changeTabState = {false}
                getMessage = {this.getMessage}
                postMessage={this.state.postMessage}
                injectedJavaScript={this.injectedJavaScript}
                navigation={this.props.navigation}
                mobile_url = {serverHtmlUrl+"/rn/home.html"}
            />
            </View>
            </View>
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

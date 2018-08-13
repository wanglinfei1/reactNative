/**
 * Created by wanglinfei on 2017/10/19.
 */
import React, {Component} from 'react';
import {StyleSheet, Dimensions, Text, View, WebView, BackHandler, Platform,Alert} from 'react-native';
import { connect } from 'react-redux';
import {changeTabState} from '../redux/actions/tabAction'

import {styles} from '../css/styles'
import Loading from '../js/loading'
var {height: deviceHeight, width: deviceWidth} = Dimensions.get('window');
import DeviceInfo from 'react-native-device-info'
class WebViewComponent extends Component {
    static navigationOptions =({navigation, screenProps})=> ({
        header:null,
    });
    static defaultProps={
        postMessage:'',
        injectedJavaScript:'',
        changeTabState:true,
        getMessage:(e) =>{console.log(e.nativeEvent)}
    };
    constructor(props){
        super(props)
        this.target = ''
        this.isBack = true
        this.timer = null
        this.myUserAgent='wlfApp'
    }
    onNavigationStateChange(event) {
        let url = event.url
        if(url.indexOf('.mp4')!==-1){
            if(event.loading&&this.target!==event.url){
                this.target=event.url;
                setTimeout(() => {
                    this.target='';
                },2000)
                let {navigate} = this.props.navigation;
                navigate('VideoPlayer',{
                    videoUrl:url
                })
            }else{
              this.refs.webView.goBack()
            }
        }
        if(event.canGoBack){
            this.isBack = true;
        }else{
            this.isBack = false;
        }
    }
    LoadStart(event) {}
    componentWillMount(){
        let {params} = this.props.navigation?this.props.navigation.state:{params:{}};
        this.singerData=params?(params.singerData||params.id):'';
        if(this.props.changeTabState){
            this.props.dispatch(changeTabState(0))
        }
        BackHandler.addEventListener('hardwareBackPress', () => {
            // 判断是否是执行 webview 中网页的的回退
            if(this.isBack){
                this.refs.webView.goBack();
                return true;
            }
        })
    }
    componentWillReceiveProps(newProps) {
      if (newProps.postMessage !== this.props.postMessage) {
            var postMessage=newProps.postMessage;
            this._postMessage(postMessage)
        }
    }
    componentDidMount(){   }
    componentWillUnmount(){
        let params = this.props.navigation&&this.props.navigation.state.params?this.props.navigation.state.params:{};
        if(params.showBottomTab!=='false'){
          this.props.dispatch(changeTabState(60))
        }
        if (Platform.OS === 'android') {
            BackHandler.removeEventListener('hardwareBackPress',()=>{});
        }
    }
    loading() {
        return <Loading/>
    }
    _getMessage(e){
      var resData = e.nativeEvent.data;
      var data = JSON.parse(resData);
      let {navigate} = this.props.navigation;
      console.log(data)
      if(data.type==='alert'){
        Alert.alert(
            '温馨提示',
            JSON.stringify(data.data),
            [
                {text: '取消', onPress: () => {},style: 'cancel'},
                {text: '确定', onPress: () => {}},
            ],
            {cancelable: false}
        )
      }else if(data.type==='urlNative'){
        let params = this.props.navigation&&this.props.navigation.state.params?this.props.navigation.state.params:{};
        var showBottomTab = (!data.data.showBottomTab&&params.showBottomTab)?'false':'true';
        navigate('WebViewComponent2',{
            title:data.data.title||'',
            showBottomTab:showBottomTab,
            mobile_url:data.data.url||'',
        })
      }else if(data.type==='fn'){
        data.data&&data.data()
      }else{
        this.props.getMessage(data)
      }
    }
    //向HTML发送数据
    _postMessage(data) {
        clearTimeout(this.timer)
        this.timer=setTimeout(() => {
            if (this.refs.webView) {
                this.refs.webView.postMessage(data);
            }
        }, 300);
    }
    render() {
        let params = this.props.navigation&&this.props.navigation.state.params?this.props.navigation.state.params:{};
        const myUserAgent = DeviceInfo.getUserAgent()+'___wlfApp___'+DeviceInfo.getReadableVersion()+'___'+DeviceInfo.getSystemName()+'___'+DeviceInfo.getSystemVersion()
        return (
            <View style={styles.container}>
                <WebView bounces={false}
                         ref="webView"
                         scalesPageToFit={true}
                         onNavigationStateChange={this.onNavigationStateChange.bind(this)}
                         startInLoadingState={true}
                         onLoadStart={() => this.LoadStart()}
                         renderLoading={() => this.loading()}
                         onMessage={this._getMessage.bind(this)}
                         mixedContentMode="always"
                         userAgent = {myUserAgent}
                         source={(params.isHtml||this.props.isHtml)?(params.mobile_url||this.props.mobile_url):{uri: params.mobile_url||this.props.mobile_url}}
                         javaScriptEnabled={true}
                         injectedJavaScript={this.props.injectedJavaScript}
                         style={{width: deviceWidth, height: deviceHeight}}>
                </WebView>
            </View>
        );
    }
}
const mapStateToProps = state =>({
    mathStore:state.mathStore
})
export default connect(mapStateToProps)(WebViewComponent)

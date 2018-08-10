/**
 * Created by wanglinfei on 2017/10/19.
 */
import React, {Component} from 'react';
import {StyleSheet, Dimensions, Text, View, WebView, BackHandler, Platform} from 'react-native';
import { connect } from 'react-redux';
import {changeTabState} from '../redux/actions/tabAction'
import {styles} from '../css/styles'
import Loading from '../js/loading'
var {height: deviceHeight, width: deviceWidth} = Dimensions.get('window');
class WebViewComponent extends Component {
    static navigationOptions =({navigation, screenProps})=> ({
        header:null,
    });
    static defaultProps={
        postMessage:'',
        changeTabState:true,
        getMessage:(e) =>{console.log(e.nativeEvent)}
    };
    constructor(props){
        super(props)
        this.target = ''
        this.isBack = true
        this.timer = null
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
        this.singerData=params.singerData;
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
    componentWillUnmount(){
        this.props.dispatch(changeTabState(60))
        if (Platform.OS === 'android') {
            BackHandler.removeEventListener('hardwareBackPress',()=>{});
        }
    }
    loading() {
        return <Loading/>
    }
    _injectJavaScript() {
        return `const singerData=`+this.singerData;
    }
    //向HTML发送数据
    _postMessage = () => {
        clearTimeout(this.timer)
        this.timer=setTimeout(() => {
            if (this.refs.webView) {
                this.refs.webView.postMessage(this.props.postMessage);
            }
        }, 300);
    }
    render() {
        let {params} = this.props.navigation?this.props.navigation.state:{params:{}};
        return (
            <View style={styles.container}>
                <WebView bounces={false}
                         ref="webView"
                         scalesPageToFit={true}
                         onNavigationStateChange={this.onNavigationStateChange.bind(this)}
                         startInLoadingState={true}
                         onLoadStart={() => this.LoadStart()}
                         renderLoading={() => this.loading()}
                         onMessage={this.props.getMessage}
                         mixedContentMode="always"
                         source={(params.isHtml||this.props.isHtml)?(params.mobile_url||this.props.mobile_url):{uri: params.mobile_url||this.props.mobile_url}}
                         javaScriptEnabled={true}
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

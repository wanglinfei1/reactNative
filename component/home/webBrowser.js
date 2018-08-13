/**
 * Created by wanglinfei on 2017/10/25.
 */
import React, {Component} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import {connect} from 'react-redux'
import {changeTabState} from '../redux/actions/tabAction'
import Loading from '../js/loading'
import {serverUrl,serverHtmlUrl} from '../js/fn'
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Alert,
    WebView,
} from 'react-native'
const BGWASH = 'rgba(255,255,255,0.8)';
const DISABLED_WASH = 'rgba(255,255,255,0.25)';
const STATUS='加载中……'
class WebBrowser extends Component {
    static title = '<WebView>';
    static description = '显示网页的组件';
    static defaultProps={
        DEFAULT_URL:'https://www.baidu.com'
    }
    constructor(props){
        super(props)
        let {params} =this.props.navigation.state;
        this.DEFAULT_URL=params.webUrl||this.props.DEFAULT_URL;
        this.state = {
            url:this.DEFAULT_URL ,
            isHtml: false,
            status: STATUS,
            backButtonEnabled: false,
            forwardButtonEnabled: false,
            loading: true,
            scalesPageToFit: true,
            isPostMessage: false,
            testHide:true
        }
        this.inputText = '';
        this.script = 'document.write("Injected JS ")';
        this.timer=null;
    }
    componentWillMount() {
        this.props.dispatch(changeTabState(0))
    }
    componentWillUnmount(){
        this.props.dispatch(changeTabState(60))
    }
    loading() {
        return(
            <Loading/>
        )
    }
    render() {
        var html = this.state.isPostMessage ? serverHtmlUrl+'/html/messagingtest.html' : serverHtmlUrl+'/html//helloworld.html';
        return (
            <View
                title=""
                style={styles.container}
                noSpacer={true}
                noScroll={true}>
                <View style={styles.statusBar}>
                    <TouchableOpacity
                        onPress={this.close}
                        style={styles.navButtonClose}>
                        <Icon name="ios-undo" size={20}></Icon>
                    </TouchableOpacity>
                    <Text style={styles.statusBarText}>{this.state.status}</Text>
                </View>
                <View style={styles.addressBarRow}>
                    <TouchableOpacity
                        onPress={this.goBack}
                        style={this.state.backButtonEnabled ? styles.navButton : styles.disabledButton}>
                        <Icon name="ios-arrow-back" size={20}></Icon>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={this.goForward}
                        style={this.state.forwardButtonEnabled ? styles.navButton : styles.disabledButton}>
                        <Icon name="ios-arrow-forward" size={20}></Icon>
                    </TouchableOpacity>
                    <TextInput
                        ref={(textinput) => this._textInput = textinput}
                        autoCaitalize="none"
                        defaultValue={this.state.url}
                        onSubmitEditing={this._onSubmitEditing}
                        onChange={this._textChange}
                        clearButtonMode="while-editing"
                        style={styles.addressBarTextInput}
                    />
                    <TouchableOpacity onPress={this._pressGoButton}>
                        <View style={styles.goButton}>
                            <Text>
                                Go!
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <WebView
                    ref={(webview) => this.webview = webview}
                    automaticallyAdjustContentInsets={false}
                    style={styles.webView}
                    source={this.state.isHtml ? {uri: html} : {uri: this.state.url}}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    decelerationRate="normal"
                    mixedContentMode="compatibility"
                    onNavigationStateChange={this._onNavigationStateChange}
                    onShouldStartLoadWithRequest={this._onShouldStartLoadWithRequest}
                    startInLoadingState={true}
                    renderLoading={() => this.loading()}
                    onMessage={this._onMessage}
                    scalesPageToFit={this.state.scalesPageToFit}
                />
                <View style={[{flexDirection: 'row', flexWrap: 'wrap',marginBottom:5,},this.state.testHide&&{display:'none'}]}>
                    <TouchableOpacity
                        activeOpacity={0.5}
                        onPress={() => this.setState({scalesPageToFit: !this.state.scalesPageToFit})}
                        style={[{backgroundColor: '#38acff', marginTop: 5, padding: 5}]}>
                        <Text
                            style={styles.statusBarText}>scalesPageToFit:{this.state.scalesPageToFit ? 'true' : 'false'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={0.5}
                        onPress={() => this.setState({
                            isHtml: !this.state.isHtml,
                            isPostMessage: false,
                            url: this.state.isHtml ? this.DEFAULT_URL : this.state.url
                        })}
                        style={[{backgroundColor: '#38acff', marginTop: 5, padding: 5, marginLeft: 5}]}>
                        <Text
                            style={styles.statusBarText}>可加载{this.state.isHtml ? 'html文件' : '网页uri'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={0.5}
                        onPress={this._postMessage}
                        style={[{backgroundColor: '#38acff', marginTop: 5, padding: 5, marginLeft: 5}]}>
                        <Text
                            style={styles.statusBarText}>测试数据传递</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={0.5}
                        onPress={this.injectJS}
                        style={[{backgroundColor: '#38acff', marginTop: 5, padding: 5, marginLeft: 5}]}>
                        <Text
                            style={styles.statusBarText}>脚本注入</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    //脚本注入
    injectJS = () => {
        const script = `
            document.getElementsByTagName('p')[0].innerHTML="11222222"
        `;  // eslint-disable-line quotes
        if (this.webview) {
            this.webview.injectJavaScript(script);
        }
    }

    //向HTML发送数据
    _postMessage = () => {
        this.setState({isPostMessage: true, isHtml: true})
        clearTimeout(this.timer)
        this.timer=setTimeout(() => {
            if (this.webview) {
                this.webview.postMessage('"Hello" 我是RN发送过来的数据');
            }
        }, 4000);
    }
    //接收HTML发出的数据
    _onMessage = (e) => {
        console.log(e.nativeEvent)
        this.setState({
            messagesReceivedFromWebView: this.state.messagesReceivedFromWebView + 1,
            message: e.nativeEvent.data,
        })
        Alert.alert('温馨提示',e.nativeEvent.data)
    }
    _onNavigationStateChange = (navState) => {
        console.log(navState)
        if(navState.loading){
            this.setState({status: STATUS})
            return;
        }
        this.setState({
            backButtonEnabled: navState.canGoBack,
            forwardButtonEnabled: navState.canGoForward,
            url: navState.url,
            status: navState.title,
            loading: navState.loading,
        });
    }
    _textChange = (e) => {
        var url = e.nativeEvent.text;
        if (!/^[a-zA-Z-_]+:/.test(url)) {
            url = 'http://' + url;
        }
        this.inputText = url;
        //console.log("_textChange:" + this.inputText)
    }
    _onSubmitEditing = (e) => {
        this._pressGoButton();
    }
    _pressGoButton = () => {
        var url = this.inputText.toLowerCase();
        console.log("_pressGoButton:" + this.inputText)
        if (url === this.state.url) {
            this.reload();
        } else {
            this.setState({
                url: url,
            });
        }
        this._textInput.blur();
    };
    close =() =>{
        this.props.navigation.goBack();
        this.props.dispatch(changeTabState(60))
    }
    goBack = () => {
        this.webview.goBack();
    }
    goForward = () => {
        this.webview.goForward();
    }
    reload = () => {
        this.webview.reload();
    }
    _onShouldStartLoadWithRequest = (event) => {
        // Implement any custom loading logic here, don't forget to return!
        return true;
    };
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    addressBarRow: {
        flexDirection: 'row',
        padding: 8,
        backgroundColor: '#38acff',
    },
    addressBarTextInput: {
        backgroundColor: BGWASH,
        borderColor: 'transparent',
        borderRadius: 3,
        borderWidth: 1,
        height: 24,
        paddingLeft: 10,
        paddingTop: 3,
        paddingBottom: 3,
        flex: 1,
        fontSize: 14,
    },
    navButton: {
        width: 20,
        padding: 3,
        marginRight: 3,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: BGWASH,
        borderColor: 'transparent',
        borderRadius: 3,
    },
    navButtonClose:{
        width: 20,
        height:20,
        marginTop:3,
        marginLeft: 3,
        marginRight: 9,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: BGWASH,
        borderColor: 'transparent',
        borderRadius: 3,
    },
    disabledButton: {
        width: 20,
        padding: 3,
        marginRight: 3,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: DISABLED_WASH,
        borderColor: 'transparent',
        borderRadius: 3,
    },
    goButton: {
        height: 24,
        padding: 3,
        marginLeft: 8,
        alignItems: 'center',
        backgroundColor: BGWASH,
        borderColor: 'transparent',
        borderRadius: 3,
        alignSelf: 'stretch',
    },
    statusBar: {
        backgroundColor: '#38acff',
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 5,
        height: 22,
    },
    statusBarText: {
        color: 'white',
        fontSize: 13,
    },
    webView: {
        backgroundColor: BGWASH,
        height: '100%',
    },
})
export default connect()(WebBrowser)

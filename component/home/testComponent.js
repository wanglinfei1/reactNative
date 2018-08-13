/**
 * Created by wanglinfei on 2017/10/18.
 */
import React, {Component} from 'react';
import {View,Text,StyleSheet,Alert,TouchableWithoutFeedback,Image,Dimensions,Linking }from 'react-native'
let {height: deviceHeight, width: deviceWidth} = Dimensions.get('window');
import ScrollTab from '../js/scrollTab'
import ImageTest from './imageTest'
import {getRecommend} from '../js/api'
import {serverUrl,serverHtmlUrl} from '../js/fn'
import GridComponent from '../js/grid'
import Icon2 from 'react-native-vector-icons/Entypo';
import Icon3 from 'react-native-vector-icons/MaterialCommunityIcons';
import {connect} from 'react-redux'
import {changeTabState} from '../redux/actions/tabAction'
class HomeComponent extends Component {
    constructor(props){
        super(props);
        this.state={
            imageList:[]
        }
        this.listData=[
            {name:'userImg',urlLink:"weather://?index=0",imgUrl:'https://wanglinfei1.github.io/static/image/logo.png',style:{width:50,height:50,borderRadius:25}},
            {icon:'qq',color:'#5677fc',urlLink:"mqq://",name:'qq'},
            {icon:'weixin',color:'#259b24',urlLink:"weixin://",name:'weixin'},
            {icon:'envelope-open',color:'blue',urlLink:"smsto://"},
            {icon:'address-book',color:'green',urlLink:"tel://"},
            {icon:'baidu',color:"#5677fc",url:"https://www.baidu.com",iconType:Icon2},
            {icon:'angularjs',type:2,color:'red',iconType:Icon3,url:serverHtmlUrl+'/match'},
            {icon:'bookmark-music',type:2,color:'#ffcd32',iconType:Icon3,url:serverHtmlUrl+'/vueMusic'},
            {icon:'music-circle',type:3,color:'#ffcd00',iconType:Icon3,}
        ]
    }
    componentWillMount() {
        this._getRecommend()
    }
    _getRecommend() {
        getRecommend().then(res => {
            if(res.code === 0){
                this.setState({
                    imageList : res.focus.data.content
                })
            }
        })
    }
    _gridClick(item) {
        let {navigate} = this.props.navigation;
        if(item.url){
            if(item.type === 2){
                let {navigate} = this.props.navigation;
                navigate('WebViewComponent',{
                    mobile_url:item.url
                })
                this.props.dispatch(changeTabState(0))
            }else{
                let {navigate} = this.props.navigation;
                navigate('webBrowser',{
                    webUrl:item.url
                })
            }
        }else if(item.urlLink){
            Linking.canOpenURL(item.urlLink).then(supported => {
                if (supported) {
                    Linking.openURL(item.urlLink);
                } else {
                    Alert.alert('温馨提示',`请先安装`+item.name);
                }
            });
        }else if(item.type == 3){
            let disType=this.props.musicPlayReducer.disType
            console.log(disType == 'none')
            navigate('MusicPlay')
            if(!disType){
                this.props.dispatch(changeTabState(0))
            }else if(disType == 'none'){
                this.props.dispatch(changeMusicPlayState('block'))
            }else if(disType == 'block'){
                this.props.dispatch(changeMusicPlayState('none'))
            }
        }else{
            Alert.alert('点击模块',item.icon||item.name)
        }
    }
    scrollClick(item){
        let {navigate} =  this.props.navigation;
        var url = item.type === 10012 ? 'https://y.qq.com/n/yqq/mv/v/' + item.jump_info.url + '.html' : item.type === 10002 ? 'https://y.qq.com/n/yqq/album/' + item.jump_info.url + '.html#stat=y_new.index.focus.click' : item.jump_info.url;
        console.log(url)
        navigate('WebViewComponent',{
            mobile_url:url
        })
        this.props.dispatch(changeTabState(0))
    }
    renderScroll(imageData){
        let arrScroll=[];
        imageData.forEach((item,index) => {
            arrScroll.push(<TouchableWithoutFeedback
                key={index}
                onPress={()=>{this.scrollClick(item)}}
            >
                <Image source={{uri:item.pic_info.url}} style={{width:deviceWidth,height:180}}></Image>
            </TouchableWithoutFeedback>)
        })
        return arrScroll;
    }
    render() {
        let {navigate} = this.props.navigation;
        return (
            <View>
                <ScrollTab
                    imageData={this.state.imageList}
                    renderScroll={this.renderScroll.bind(this)}
                    height = {170}
                    style={{height:170}}
                />
                <GridComponent
                    listData={this.listData}
                    gridClick={this._gridClick.bind(this)}
                />
                <ImageTest
                    navigation = {navigate}
                />
            </View>
        )
    }
}
const mapStateToProps = state => ({
    mathStore:state.mathStore,
    musicPlayReducer:state.musicPlayReducer
})
export default connect(mapStateToProps)(HomeComponent)

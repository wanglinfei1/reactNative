/**
 * Created by wanglinfei on 2017/11/1.
 */
import React, { Component } from 'react'
import {
    AppRegistry,
    StyleSheet,
    Dimensions,
    Text,
    Image,
    View,
    Slider,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    Animated,
    Easing,
    BackHandler
} from 'react-native'
import {shuffle,getRandom} from '../js/fn'
var {width,height} = Dimensions.get('window');
import Video from 'react-native-video'
import {serverUrl} from '../js/fn'
import HTTPUtil from '../js/HTTPUitl'
import { connect } from 'react-redux';
import {changeTabState} from '../redux/actions/tabAction'
import {changeMusicPlayState} from '../redux/actions/musicPlayAction'
import Icon from 'react-native-vector-icons/MaterialIcons';
var myAnimate = null;
var tingUrl = 0?'http://tingapi.ting.baidu.com/v1/restserver/ting':(serverUrl+'/api/getTingapi')
class MusicPlay extends Component {
    constructor(props) {
        super(props);
        this.spinValue = new Animated.Value(0);
        this._scrollView=null;
        this.disType = this.props.musicPlayReducer.disType;
        this.lyrObj = []   // 存放歌词
        this.state = {
            songs: [],   //歌曲id数据源
            playModel:1,  // 播放模式  1:列表循环    2:随机    3:单曲循环
            btnModel:'repeat', //播放模式按钮背景图
            pic_small:'',    //小图
            pic_big:'',      //大图
            file_duration:0,    //歌曲长度
            song_id:'',     //歌曲id
            title:'',       //歌曲名字
            author:'',      //歌曲作者
            file_link:'',   //歌曲播放链接
            songLyr:[],     //当前歌词
            sliderValue: 0,    //Slide的value
            pause:false,       //歌曲播放/暂停
            currentTime: 0.0,   //当前时间
            duration: 0.0,     //歌曲时间
            currentIndex:0,    //当前第几首
            isplayBtn:'pause',  //播放/暂停按钮背景图
            imgRotate: new Animated.Value(0),
        }
        this.isGoing = false; //为真旋转
        this.myAnimate = Animated.timing(this.state.imgRotate, {
            toValue: 1,
            duration: 6000,
            easing: Easing.inOut(Easing.linear),
        });
    }
    imgMoving = () => {

        if (this.isGoing) {
            this.state.imgRotate.setValue(0);
            this.myAnimate.start(() => {
                this.imgMoving()
            })
        }

    };

    stop = () => {
        this.isGoing = !this.isGoing;

        if (this.isGoing) {
            this.myAnimate.start(() => {
                this.myAnimate = Animated.timing(this.state.imgRotate, {
                    toValue: 1,
                    duration: 6000,
                    easing: Easing.inOut(Easing.linear),
                });
                this.imgMoving()
            })
        } else {
            this.state.imgRotate.stopAnimation((oneTimeRotate) => {
                //计算角度比例
                this.myAnimate = Animated.timing(this.state.imgRotate, {
                    toValue: 1,
                    duration: (1-oneTimeRotate) * 6000,
                    easing: Easing.inOut(Easing.linear),
                });
            });

        }

    };
    //上一曲
    prevAction = (index) =>{
        this.recover()
        this.lyrObj = [];
        if(index == -1){
            index = this.state.songs.length - 1 // 如果是第一首就回到最后一首歌
        }
        this.setState({
            currentIndex:index  //更新数据
        })
        this.loadSongInfo(index)  //加载数据
    }
    //下一曲
    nextAction = (index) =>{
        this.recover()
        this.lyrObj = [];
        if(index == this.state.songs.length){
            index = 0 //如果是最后一首就回到第一首
        }
        this.setState({
            currentIndex:index,  //更新数据
        })
        this.loadSongInfo(index)   //加载数据
    }
    //换歌时恢复进度条 和起始时间
    recover = () =>{
        this.setState({
            sliderValue:0,
            currentTime: 0.0
        })
    }
    //播放模式 接收传过来的当前播放模式 this.state.playModel
    playModel = (playModel) =>{
        playModel++;
        playModel = playModel == 4 ? 1 : playModel
        //重新设置
        this.setState({
            playModel:playModel
        })
        //根据设置后的模式重新设置背景图片
        if(playModel == 1){
            this.setState({
                btnModel:'repeat',
            })
        }else if(playModel ==  2){
            this.setState({
                btnModel:'shuffle',
            })
        }else{
            this.setState({
                btnModel:'repeat-one',
            })
        }
    }
    //播放/暂停
    playAction =() => {
        this.setState({
            pause: !this.state.pause
        })
        //判断按钮显示什么
        if(this.state.pause == true){
            this.setState({
                isplayBtn:'pause'
            })
        }else {
            this.setState({
                isplayBtn:'play-arrow'
            })
        }

    }
    //播放器每隔250ms调用一次
    onProgress =(data) => {
        let val = parseInt(data.currentTime)
        this.setState({
            sliderValue: val,
            currentTime: data.currentTime
        })

        //如果当前歌曲播放完毕,需要开始下一首
        if(val == this.state.file_duration){
            if(this.state.playModel == 1){
                //列表 就播放下一首
                this.nextAction(this.state.currentIndex + 1)
            }else if(this.state.playModel == 2){
                let  last =  this.state.songs.length //json 中共有几首歌
                let random = Math.floor(Math.random() * last)  //取 0~last之间的随机整数
                this.nextAction(random) //播放
            }else{
                //单曲 就再次播放当前这首歌曲
                this.refs.video.seek(0) //让video 重新播放
                //this._scrollView.scrollTo({x: 0,y:0,animated:false});
            }
        }

    }
    //把秒数转换为时间类型
    formatTime(time) {
        // 71s -> 01:11
        let min = Math.floor(time / 60)
        let second = time - min * 60
        min = min >= 10 ? min : '0' + min
        second = second >= 10 ? second : '0' + second
        return min + ':' + second
    }
    // 歌词
    renderItem() {
        // 数组
        return this.lyrObj.map((item,index) => {
            if(this.state.currentTime.toFixed(2) >= item.total&&this.lyrObj[index+1]&&this.state.currentTime.toFixed(2)<this.lyrObj[index+1].total) {
                return item.txt
            }else{
                return ''
            }
        })
    }
    // 播放器加载好时调用,其中有一些信息带过来
    onLoad = (data) => {
        this.setState({ duration: data.duration });
    }

    loadSongInfo = (index) => {
        //加载歌曲
        let songid =  this.state.songs[index]
        HTTPUtil.get(tingUrl,{songid:songid,method:'baidu.ting.song.play'})
            .then((responseJson) => {
                let songinfo = responseJson.songinfo
                let bitrate = responseJson.bitrate
                this.setState({
                    pic_small:songinfo.pic_small, //小图
                    pic_big:songinfo.pic_premium,  //大图
                    title:songinfo.title,     //歌曲名
                    author:songinfo.author,   //歌手
                    file_link:bitrate.file_link,   //播放链接
                    file_duration:bitrate.file_duration //歌曲长度
                })
                var _this=this
                //加载歌词
                HTTPUtil.get(tingUrl,{songid:songid,method:'baidu.ting.song.lry'})
                    .then((responseJson) => {
                        let lry = responseJson.lrcContent
                        let lryAry = lry.split('\n')   //按照换行符切数组
                        lryAry.forEach(function (val, index) {
                            var obj = {}   //用于存放时间
                            val = val.replace(/(^\s*)|(\s*$)/g, '')    //正则,去除前后空格
                            let indeofLastTime = val.indexOf(']')  // ]的下标
                            let timeStr = val.substring(1, indeofLastTime) //把时间切出来 0:04.19
                            let minSec = ''
                            let timeMsIndex = timeStr.indexOf('.')  // .的下标
                            if (timeMsIndex !== -1) {
                                //存在毫秒 0:04.19
                                minSec = timeStr.substring(1, val.indexOf('.'))  // 0:04.
                                obj.ms = parseInt(timeStr.substring(timeMsIndex + 1, indeofLastTime))  //毫秒值 19
                            } else {
                                //不存在毫秒 0:04
                                minSec = timeStr
                                obj.ms = 0
                            }
                            let curTime = minSec.split(':')  // [0,04]
                            obj.min = parseInt(curTime[0])   //分钟 0
                            obj.sec = parseInt(curTime[1])   //秒钟 04
                            obj.txt = val.substring(indeofLastTime + 1, val.length)
                            obj.txt = obj.txt.replace(/(^\s*)|(\s*$)/g, '')
                            obj.dis = false
                            obj.total = obj.min * 60 + obj.sec + obj.ms / 100   //总时间
                            if (obj.txt.length > 0) {
                                _this.lyrObj.push(obj)
                            }
                        })
                    })

            })
    }
    hardBackCallBack() {
        this.props.dispatch(changeMusicPlayState('none'))
        this.props.dispatch(changeTabState(60))
        let {navigate} = this.props.navigation
        navigate('TabComponent')
        return true;
    }

    componentWillMount() {
        this.loadSongList()
        this.stop()
        //BackHandler.addEventListener('hardwareBackPress',this.hardBackCallBack.bind(this) );
    }
    componentWillUnmount() {
        this.props.dispatch(changeTabState(60))
        myAnimate = null;
        //BackHandler.removeEventListener('hardwareBackPress',this.hardBackCallBack.bind(this) );
    }
    loadSongList() {
        //先从总列表中获取到song_id保存
        var type = getRandom(1,2);
        HTTPUtil.get(tingUrl,{type:type,/*size:50,offset:0,*/method:'baidu.ting.billboard.billList'})
            .then((responseJson) => {
                var listAry = responseJson.song_list
                console.log(listAry);
                var song_idAry = []; //保存song_id的数组
                for(var i = 0;i<listAry.length;i++){
                    let song_id = listAry[i].song_id
                    song_idAry.push(song_id)
                }
                this.setState({
                    songs:shuffle(song_idAry)
                })
                this.spin()   //   启动旋转
                this.loadSongInfo(0)   //预先加载第一首
            }).catch((err) => {
                    console.log(err)
            })
    }
    //旋转动画
    spin () {
        this.spinValue.setValue(0)
        myAnimate = null;
        myAnimate = Animated.timing(
            this.spinValue,
            {
                toValue: 1,
                duration: 4000,
                easing: Easing.linear
            }
        ).start(() => this.spin())

    }

    render() {
        //如果未加载出来数据 就一直转菊花
        if (this.state.file_link.length <= 0 ) {
            return(
                <ActivityIndicator
                    animating={this.state.animating}
                    style={{flex: 1,alignItems: 'center',justifyContent: 'center'}}
                    size="large" />
            )
        }else{
            const spin = this.spinValue.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '360deg']
            })
            //数据加载出来
            return (
                <View style={[this.disType == ''||this.disType == 'block'?styles.container:{flex:0},{zIndex:100}]}>
                    {/*背景大图*/}
                    <Image source={{uri:this.state.pic_big}} style={{flex:1}}/>
                    {/*背景白色透明遮罩*/}
                    <View style = {{position:'absolute',width: width,height:height,backgroundColor:'#000',opacity:0.2}}/>

                    <View style = {{position:'absolute',width: width,bottom:30}}>
                        {/*胶片光盘*/}
                        <Image source={{uri:'https://wanglinfei1.github.io/static/image/filmReel.png'}} style={{width:220,height:220,alignSelf:'center'}}/>

                        {/*旋转小图*/}
                        <Animated.Image
                            ref = 'myAnimate'
                            style={{width:140,height:140,marginTop: -180,alignSelf:'center',borderRadius: 140*0.5,transform: [{rotate: this.state.imgRotate.interpolate({
                                inputRange: [0, 1],
                                outputRange: ['0deg', '360deg']
                            })}]}}
                            source={{uri: this.state.pic_small}}
                        />

                        {/*播放器*/}
                        <Video
                            source={{uri: this.state.file_link}}
                            ref='video'
                            volume={1.0}
                            paused={this.state.pause}
                            playInBackground={true}
                            onProgress={(e) => this.onProgress(e)}
                            onLoad={(e) => this.onLoad(e)}
                        />
                        <View style={{flex:1,justifyContent:"center",alignItems:"center",marginTop:100}}>
                            <Text style={{color:"#FFDB42",height:24,fontSize:14}}>{this.renderItem()}</Text>
                        </View>
                        <View style={{marginTop:80}}>
                           {/*歌曲信息*/}
                           <View style={styles.playingInfo}>
                               {/*作者-歌名*/}
                               <Text style={{color:"#FFDB42"}}>{this.state.author} - {this.state.title}</Text>
                               {/*时间*/}
                               <Text style={{color:"#FFDB42"}}>{this.formatTime(Math.floor(this.state.currentTime))}/{this.formatTime(Math.floor(this.state.duration))}</Text>
                           </View>
                           {/*进度条*/}
                           <Slider
                               ref='slider'
                               style={{ marginLeft: 10, marginRight: 10,flex:1}}
                               value={this.state.sliderValue}
                               maximumValue={this.state.file_duration}
                               step={1}
                               minimumTrackTintColor='#FFDB42'
                               onValueChange={(value) => {
                                   this.setState({
                                       currentTime:value
                                   })
                               }}
                               onSlidingComplete={(value) => {
                                   this.refs.video.seek(value)
                               }}
                           />
                           {/*歌曲按钮*/}
                           <View style = {{flexDirection:'row',justifyContent:'space-around',marginTop:20}}>
                               {/*播放模式*/}
                               <TouchableOpacity onPress={()=>this.playModel(this.state.playModel)}>
                                   <Icon name={this.state.btnModel} size={40} color="#FFDB42"></Icon>
                               </TouchableOpacity>
                               <TouchableOpacity onPress={()=>this.playAction()}>
                                   <Icon name={this.state.isplayBtn} size={40} color="#FFDB42"></Icon>
                               </TouchableOpacity>
                               <TouchableOpacity onPress={()=>this.prevAction(this.state.currentIndex - 1)}>
                                   <Icon name="fast-rewind" size={40} color="#FFDB42"></Icon>
                               </TouchableOpacity>
                               <TouchableOpacity onPress={()=>this.nextAction(this.state.currentIndex + 1)}>
                                   <Icon name="fast-forward" size={40} color="#FFDB42"></Icon>
                               </TouchableOpacity>
                           </View>
                       </View>
                    </View>

                </View>
            )
        }

    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    image: {
        flex: 1
    },
    playingControl: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 10,
        paddingLeft: 20,
        paddingRight: 20,
        paddingBottom: 20
    },
    playingInfo: {
        flexDirection: 'row',
        alignItems:'stretch',
        justifyContent: 'space-between',
        paddingTop: 40,
        paddingLeft: 20,
        paddingRight: 20,
        backgroundColor:'rgba(255,255,255,0.0)'
    },
    text: {
        color: "black",
        fontSize: 22
    },
    modal: {
        height: 300,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        paddingTop: 5,
        paddingBottom: 50
    },
    itemStyle: {
        marginTop: 10,
        height:25,
        backgroundColor:'rgba(255,255,255,0.0)'
    }
})
const mapStateToProps = state => ({
    musicPlayReducer:state.musicPlayReducer
})
export default connect(mapStateToProps)(MusicPlay)

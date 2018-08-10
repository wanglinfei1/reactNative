'use strict';

import React, {
    Component
} from 'react';

import {
    AppRegistry,
    StyleSheet,
    Slider,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import {connect} from 'react-redux'
import {changeTabState} from '../redux/actions/tabAction'
import Icon from 'react-native-vector-icons/Entypo';
import Video from 'react-native-video';
import Loading from '../js/loading'
class VideoPlayer extends Component {
    constructor(props){
        super(props)
        let {params} = this.props.navigation.state
        this.state = {
            rate: 1,
            volume: 1,
            muted: false,
            resizeMode: 'contain',
            duration: 0.0,
            currentTime: 0.0,
            sliderValue:0,
            paused: true,
            videoUrl:params.videoUrl,
        };
        this.video='';
    }
    onLoad = (data) => {
        this.setState({ duration: data.duration,paused:false });
    }
    onProgress = (data) => {
        let val = parseInt(data.currentTime)
        this.setState({
            sliderValue: val,
            currentTime: data.currentTime
        })
    }
    onEnd = () => {
        this.setState({ paused: true,sliderValue:0 ,currentTime:0})
        this.video.seek(0)
    }
    onAudioBecomingNoisy = () => {
        this.setState({ paused: true })
    }
    onAudioFocusChanged = (event) => {
        this.setState({ paused: !event.hasAudioFocus })
    }
    onBuffer = () => {
    }
    componentWillUnmount(){
        this.props.dispatch(changeTabState(60))
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
    RendIcon() {
        if(this.state.duration=='0.0'){
            return <Loading/>
        }else if(this.state.paused){
            return (
                <TouchableOpacity
                    onPress={() => this.setState({ paused: !this.state.paused })}
                    style={{justifyContent:"center",alignItems:"center"}}>
                    <Icon name={"controller-play"} style={{color:"#FFDB42"}} size={60}></Icon>
                </TouchableOpacity>
            )

        }
    }
    render() {
        return (
            <View style={styles.container}>
                <View
                    style={styles.fullScreen}
                >
                    <Video
                        ref={(ref) => { this.video = ref }}
                        source={{ uri: this.state.videoUrl}}
                        style={styles.fullScreen}
                        rate={this.state.rate}
                        paused={this.state.paused}
                        volume={this.state.volume}
                        muted={this.state.muted}
                        resizeMode={this.state.resizeMode}
                        onLoadStart={this.onLoadStart}
                        onLoad={this.onLoad}
                        onProgress={this.onProgress}
                        onEnd={this.onEnd}
                        onAudioBecomingNoisy={this.onAudioBecomingNoisy}
                        onAudioFocusChanged={this.onAudioFocusChanged}
                        CallBuffer = { this.onBuffer }
                        repeat={false}
                    />
                    <View style={[{flex:1,justifyContent:"center"}]}>
                        {this.RendIcon()}
                    </View>
                </View>
                <View style={styles.controls}>
                    <View style={styles.playingInfo}>
                        <Text style={{color:"#FFDB42"}}>{this.formatTime(Math.floor(this.state.currentTime))}</Text>
                        <Text style={{color:"#FFDB42"}}>{this.formatTime(Math.floor(this.state.duration))}</Text>
                    </View>
                    <View style={{flexDirection:'row'}}>
                        <TouchableOpacity
                            onPress={() => this.setState({ paused: !this.state.paused })}
                            style={{justifyContent:"center"}}>
                            <Icon name={this.state.paused?"controller-play":"controller-paus"} style={{color:"#FFDB42"}} size={30}></Icon>
                        </TouchableOpacity>
                        <Slider
                            ref='slider'
                            style={{ marginLeft: 10, marginRight: 10,flex:1}}
                            value={this.state.sliderValue}
                            maximumValue={this.state.duration}
                            step={1}
                            minimumTrackTintColor='#FFDB42'
                            onValueChange={(value) => {this.setState({currentTime:value})}}
                            onSlidingComplete={(value) => {
                                this.setState({ paused: false })
                                this.video.seek(value)
                            }}
                        />
                    </View>
                </View>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
    },
    fullScreen: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },
    controls: {
        backgroundColor: 'transparent',
        borderRadius: 5,
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
    },
    progress: {
        flex: 1,
        flexDirection: 'row',
        borderRadius: 3,
        overflow: 'hidden',
    },
    innerProgressCompleted: {
        height: 6,
        backgroundColor: '#cccccc',
    },
    innerProgressRemaining: {
        height: 6,
        backgroundColor: '#2C2C2C',
    },
    generalControls: {
        flex: 1,
        flexDirection: 'row',
        borderRadius: 4,
        overflow: 'hidden',
        paddingBottom: 10,
    },
    rateControl: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    volumeControl: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    resizeModeControl: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    controlOption: {
        alignSelf: 'center',
        fontSize: 11,
        color: 'white',
        paddingLeft: 2,
        paddingRight: 2,
        lineHeight: 12,
    },
    playingInfo: {
        flexDirection: 'row',
        alignItems:'stretch',
        justifyContent: 'space-between',
        padding:10,
        backgroundColor:'rgba(255,255,255,0.0)'
    },
});
export default connect()(VideoPlayer)

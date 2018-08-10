/**
 * Created by wanglinfei on 2017/10/17.
 */
import React, {Component} from 'react'
import {ScrollView,StyleSheet,View,Text,Image,TouchableOpacity,Alert,Linking} from 'react-native'
import {connect} from 'react-redux'
import {changeTabState} from '../redux/actions/tabAction'
import {changeMusicPlayState} from '../redux/actions/musicPlayAction'
import {serverUrl} from '../js/fn'
class ImageTest extends Component{
    constructor(props){
        super(props);
    }
    render() {
        let navigate = this.props.navigation;
        return (
            <View>
                <View style={{flexDirection:'row',justifyContent: 'center',marginTop:0}}></View>
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                        navigate('WebViewComponent',{mobile_url:serverUrl+"/vueMusic"})
                        this.props.dispatch(changeTabState(0))
                    }}>
                    <Text style={styles.itemText}>vue音乐播放器</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
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
                    }}>
                    <Text style={styles.itemText}>native音乐播放器</Text>
                </TouchableOpacity>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    items:{
    },
    iconStyle:{
    },
    itemText:{
        paddingTop:12,
        paddingBottom:12,
        alignSelf: 'center',
        color:'#6435c9',
        fontSize:14,
        paddingLeft:30,
        paddingRight:30,
        borderBottomWidth:1,
        borderColor:'rgba(100,53,201,0.1)',
    }
})
const mapStateToProps = state => ({
    mathStore:state.mathStore,
    musicPlayReducer:state.musicPlayReducer
})
export default connect(mapStateToProps)(ImageTest)

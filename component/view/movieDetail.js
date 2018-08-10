/**
 * Created by wanglinfei on 2017/10/18.
 */
import React, {Component} from 'react';
import {View,ListView, Text,Button, Image, StyleSheet,TouchableHighlight,ScrollView} from 'react-native';
import {styles} from '../css/styles'
import {getMovieDetail} from '../js/api'
import {getCastsDes,ArrToStr,isArray} from '../js/fn'
import Loading from '../js/loading'
export default class MovieDetail extends Component {
    constructor(props) {
        super(props);
        let {params} = this.props.navigation.state;
        this.state = {
            movieDetail: '',
            loaded: false,
            summary:new ListView.DataSource({
                rowHasChanged:(row1,row2) => row1 !== row2
            }),
            summarys:[]
        }
        this._getMovieDetail(params.movieId,params.movieDetail)
    }

    _getMovieDetail(movieId,movieDetail) {
        if(movieId){
            getMovieDetail(movieId).then((res)=> {
                this.setState({
                    movieDetail: res,
                    loaded: true,
                    summary:this.state.summary.cloneWithRows(res.summary.split(/\n/)),
                    summarys:res.summary.split(/\n/)
                })
                console.log(res)
            })
        }else{
            setTimeout(() =>{
                this.setState({
                    movieDetail: movieDetail,
                    loaded: true,
                    summarys:[movieDetail.video_lib_meta?movieDetail.video_lib_meta.description:'']
                })
            },300)
        }

    }
    summaryHtml(summary) {
        return (
            <Text style={styles2.DetailText}>{summary}</Text>
        )
    }
    summarysHtml() {
        return this.state.summarys.map((summary,index)=>{
            return (
                <Text style={styles2.DetailText} key={index}>{summary}</Text>
            )
        })
    }
    render() {
        let {navigate} = this.props.navigation;
        return (
            <View style={styles.container}>
                {
                    this.state.loaded == false ?
                        <Loading/> :
                        <ScrollView >
                            <TouchableHighlight
                                activeOpacity={0.8}
                                underlayColor='rgba(34,26,38,0.1)'
                                onPress={() => {
                                    navigate('webViewComponent',{
                                        title:"调转加载网页",
                                        mobile_url:this.state.movieDetail.mobile_url||this.state.movieDetail.albumLink,
                                    })
                                }}
                            >
                                <View style={styles.item_container}>
                                    <View style={styles.itemImage}>
                                        <Image
                                            style={styles2.detailImage}
                                            source={{uri: this.state.movieDetail.albumImg||this.state.movieDetail.images.large}}
                                        />
                                    </View>
                                    <View style={styles.itemContent}>
                                        <Text style={styles.itemCasts}>{getCastsDes(this.state.movieDetail)}</Text>
                                        <Text style={[styles.itemHeader,{fontSize:14}]}>{ArrToStr(this.state.movieDetail.countries||(this.state.movieDetail.video_lib_meta&&this.state.movieDetail.video_lib_meta.region))}</Text>
                                        <Text style={[styles.itemHeader,{fontSize:14}]}>{ArrToStr(this.state.movieDetail.genres||(this.state.movieDetail.video_lib_meta&&this.state.movieDetail.video_lib_meta.category))}</Text>
                                        <Text style={styles.redText}>{this.state.movieDetail.rating?this.state.movieDetail.rating.average:this.state.movieDetail.score}</Text>
                                    </View>
                                </View>
                            </TouchableHighlight>
                            <View>
                                <View>
                                    {
                                        this.summarysHtml()
                                    }
                                </View>
                            </View>
                        </ScrollView>
                }
            </View>
        )
    }
}

const styles2 = StyleSheet.create({
    detailImage: {
        width: 90,
        height: 140,
        padding:10
    },
    DetailText:{
        paddingTop:6,
        paddingLeft:20,
        paddingRight:20,
        fontSize:13,
        lineHeight:24
    }
})
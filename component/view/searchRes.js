/**
 * Created by wanglinfei on 2017/10/19.
 */
import React,{Component} from 'react';
import {View,ListView,Text,TouchableHighlight,Image,DeviceEventEmitter,Alert} from 'react-native'
import {styles} from '../css/styles'
import {shuffle} from '../js/fn'
import {getSearch} from '../js/api'
import MovieList from './movieList'

export default class SearchRes extends Component{
    constructor(props){
        super(props);
        let {params} = this.props.navigation.state;
        let movies=params.movies||[]
        var movieItems = movies.subjects?movies.subjects:(movies.docinfos?movies.docinfos:movies)
        var count = 20
        var start = 1
        this.state={
            movies:movieItems,
            count:count,
            start:start,
            text:params.text,
            isRefreshing:false,
            isLoadAll:true,
            isLoadMore:true,
            loaded:true
        }
    }
    componentWillMount() {/*console.log(this.state.movies)*/}
    showMovieDetail(movie) {
        let {navigate} = this.props.navigation;
        if(movie.videoDocType == 1){
            var summarys = movie.video_lib_meta?movie.video_lib_meta.description:'';
            if(!movie.id&&!summarys){
                navigate('webViewComponent',{
                    title:movie.title||movie.albumTitle,
                    mobile_url:movie.albumLink||movie.link,
                })
            }else{
                navigate('movieDetail',{
                    title:movie.title||movie.albumTitle,
                    movieId:movie.id||'',
                    movieDetail:movie
                })
            }
        }else{
            var url = movie.videoDocType == 3?movie.itemLink:movie.albumLink
            if(url){
                navigate('webViewComponent',{
                    title:"调转加载网页",
                    mobile_url:url,
                })
            }else{
                Alert.alert(JSON.stringify(movie));
            }
        }
    }
    fetchData(start) {
        console.log(start)
        getSearch({key:this.state.text,pageNum:start,pageSize:this.state.count}).then((res) => {
            var moviesArr = res.subjects||res.data.docinfos||[]
        }).catch((err) =>{
            console.log(err)
        })
    }
    _topRefresh() {
        /*this.setState({isRefreshing:true})
        setTimeout(() => {
            this.setState({
                movies:shuffle(this.state.movies),
                isRefreshing:false
            })
        },2000)*/
    }
    _toEndMore() {
        if(this.state.isLoadAll){return}
        var oldStart = this.state.start;
        let newStart=oldStart+1;
        this.setState({start:newStart})
        //this.fetchData(newStart)
    }
    render() {
        return(
            this.state.movies.length?
            <MovieList
                movies={this.state.movies}
                movieClick={ this.showMovieDetail.bind(this)}
                loaded={this.state.loaded}
                topRefresh={this._topRefresh.bind(this)}
                toEndMore={this._toEndMore.bind(this)}
                isRefreshing={this.state.isRefreshing}
                isLoadMore={this.state.isLoadMore}
                isLoadAll={this.state.isLoadAll}
            />:
            <View>
                <Text style={{flexDirection:'row',justifyContent: 'center',
                    marginTop:20,fontSize:16,
                    fontFamily:'Helvetica Neue',
                    fontWeight:'300',
                    color:'#6435c9',textAlign:'center'}}>暂无该数据</Text>
            </View>
        )
    }
}

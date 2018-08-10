/**
 * Created by wanglinfei on 2017/10/17.
 */
import React, {Component} from 'react'
import {View,ListView,Text
    ,Image,ActivityIndicatorIOS
    ,TouchableHighlight
} from 'react-native'
import {getUSBox} from '../js/api'
import {shuffle} from '../js/fn'
import MovieList from './movieList'
const count=20;
export default class USBoxList extends Component{
    constructor(props){
        super(props);
        this.state = {
            movies:[],
            loaded:false,
            isRefreshing:false,
            isLoadMore:true,
            isLoadAll:true,
            start:1
        };
        this.fetchData(this.state.start)
    }
    fetchData(start) {
        getUSBox({pageNum:start,pageSize:count}).then((res) => {
            console.log(res)
            var moviesArr = res.subjects||res.data.docinfos||[]
            if(moviesArr.length){
                this.setState({
                    movies:this.state.movies.concat(moviesArr),
                    loaded:true
                })
                this.setState({
                    isLoadAll:false
                })
            }else{
                this.setState({
                    isLoadAll:true
                })
            }
        })
    }
    showMovieDetail(movie) {
        let {navigate} = this.props.navigation;
        var summarys = movie.video_lib_meta?movie.video_lib_meta.description:'';
        if(!movie.id&&!summarys){
            navigate('webViewComponent',{
                title:movie.title||movie.albumTitle,
                mobile_url:movie.albumLink||movie.link,
            })
        }else{
            navigate('movieDetail',{
                title:movie.title||movie.albumTitle,
                movieId:'',
                movieDetail:movie
            })
        }
    }
    _topRefresh() {
        this.setState({
            isRefreshing:true
        })
        setTimeout(() => {
            this.setState({
                movies:shuffle(this.state.movies),
                isRefreshing:false
            })
        },2000)
    }
    _toEndMore() {
        if(this.state.isLoadAll){
            return
        }
        var oldStart = this.state.start
        let newStart=oldStart+1
        this.setState({
            start:newStart
        })
        this.fetchData(newStart)
    }
    render(){
        return(
            <MovieList
                movies={this.state.movies}
                loaded={this.state.loaded}
                movieClick={this.showMovieDetail.bind(this)}
                topRefresh={this._topRefresh.bind(this)}
                toEndMore={this._toEndMore.bind(this)}
                isRefreshing={this.state.isRefreshing}
                isLoadMore={this.state.isLoadMore}
                isLoadAll={this.state.isLoadAll}
            />
        )
    }
}
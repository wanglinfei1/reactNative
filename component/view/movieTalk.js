/**
 * Created by wanglinfei on 2017/10/17.
 */
import React, {Component} from 'react'
import {View,ListView,Text,Image,TouchableHighlight,DeviceEventEmitter} from 'react-native'
import {getMovies} from '../js/api'
import {shuffle} from '../js/fn'
import MovieList from './movieList'
const count=20;
export default class MovieTalk extends Component{
    constructor(props){
        super(props);
        this.state = {
            movies:[],
            loaded:false,
            isRefreshing:false,
            isLoadMore:true,
            isLoadAll:true,
            start:0
        };
    }
    componentWillMount(){
        console.log(this.state.movies.length)
        if(!this.state.movies.length){
            this.fetchData(this.state.start)
        }
    }
    fetchData(start) {
        getMovies({start:start,count:count}).then((res) => {
            console.log(res)
            this.setState({
                movies:this.state.movies.concat(shuffle(res.subjects)),
                loaded:true
            })
            if(res.total&&this.state.start+count<res.total){
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
        navigate('movieDetail',{
            title:movie.title,
            movieId:movie.id
        })
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
        let newStart=this.state.start+count
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

/**
 * Created by wanglinfei on 2017/10/20.
 */
import React,{Component} from 'react'
import {View,ListView,Text,Image,TouchableHighlight,DeviceEventEmitter,RefreshControl} from 'react-native'
import {getCastsDes} from '../js/fn'
import Loading from '../js/loading'
import LoadMoreFooter from '../js/loadMoreFooter'
import {styles} from '../css/styles'
export default class MovieList extends Component{
    static defaultProps={
        loaded:false,
        isRefreshing:false,
        isLoadMore:false,
        isLoadAll:true,
        toEndMore:() => {console.log('end')},
        movieClick:(movie) =>{console.log(movie)},
        topRefresh:() => {console.log('top')},
    }
    constructor(props){
        super(props);
        this.state={
            waiting:false
        }
    }
    componentDidMount() {

    }
    shouldComponentUpdate(nextProps,nextSate) {
        return true;
    }
    componentWillUpdate(nextProps, nextState){
        //console.log(nextState)
    }
    movieItem(movieInIT) {
        let movie=movieInIT.subject||movieInIT.albumDocInfo||movieInIT;
        return (
            (movie.videoDocType!=3&&movie.videoDocType!=2)?
            (<TouchableHighlight
                disabled={this.state.waiting}
                activeOpacity={0.8}
                longPressDelayTimeout={false}
                underlayColor='rgba(34,26,38,0.1)'
                onPress={()=>{
                    this.setState({waiting:true})
                    setTimeout(()=>{
                        this.setState({waiting:false})
                    },1000);
                    console.log(movie)
                    this.props.movieClick(movie)
                }}>
                <View style={styles.item_container}>
                    <View style={styles.itemImage}>
                        <Image
                            source={{uri:movie.albumImg||(movie.images&&movie.images.large)||'https://wanglinfei1.github.io/static/image/logo.png'}}
                            style={styles.image}
                        />
                    </View>
                    <View style={styles.itemContent}>
                        <Text style={styles.itemHeader}>{(movie.title||movie.albumTitle)&&(movie.title||movie.albumTitle).substring(0,60)}</Text>
                        <Text style={styles.itemCasts}>{getCastsDes(movie)}</Text>
                        <Text style={styles.redText}>{movie.rating?movie.rating.average:movie.score}</Text>
                    </View>
                </View>
            </TouchableHighlight>):([])
        )
    }
    _movieItem(movie){
        var movieRecArr = [];
        if(movie.videoDocType==3){
            var movieRec = movie&&movie.recommendation?movie.recommendation:[]
            movieRec.forEach((ITEM,index) =>{
                ITEM.videoDocType = movie.videoDocType;
                movieRecArr.push(
                    <TouchableHighlight
                        key={index}
                        disabled={this.state.waiting}
                        activeOpacity={0.8}
                        longPressDelayTimeout={false}
                        underlayColor='rgba(34,26,38,0.1)'
                        onPress={()=>{
                            this.setState({waiting:true})
                            setTimeout(()=>{
                                this.setState({waiting:false})
                            },1000);
                            console.log(ITEM)
                            this.props.movieClick(ITEM)
                        }}>
                        <View style={styles.item_container}>
                            <View style={styles.itemImage}>
                                <Image
                                    source={{uri:ITEM.itemHImage||'https://wanglinfei1.github.io/static/image/logo.png'}}
                                    style={styles.image}
                                />
                            </View>
                            <View style={styles.itemContent}>
                                <Text style={styles.itemHeader}>{ITEM.itemTitle}</Text>
                                <Text style={styles.itemCasts}>{getCastsDes(ITEM)}</Text>
                                <Text style={styles.redText}>{ITEM.site?ITEM.site.site_name:''}</Text>
                            </View>
                        </View>
                    </TouchableHighlight>
                )
            })
        }
        return movieRecArr
    }
    _renderFooter() {
        let  product= this.props.movies;
        if (product.length < 1||!this.props.isLoadMore) {
            return null
        }
        return <LoadMoreFooter isLoadAll={this.props.isLoadAll}/>
    }
    initMovies(movies){
        var newMovies = []
        movies.forEach((movieInIT,index) =>{
            let movie=movieInIT.subject||movieInIT.albumDocInfo||movieInIT;
            movie.videoDocType = movie.videoDocType||1
            if(movie.videoDocType==1||movie.videoDocType==3){
                newMovies.push(movieInIT)
            }
        })
        return newMovies;
    }
    render(){
        let mov=new ListView.DataSource({
            rowHasChanged:(row1,row2) => row1 !== row2
        })
        var porpsMovies = this.initMovies(this.props.movies)
        let movies=mov.cloneWithRows(porpsMovies)
        if(!this.props.loaded){
            return (
                <View style={styles.container}>
                    <Loading/>
                </View>
            )
        }
        return(
            <View style={styles.item}>
                <ListView
                    ref={(scrollView) => { _scrollView = scrollView; }}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.props.isRefreshing}
                            onRefresh={() => {this.props.topRefresh()}}
                            tintColor="#ff0000"
                            title="Loading..."
                            colors={['#ff0000', '#00ff00', '#0000ff']}
                        />}
                    dataSource={movies}
                    renderRow={this.movieItem.bind(this)}
                    onEndReached={() => {
                        this.props.toEndMore()
                    }}
                    onEndReachedThreshold={100}
                    renderFooter={ this._renderFooter.bind(this) }
                />
            </View>
        )
    }
}
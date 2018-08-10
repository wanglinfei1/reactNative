/**
 * Created by wanglinfei on 2017/10/19.
 */
import React, {Component} from 'react'
import {
    View,
    Text,
    TextInput,
    ActivityIndicator,
    DeviceEventEmitter,
    TouchableHighlight,
    StyleSheet,
    ScrollView,
    Alert,
    Dimensions
} from 'react-native'
let {height: deviceHeight, width: deviceWidth} = Dimensions.get('window');
import {styles} from '../css/styles'
import {getSearch,getiqyHotKey,getqqHotKey} from '../js/api'
import {insetSearch,deleteOneSearch} from '../js/fn'
import SearchInput from '../js/searchInput'
import Icon from 'react-native-vector-icons/FontAwesome';
import Icons from 'react-native-vector-icons/Feather';
const MAX_length = 13
export default class SearchComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            opacity: 1,
            searchStorage: [],
            hotKey:[]
        }
        this.num =12
        this.page = 0
        this.hotKeyTotal = []
        storage.load({key: "searchStorage"}).then((res) => {
            let searchStorage = res.split('#')
            this.setState({
                searchStorage: searchStorage
            })
        }).catch((err) => {})
    }

    searchQuery(reqText) {
        this.setState({
            loading: true,
            opacity: 0
        })
        var movies = [];
        getSearch({key: reqText,pageNum:1,pageSize:50}).then((res) => {
            movies = movies.concat(res.data.docinfos)
        }).then(() => {
            getSearch({q: reqText},1).then((res) => {
                movies = movies.concat(res.subjects)
                this.goToNext(reqText,movies)
            }).catch(() => {
                this.goToNext(reqText,movies)
            })
        })
    }
    goToNext(reqText,movies){
        let {navigate} = this.props.navigation;
        this.setState({
            loading: false,
            opacity: 1,
        })
        this.saveOneSearch(reqText)
        navigate('searchRes', {
            title: reqText,
            movies: movies,
            text:reqText
        })
    }
    savSearchState(arr) {
        this.setState({
            searchStorage: arr
        })
        storage.save({
            key: 'searchStorage',
            data: arr.join('#'),
        });
    }
    saveOneSearch(reqText) {
        let arr = this.state.searchStorage.concat();
        insetSearch(arr, reqText, MAX_length)
        this.savSearchState(arr)
    }
    deleAllStorage() {
        this.setState({
            searchStorage: []
        })
        storage.remove({
            key: 'searchStorage'
        })
    }
    deleOneStorage(item) {
        let arr = this.state.searchStorage.concat();
        deleteOneSearch(arr,item)
        this.savSearchState(arr)
    }
    componentWillMount() {
        this._getHotKey()
    }
    componentDidMount() {
        this.subscription = DeviceEventEmitter.addListener('submitEditing', (text)=> {
            this.searchQuery(text)
        })
    }
    componentWillUnmount() {
        this.subscription.remove()
    }
    _getHotKey() {
        getiqyHotKey().then((res) =>{
            this.hotKeyTotal =  this.hotKeyTotal.concat(res.data)
            this.setHotKeyState()
            /*console.log(this.hotKeyTotal)*/
        }).catch(err => {
            console.log(err)
        })
        getqqHotKey().then((res) =>{
            this.hotKeyTotal =  this.hotKeyTotal.concat(res.words)
            this.setHotKeyState()
            /*console.log(this.hotKeyTotal)*/
        }).catch(err => {
            console.log(err)
        })
    }
    setHotKeyState() {
        var arr = []
        for(var i=0;i<this.num;i++){
            var k = this.page*this.num + i;
            if(this.hotKeyTotal[k]){
                arr.push(this.hotKeyTotal[k])
            }
        }
        this.setState({
            hotKey: arr
        })
    }
    refreshHotKey(){
        this.page ++ ;
        var totalLength = this.hotKeyTotal.length;
        var mPage = totalLength%this.num
        var pPage = Math.floor(totalLength/this.num)
        var maxPage =  mPage?pPage+1:pPage
        if(this.page>=maxPage){
            this.page = 0
        }
        this.setHotKeyState()
    }
    _rendItem = (item, index) => {
        return (
            <View style={{paddingRight: 22, paddingTop: 12}} key={index}>
                <TouchableHighlight
                    activeOpacity={0.8}
                    underlayColor='#80cbc4'
                    onPress={()=> {
                        this.searchQuery(item)
                    }}>
                    <Text style={styles2.searchHist}>{item}</Text>
                </TouchableHighlight>
                <Icons name="x-circle" style={{position: 'absolute', right: 8, top: 0}}
                       onPress={() => {this.deleOneStorage(item)}}
                       size={20} color="#c5cae9"/>
            </View>
        )
    }
    _rendHotItem = (item, index) => {
        return (
            <View style={{ paddingTop: 10,width:deviceWidth/2}} key={index}>
                <TouchableHighlight
                    activeOpacity={0.8}
                    underlayColor='#eee'
                    onPress={()=> {
                        this.searchQuery(item.query||item.c_title)
                    }}>
                    <View style={{flexDirection: 'row', justifyContent: 'flex-start',paddingTop:10,paddingBottom:10}}>
                        <Text style={[styles2.searchIndex,{marginLeft:20},index==0?styles2.searchIndex0:index==1?styles2.searchIndex1:index==2?styles2.searchIndex2:{}]}>{index+1}</Text>
                        <Text style={[styles2.searchHot,{flex:1}]}>{item.query||item.c_title}</Text>
                    </View>
                </TouchableHighlight>
            </View>
        )
    }
    render() {
        return (
            <View style={[styles.container, {paddingTop: 5}]}>
                <ScrollView>
                    <SearchInput
                        opacity={this.state.opacity}
                        loading={this.state.loading}/>
                    {this.state.searchStorage.length ? <View style={[styles2.viewItem, {flexDirection: 'row',marginTop:20}]}>
                        <Text style={[styles2.ViewTitle, {flex: 1}]}>搜索历史</Text>
                        <TouchableHighlight
                            style={{alignItems: 'center', width: 40}}
                            activeOpacity={0.8}
                            underlayColor='#D1C4E9'
                            onPress={()=> {
                                Alert.alert(
                                    '温馨提示',
                                    '你确定要删除全部记录吗？',
                                    [
                                        {text: '取消', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                                        {text: '删除', onPress: () => this.deleAllStorage()},
                                    ],
                                    {cancelable: false}
                                )
                            }}>
                            <Icon name="trash-o" size={20} color="#6435c9"/>
                        </TouchableHighlight>
                    </View> : null}
                    <View style={[styles2.viewItem, {flexWrap: "wrap"}]}>
                        {
                            this.state.searchStorage.map((item, index) => {
                                return this._rendItem(item, index)
                            })
                        }
                    </View>
                    <View style={[styles2.viewItem, {flexDirection: 'row',marginTop:30}]}>
                        <Text style={[styles2.ViewTitle, {flex: 1}]}>热门搜索</Text>
                        <TouchableHighlight
                            style={{alignItems: 'center', width: 40}}
                            activeOpacity={0.8}
                            underlayColor='#D1C4E9'
                            onPress={()=>{
                                this.refreshHotKey()
                            }}>
                            <Icons name="refresh-cw" size={20} color="#6435c9"/>
                        </TouchableHighlight>
                    </View>
                    <View style={[{flexDirection: 'row', justifyContent: 'flex-start',flexWrap: "wrap",marginBottom:20}]}>
                        {
                            this.state.hotKey.map((item, index) => {
                                return this._rendHotItem(item, index)
                            })
                        }
                    </View>
                </ScrollView>
            </View>
        )
    }
}
const styles2 = StyleSheet.create({
    searchHot:{
        height: 20,
        lineHeight: 20,
        color: '#6435c9',
        opacity:0.7
    },
    searchIndex0:{
        backgroundColor: '#e92600',
        color: '#fff',
        fontSize:14
    },
    searchIndex1:{
        backgroundColor: '#ff8000',
        color: '#fff',
        fontSize:14
    },
    searchIndex2:{
        backgroundColor: '#fdc000',
        color: '#fff',
        fontSize:14
    },
    searchIndex:{
        backgroundColor: '#ccc',
        color: '#878787',
        width: 20,
        height: 20,
        lineHeight: 20,
        alignSelf: 'center',
        textAlign: 'center',
        marginRight: 5
    },
    viewItem: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        paddingLeft: 10,
        paddingRight: 10,
        marginTop: 8
    },
    ViewTitle: {
        fontSize: 16,
        color: '#6435c9'
    },
    searchHist: {
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 7,
        paddingBottom: 7,
        backgroundColor: '#b388ff',
        color: '#fff',
        fontSize: 14,
        borderRadius: 8
    }
})
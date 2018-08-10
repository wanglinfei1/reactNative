/**
 * Created by wanglinfei on 2017/10/24.
 */
import React, {Component} from 'react'
import {Modal,View, Text, ListView,StyleSheet,TouchableOpacity} from 'react-native'
import {singerData} from '../js/singerData'
import {connect} from 'react-redux'
import {serverUrl} from '../js/fn'
const singerItemHeight = 46;
const singerHeaderItemHeight = 28;
class UserComponent extends Component {
    constructor(props) {
        super(props);
        let getSectionData = (dataBlob, sectionID) => {
            return dataBlob[sectionID]
        }
        let getRowData = (dataBlob, sectionID, rowID) => {
            return dataBlob[sectionID + ':' + rowID]
        }
        this.listHeight = [];
        this.listHeaderHeight=[];
        this.dataBlob = {};
        this.blobData=[];
        this.sectionIDs = [];
        this._name=[];
        this.state = {
            fixTop:0,
            activeStyle:[],
            headerIndex:0,
            dataSource: new ListView.DataSource({
                getSectionData: getSectionData,
                getRowData: getRowData,
                rowHasChanged: (r1, r2) => r1 !== r2,
                sectionHeaderHasChanged: (s1, s2) => s1 !== s2
            })
        }
    }
    componentWillMount() {
        this.loadDataFromJson()
        this.calcHeight()
        this.setState({
            activeStyle:this.getArr(0)
        })
    }
    getArr(i){
        let arr=new Array(singerData.length)
        arr[i]={color:'#673ab7'}
        return arr;
    }
    componentDidMount() {
        //console.log(this.listHeaderHeight)
    }
    loadDataFromJson() {
        let rowIDs = [],
            singers = [];
        for(var i=0; i < singerData.length; i++){
            this.sectionIDs.push(i)
            this.dataBlob[i]=singerData[i].title
            singers=singerData[i].list
            rowIDs[i] = []
            this.blobData.push({key:i+''})
            for(var j=0;j<singers.length;j++){
                rowIDs[i].push(j)
                this.dataBlob[i+':'+j]=singers[j]
                this.blobData.push({key:i+':'+j})
            }
        }
        this.setState({
            dataSource:this.state.dataSource.cloneWithRowsAndSections(this.dataBlob,this.sectionIDs,rowIDs)
        })
    }
    calcHeight() {
        let height = 0
        let blobData=this.blobData
        for (let i=0;i<blobData.length;i++) {
            var nowData=blobData[i].key;
            if(nowData.indexOf(':')!==-1){
                height+=(singerItemHeight);
            }else{
                height+=(singerHeaderItemHeight);
                if(i===0){height=0;}
            }
            if(nowData.indexOf(':')==-1){
                this.listHeaderHeight.push(height)
            }
            this.listHeight.push(height)
        }
    }
    _onScrolll(e) {
        let newY = e.nativeEvent.contentOffset.y
        const listHeight = this.listHeaderHeight
        for (var i = 0; i < listHeight.length-1; i++) {
            var height1 = listHeight[i]
            var height2 = listHeight[i + 1]
            if (newY >= height1 && newY < height2) {
                this.setState({headerIndex:i, activeStyle:this.getArr(i)})
                let diff = height2 - newY
                this.diff(diff)
                return
            }else if (newY > listHeight[listHeight.length - 2]) {
                let currentIndex=listHeight.length - 1
                this.setState({headerIndex:currentIndex, activeStyle:this.getArr(currentIndex)})
            }
        }
    }
    diff(diff){
        if(diff>0&&diff<singerItemHeight){
            this.setState({fixTop:diff-singerItemHeight})
        }else{
            if(this.state.fixTop == 0){return;}
            this.setState({fixTop:0})
        }
    }
    ItemRowClick(rowData){
        let {navigate}=this.props.navigation;
        console.log(rowData)
        var type=1;
        var url = type?('https://y.qq.com/n/yqq/singer/'+rowData.id+'.html#stat=y_new.singerlist.singerpic'):(serverUrl+"/vueMusic/#/singer/"+rowData.id)
        navigate('WebViewComponent',{singerData:rowData,mobile_url:url})
    }
    singerItemRow(rowData, sectionID, rowID, highlightRow){
        return(
            <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                    this.ItemRowClick(rowData)
                }}>
                <View style={styles.singerItem}>
                    <Text style={styles.singer}>{rowData.name}</Text>
                </View>
            </TouchableOpacity>

        )
    }
    singerHeader(sectionData,sectionID){
        let actionStyle=0 === sectionID?{height:0,borderBottomWidth:0}:null;
        return(
            <View style={[styles.singerHeaderItem,actionStyle]} key={sectionID} ref={(e) => this["list"+sectionID] = e}>
                <Text style={styles.singerHeader}>{sectionData}</Text>
            </View>
        )
    }
    rightListClick(index){
        this.refs.listView.scrollTo({y:this.listHeaderHeight[index]})
    }
    rightList() {
        return singerData.map((item,index) => {
            return (
                <TouchableOpacity key={index}
                                  activeOpacity={0.7}
                                  onPress={()=>{
                                      this.rightListClick(index)
                                  }}>
                    <View style={styles.rightItem}>
                        <Text style={[styles.rightTitle,this.state.activeStyle[index]]}>{item.title.substr(0,1)}</Text>
                    </View>
                </TouchableOpacity>
            )
        })
    }
    render() {
        return (
            <View style={{flex:1}}>
                <View style={{flex:1}}>
                    <View style={[styles.singerHeaderItem]}>
                        <Text style={{color:'#6435c9',}}>{singerData[this.state.headerIndex].title}</Text>
                    </View>
                    <View style={{flex:1}}>
                        <ListView
                            ref="listView"
                            dataSource={this.state.dataSource}
                            renderRow={this.singerItemRow.bind(this)}
                            renderSectionHeader={this.singerHeader.bind(this)}
                            onScroll ={this._onScrolll.bind(this)}
                        />
                    </View>
                </View>
                <View style={styles.rightList}>
                    {this.rightList()}
                </View>
            </View>

        )
    }
}
const styles = StyleSheet.create({
    singerHeaderItem:{
        borderBottomWidth:1,
        /*backgroundColor:'#F5FCFF',*/
        backgroundColor:'rgba(0,188,100,0.1)',
        borderColor:'rgba(100,53,201,0.1)',
        height:singerHeaderItemHeight,
        paddingLeft:8,
        justifyContent:'center'
    },
    singerHeader:{
        color:'#6435c9',
    },
    singerItem:{
        borderBottomWidth:1,
        borderColor:'rgba(100,53,201,0.1)',
        height:singerItemHeight,
        paddingLeft:38,
        justifyContent:'center'
    },
    singer:{
        fontSize:14,
       /* color:'#4F8EF7'*/
    },
    rightList:{
        flex:0,
        position:"absolute",
        top:'50%',
        marginTop:-190,
        borderRadius:13,
        paddingTop:4,
        paddingBottom:4,
        right:2,
        width:20,
        backgroundColor:"rgba(0,188,100,0.1)",
        flexDirection:'column'
    },
    rightItem:{
        justifyContent:'center',
        alignItems:'center',
        marginTop:0
    },
    rightTitle:{
        color:'#4F8EF7',
        fontSize:12
    }
})
const mapStateToProps = state => ({
    mathStore: state.mathStore
})
export default connect(mapStateToProps)(UserComponent)

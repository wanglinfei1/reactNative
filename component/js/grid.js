/**
 * Created by wanglinfei on 2017/10/24.
 */
import React,{Component} from 'react'
import {View,Text,ListView,TouchableOpacity,StyleSheet,Dimensions,Image} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome';

const {width:screenWidth,height:screenHeight}=Dimensions.get('window');
const cols = 3;
const callWH = 70;
const vMargin = (screenWidth-callWH*cols)/(cols+1);
const hMargin = 10;
export default class GridComponent extends Component {
    static defaultProps={
        gridClick:(item) => console.log(item),
        listData:[],
    }
    constructor(props) {
        super(props)
    }
    iconRender(item){
        if(item.imgUrl){
            return <Image style={item.style} source={{uri:item.imgUrl}}></Image>
        } else if(item.iconType){
            return <item.iconType name={item.icon} size={40} color={item.color}></item.iconType>
        }else{
            return <Icon name={item.icon} size={40} color={item.color}></Icon>
        }
    }
    renderRow(item) {
        return (
            <TouchableOpacity
                style={{width:callWH,height:callWH,marginTop:hMargin,marginLeft:vMargin,alignItems:'center'}}
                onPress={() => {
                    this.props.gridClick(item)
                }}
                activeOpacity={0.6}>
                <View style={{justifyContent:"center",alignItems:"center"}}>
                    {this.iconRender(item)}
                </View>
            </TouchableOpacity>
        )
    }
    render(){
        let ds=new ListView.DataSource({
            rowHasChanged:(r1,r2)=>r1!==r2
        })
        let listData=ds.cloneWithRows(this.props.listData)
        return (
            <ListView
                dataSource={listData}
                renderRow={this.renderRow.bind(this)}
                contentContainerStyle={styles.listView}
            />
        )
    }
}
const styles= StyleSheet.create({
    listView:{
        flexDirection:'row',
        flexWrap:'wrap',
        marginTop:24
    }
})
/**
 * Created by wanglinfei on 2017/10/18.
 */
import {StyleSheet} from 'react-native'

export const styles = StyleSheet.create({
    tab: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
        overflow:'hidden'
    },
    button:{
        padding: 10,
        borderColor: 'blue',
        borderWidth: 1,
        borderRadius: 5
    },
    item:{
        flexDirection:'row'
    },
    image:{
        width:80,
        height:120
    },
    container:{
        flex:1,
        flexDirection:'column'
    },
    loading:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
    },
    item_container:{
        paddingLeft:12,
        borderBottomWidth:1,
        paddingBottom:6,
        paddingTop:6,
        borderColor:'rgba(100,53,201,0.3)',
        flexDirection:'row'
    },
    itemContent:{
        flex:1,
        marginLeft:13,
        marginTop:6
    },
    itemHeader:{
        fontSize:16,
        fontFamily:'Helvetica Neue',
        fontWeight:'300',
        color:'#6435c9',
        marginBottom:6
    },
    itemCasts:{
        fontSize:14,
        color:'rgba(0,0,0,0.6)',
        marginBottom:6
    },
    redText:{
        color:'#bb2828',
        fontSize:13
    },
    headerStyle:{
        backgroundColor: "rgba(245,252,255,0.5)",
        height: 40,
        elevation: 0
    },
    headerTitleStyle: {
        alignSelf: 'center',
        color: '#6435c9',
        fontSize: 16
    },
    headerLeft:{
        paddingLeft:5
    },
    headerRight:{
        paddingRight:15,
        marginTop:-2
    }
})
/**
 * Created by wanglinfei on 2017/10/20.
 */
import React,{Component} from 'react'
import {View,Text,TextInput,ActivityIndicator,DeviceEventEmitter} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome';

export default class SearchInput extends Component{
    static defaultProps={
        opacity:1,
        loading:false,
    }
    constructor(props){
        super(props);
        this.state={
            text:''
        }
    }
    searchEmit(){
        this.setState({text:''})
        DeviceEventEmitter.emit('submitEditing',this.state.text)
    }
    render(){
        const myIcon = (<Icon name="close"
                              size={20}
                              style={{opacity:this.props.opacity}}
                              onPress={() => {
                                  this.setState({text:''})
                              }}
                              color="#6435c9" />)
        return(
            <View style={{
                paddingLeft:7,
                paddingRight:7,
                borderColor:"rgba(100,53,201,0.1)",
                borderBottomWidth:1,
                flexDirection:'row',
                alignItems:"center",
                justifyContent:"center"
            }}>
                <TextInput
                    placeholder="输入你要搜索的内容"
                    placeholderTextColor="#6435c9"
                    underlineColorAndroid='transparent'
                    autoFocus={false}
                    style={{height: 50,flex:1}}
                    autoCorrect={false}
                    onChangeText={(text) => {
                        this.setState({text})
                    }}
                    onSubmitEditing={this.searchEmit.bind(this)}
                    value={this.state.text}
                />
                {
                    this.state.text?myIcon:null
                }
                {
                    this.props.loading?
                        <ActivityIndicator
                            styleAttr='small'
                            style={{width:40}}
                            color="#6435c9"
                            size={30}/>:null
                }
            </View>
        )
    }
}
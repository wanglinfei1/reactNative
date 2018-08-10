/**
 * Created by wanglinfei on 2017/10/18.
 */
import React, { Component } from 'react';
import {
    View,
    Text,
    Platform,
    ActivityIndicator,
    StyleSheet,
    Modal,
} from 'react-native';


export default class Loading extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            OS:Platform.OS
        };
    }
    static defaultProps={
        color:'#6435c9',
        size:50
    }
    render() {
        if(this.state.OS=='android'){
            return (
                <View style={styles.loadingBox}>
                    <ActivityIndicator
                        styleAttr='LargeInverse'
                        color={this.props.color}
                        size={this.props.size}/>
                </View>
            )
        }else{
            return (
                <View style={styles.loadingBox}>
                    <ActivityIndicatorIOS
                        color={this.props.color}
                        size={this.props.size}
                    />
                </View>
            )
        }
    }

}
const styles=StyleSheet.create({
    loadingBox: {
        flex:1,
        alignItems:'center',
        justifyContent:'center',
    }
});

/**
 * Created by wanglinfei on 2017/10/20.
 */
import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
} from 'react-native';
import Loading from './loading'
export default class LoadMoreFooter extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <View style={styles.footer}>
                {
                    this.props.isLoadAll?
                        <Text style={styles.footerTitle}>已加载全部</Text>
                        :<Loading size={30}/>
                }

            </View>
        )
    }
}
const styles = StyleSheet.create({
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: 60,
        paddingBottom:10
    },
    footerTitle: {
        marginLeft: 10,
        fontSize: 15,
        color: '#6435c9',
    }
})

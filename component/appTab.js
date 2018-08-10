/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {Platform, Text, View} from 'react-native';
import TabNavigator from 'react-native-tab-navigator'
import Icon from 'react-native-vector-icons/FontAwesome';
import {connect} from 'react-redux'
import {styles} from './css/styles'
import Featrured from './view/featured'
import USBox from './view/USBox'
import Search from './view/search'
import Home from './view/Home'

class AppTab extends Component {
    constructor(props) {
        super(props);
        this.height=this.props.mathStore.result;
        this.state = {
            selectedTab: 'Home',
        }
    }
    shouldComponentUpdate(nextProps,nextSate) {
        return true;
    }
    componentWillUpdate(nextProps, nextState){
        let height=nextProps.mathStore.result;
        this.height=height;
    }
    render() {
        return (
            <TabNavigator
                hidesTabTouch={true}
                sceneStyle={{backgroundColor:'green', paddingBottom:this.height}}
                tabBarShadowStyle={{backgroundColor:'green'}}
                tabBarStyle={[styles.tab,{height:this.height}]}>
                <TabNavigator.Item
                    selected={this.state.selectedTab === 'Home'}
                    title="首页"
                    titleStyle={{color: "#4F8EF7", fontSize: 12}}
                    selectedTitleStyle={{color: "#6435c9"}}
                    renderIcon={()=><Icon name="home" size={20} color="#4F8EF7"/>}
                    renderSelectedIcon={()=><Icon name="home" size={20} color="#6435c9"/>}
                    onPress={()=>this.setState({selectedTab: 'Home'})}>
                    <Home/>
                </TabNavigator.Item>
                <TabNavigator.Item
                    selected={this.state.selectedTab === 'List'}
                    title="推荐电影"
                    titleStyle={{color: "#4F8EF7", fontSize: 12}}
                    selectedTitleStyle={{color: "#6435c9"}}
                    renderIcon={()=><Icon name="star" size={20} color="#4F8EF7"/>}
                    renderSelectedIcon={()=><Icon name="star" size={20} color="#6435c9"/>}
                    onPress={()=>this.setState({selectedTab: 'List'})}>
                    <Featrured/>
                </TabNavigator.Item>
                <TabNavigator.Item
                    selected={this.state.selectedTab === 'USBox'}
                    title="榜单"
                    titleStyle={{color: "#4F8EF7", fontSize: 12}}
                    selectedTitleStyle={{color: "#6435c9"}}
                    renderIcon={()=><Icon name="list-ul" size={20} color="#4F8EF7"/>}
                    renderSelectedIcon={()=><Icon name="list-ul" size={20} color="#6435c9"/>}
                    onPress={()=>this.setState({selectedTab: 'USBox'})}>
                    <USBox/>
                </TabNavigator.Item>
                <TabNavigator.Item
                    selected={this.state.selectedTab === 'Search'}
                    title="搜索"
                    titleStyle={{color: "#4F8EF7", fontSize: 12}}
                    selectedTitleStyle={{color: "#6435c9"}}
                    renderIcon={()=><Icon name="search" size={20} color="#4F8EF7"/>}
                    renderSelectedIcon={()=><Icon name="search" size={20} color="#6435c9"/>}
                    onPress={()=>this.setState({selectedTab: 'Search'})}>
                    <Search/>
                </TabNavigator.Item>

            </TabNavigator>
        );
    }
}
const mapStateToProps = state => ({
    mathStore:state.mathStore
})
export default connect(mapStateToProps)(AppTab)


/**
 * Created by wanglinfei on 2017/10/24.
 */
import React, {Component} from 'react';
import {View} from 'react-native'
import {TabNavigator,TabBarTop} from 'react-navigation';
import ImageTest from './imageTest'
import TestComponent from './testComponent'
import UserComponent from './userComponent'
import HomeComponent from './homeComponent'

export const Tab = TabNavigator({
        Home: {
            screen: HomeComponent,
            navigationOptions: ({navigation}) => ({
                tabBarLabel: '首页',
            }),
        },
        user: {
            screen: UserComponent,
            navigationOptions: ({navigation}) => ({
                tabBarLabel: '歌手',
            }),
        },
        test: {
            screen: TestComponent,
            navigationOptions: ({navigation}) => ({
                tabBarLabel: '测试',
            }),
        }
    },
    {
        initialRouteName:'user',
        tabBarComponent: TabBarTop,
        tabBarPosition: 'top',
        swipeEnabled: true,
        animationEnabled: true,
        scrollEnabled:true,
        lazy: true,
        tabBarOptions: {
            pressOpacity:0.8,
            pressColor:'#6435c9',
            activeTintColor: '#6435c9',
            inactiveTintColor: '#4F8EF7',
            style: {backgroundColor: '#F5FCFF',height:48,marginTop:-8},
            labelStyle: {
                fontSize: 16,
                alignItems:"center",
                justifyContent:"center"
            },
            indicatorStyle:{
                backgroundColor: '#F5FCFF',
                opacity:0.4
            }
        }
    });

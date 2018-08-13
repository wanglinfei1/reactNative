import React, {Component} from 'react'
import {View} from 'react-native'
import {DrawerNavigator} from 'react-navigation';
import { connect } from 'react-redux';
export const Navigator = DrawerNavigator({

})
class Drawer extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <Navigator/>
        )
    }
}
const mapStateToProps = state =>({
    mathStore:state.mathStore
})
export default connect(mapStateToProps)(Drawer)

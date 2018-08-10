/**
 * Created by wanglinfei on 2017/10/18.
 */
import React, {Component,PropTypes} from 'react';
import {View,Text,StyleSheet,
    TouchableWithoutFeedback,
    ScrollView,Image,
    Animated,Dimensions} from 'react-native'

let {height: deviceHeight, width: deviceWidth} = Dimensions.get('window');
export default class ScrollTab extends Component{
    static defaultProps={
        imageData:['#cddc39','#8bc34a','#259b24','#009688','#00bcd4','#03a9f4'],
        selectedImageIndex:0,
        defaultTime:4000,
        height:180,
        renderScroll:() =>{}
    };
    constructor(props){
        super(props);
        this.state={
            selectedImageIndex:this.props.selectedImageIndex
        };
        this._index=0;
        this._max=this.props.imageData.length;
        this._timer=null;
    }
    _onScrollBeginDrag(){
        clearInterval(this._timer)
    }
    _onScroll(e){
        this._contentOffsetX=e.nativeEvent.contentOffset.x;
        this._index=Math.round(this._contentOffsetX/deviceWidth)
    }
    _onMomentumScrollEnd() {
        this._scrollView.scrollTo({x:this._index*deviceWidth},true)
        this.setState({
            selectedImageIndex:this._index
        })
        this._runFocusImage();
    }
    _onScrollEndDrag() {

    }
    _runFocusImage(){
        if(this._max <= 1){
            return;
        }
        clearInterval(this._timer)
        this._timer = setInterval(function () {
            this._index++;
            if(this._index >= this._max){
                this._index = 0;
            }
           this._onMomentumScrollEnd()
        }.bind(this), this.props.defaultTime);
    }
    componentDidMount() {
        this._runFocusImage();
    }
    componentWillUnmount(){
        clearInterval(this._timer)
    }
    render() {
        return (
            <View style={styles.container}>
                <ScrollView
                    ref={(scrollView)=>this._scrollView=scrollView}
                    horizontal={true}
                    pagingEnabled={true}
                    onScroll={this._onScroll.bind(this)}
                    onMomentumScrollEnd={()=>this._onMomentumScrollEnd()}
                    onScrollBeginDrag={()=>this._onScrollBeginDrag()}
                    onScrollEndDrag={()=>this._onScrollEndDrag()}
                    onScrollAnimationEnd={()=>console.log('animationEnd')}
                    showsHorizontalScrollIndicator={false}>
                    <Animated.View style={{flexDirection:'row',height:this.props.height}}>{this.props.renderScroll(this.props.imageData)}</Animated.View>
                </ScrollView>
                <View style={{flexDirection:'row',position:'absolute',bottom:15,left:10}}>{this.circles()}</View>
            </View>
        )
    }
    _circlesClick(i){
        clearInterval(this._timer)
        this._index=i;
        this._onMomentumScrollEnd()
    }
    circles() {
        return this.props.imageData.map((value,i)=>{
            return (<TouchableWithoutFeedback key={i}
                          onPress={()=>{this._circlesClick(i)}}>
                <View style={(i == this.state.selectedImageIndex) ? styles.circleSelected : styles.circle}></View>
            </TouchableWithoutFeedback>);
        })
    }
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: '#F5FCFF',
    },
    circleContainer: {
        position:'absolute',
        left:0,
        top:120,
    },
    circle: {
        width:10,
        height:10,
        borderRadius:10,
        backgroundColor:'#f4797e',
        marginHorizontal:5,
    },
    circleSelected: {
        width:10,
        height:10,
        borderRadius:10,
        backgroundColor:'#ffffff',
        marginHorizontal:5,
    }
});
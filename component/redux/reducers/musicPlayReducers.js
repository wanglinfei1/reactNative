/**
 * Created by wanglinfei on 2017/11/3.
 */
import  * as Type from'../type/type';

//初始化
const initState = {
    disType: ''
};

export default function musicPlayReducer(state = initState, action = {}) {
    switch (action.type) {
        case Type.MUSIC_PLAY:
            console.log('---> mathReducer action.type ' + action.type);
            return {...state, disType: action.disType};
            break;
        default:
            return state;
    }
}
/**
 * Created by wanglinfei on 2017/10/24.
 */
import  * as Type from'../type/type';

//初始化
const initState = {
    result: 50
};

export default function mathReducer(state = initState, action = {}) {
    switch (action.type) {
        case Type.TAB_TYPE:
            console.log('---> mathReducer action.type ' + action.type);
            return {...state, result: action.result?50:0};
            break;
        default:
            return state;
    }
}
/**
 * Created by wanglinfei on 2017/10/24.
 */
// action类型
import * as types from '../type/type';

// 每一个action方法返回一个新的"state"对象,他就是应用当前的状态
export function changeTabState(intvalue) {
    return {
        type: types.TAB_TYPE,
        result: intvalue,
    }
};
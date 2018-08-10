/**
 * Created by wanglinfei on 2017/11/3.
 */
import * as types from '../type/type';

// 每一个action方法返回一个新的"state"对象,他就是应用当前的状态
export function changeMusicPlayState(intvalue) {
    return {
        type: types.MUSIC_PLAY,
        disType: intvalue,
    }
};
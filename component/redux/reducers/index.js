/**
 * Created by wanglinfei on 2017/10/24.
 */
import  mathReducer from './tabReducers';
import musicPlayReducer from './musicPlayReducers'
import  {combineReducers} from 'redux';

const rootReducer=combineReducers({
    mathStore:mathReducer,
    musicPlayReducer:musicPlayReducer
});
export default  rootReducer;
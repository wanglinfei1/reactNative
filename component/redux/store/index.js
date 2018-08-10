/**
 * Created by wanglinfei on 2017/10/24.
 */
import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import rootReducer from'../reducers/index';
const createSoreWithMiddleware = applyMiddleware(thunk)(createStore);

 const configureStore =initialState =>{
    return createSoreWithMiddleware (rootReducer, initialState);
};
const store = configureStore()
export default store;
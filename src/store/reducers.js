import {combineReducers} from 'redux'
import userReducer from '../pages/user/reducer'; 
import AttendenceReducer from "../pages/record/reducer"
const rootReducer = combineReducers({
        userStore:userReducer ,
        recordStore:AttendenceReducer
        
               
    });
    

    export default rootReducer;
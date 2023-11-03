// import axios from 'axios'
import * as actiontype from "./constant"
import * as constants from '../../util/Constant';
import { Get,Post,Put} from '../../util/HttpService'
 
export function getAllRecord() {
    return (dispatch) => {
        const url = `${constants.baseURL}/attendenceData`
        Get(url).then(response => {
            // const reversedRecord = response.data.reverse(); // Reverse the array of users
                dispatch(getRecordSuccess(response.data));
            })
            .catch(error => dispatch(getRecordError(error.response.data)))
    }
}
export function getRecordSuccess(payload) {
    return { type: actiontype.GET_ATTENDENCE_RECORD_SUCCESS, payload }
}
export function getRecordError(payload) {
    return { type: actiontype.GET_ATTENDENCE_RECORD_ERROR, payload }
}

// ADD
export function addRecord(data) {
    return (dispatch) => {
        const url = `${constants.baseURL}/attendenceData`
         Post(url, data).then(response => dispatch(addRecordSuccess(data)))
            .catch(error => dispatch(addRecordError(error.response.data)))
    }
}

export function addRecordSuccess(payload) {
    return { type: actiontype.ADD_ATTENDENCE_RECORD_SUCCESS, payload }//action object
}

export function addRecordError(payload) {
    return { type: actiontype.ADD_ATTENDENCE_RECORD_ERROR, payload }
}


// UPDATE record
export function updateRecord(data) {

    return (dispatch) => {
        const url = `${constants.baseURL}/attendenceData/${data.id}`
         Put(url, data).then(response => dispatch(UpdateRecordSuccess(data)))
            .catch(error => dispatch(UpdateRecordError(error.response.data)))
    }
}

export function UpdateRecordSuccess(payload) {
    return { type: actiontype.UPDATE_ATTENDENCE_RECORD_SUCCESS, payload }//action object
}

export function UpdateRecordError(payload) {
    return { type: actiontype.UPDATE_ATTENDENCE_RECORD_ERROR, payload }
}

export function getSingleReocrd(id) {
    return { type: actiontype.SINGLE_ATTENDENCE_RECORD_SUCCESS, payload: id }//action object
}


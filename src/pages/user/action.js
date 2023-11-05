
import * as constant from './constant'
import * as constants from '../../util/Constant'
import { Delete, Get, Post, Put } from '../../util/HttpService'

 
//GET User
export function getAlluser() {
    return (dispatch) => {
        const url = `${constants.baseURL}/user`;

        Get(url)
            .then(response => {
                const reversedUsers = response.data.reverse(); // Reverse the array of users
                dispatch(getusersuccess(reversedUsers));
            })
            .catch(error => dispatch(getuserError(error.response.data)));
    };
}


export function getusersuccess(payload) {
    return { type: constant.GET_USER_SUCCESS, payload }//action object
}

export function getuserError(payload) {
    return { type: constant.GET_USER_ERROR, payload }
}

// POST User
export function addUser(data) {
    return (dispatch) => {
        const url = `${constants.baseURL}/user`
         Post(url, data).then(response => dispatch(addusersuccess(data)))
            .catch(error => dispatch(adduserError(error.response.data)))
    }
}

export function addusersuccess(payload) {
    return { type: constant.ADD_USER_SUCCESS, payload }//action object
}

export function adduserError(payload) {
    return { type: constant.ADD_USER_ERROR, payload }
}

// UPDATE User
export function updateUser(data) {

    return (dispatch) => {
        const url = `${constants.baseURL}/user/${data.id}`
         Put(url, data).then(response => dispatch(updateusersuccess(data)))
            .catch(error => dispatch(updateuserrror(error.response.data)))
    }
}


export function updateusersuccess(payload) {
    return { type: constant.UPDATE_USER_SUCCESS, payload }//action object
}

export function updateuserrror(payload) {
    return { type: constant.UPDATE_USER_ERROR, payload }
}

// DELETE User
export function deleteUser(id) {
    return (dispatch) => {
        const url = `${constants.baseURL}/user/${id}`
         Delete(url).then(response => dispatch(deleteusersuccess(id)))
            .catch(error => dispatch(deleteuserError(error.response.data)))
    }
}

export function deleteusersuccess(payload) {
    return { type: constant.DELETE_USER_SUCCESS, payload }//action object
}

export function deleteuserError(payload) {
    return { type: constant.DELETE_USER_ERROR, payload }
}

export function getSingleuser(id) {
    return { type: constant.SINGLE_USER_SUCCESS, payload: id }//action object
}
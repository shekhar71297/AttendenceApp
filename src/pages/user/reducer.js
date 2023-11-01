import * as constant from "./constant";

export const  initialState={
    allUser:[],
    user:{},
    error:null
}

export default function userReducer(state = initialState , action){

    switch (action.type) {
        case constant.GET_USER_SUCCESS:{
            
            return{...state,user:{},allUser:action.payload};
            
        }
    
        case constant.GET_USER_ERROR,
         constant.ADD_USER_ERROR,
         constant.UPDATE_USER_ERROR,
         constant.DELETE_USER_ERROR:{
            return{...state,user:{},error:action.payload};
         }

        case constant.ADD_USER_SUCCESS:{
             
            let allUser=state.allUser;
            allUser.push(action.payload);
            return{...state,user:{},allUser:allUser};
        }

        case constant.UPDATE_USER_SUCCESS:{
            const draft = state;
            const index = draft.allUser.findIndex((d)=>d.id===action.payload.id) || -1
            draft.allUser[index]=action.payload
            return draft;
            
        }

        case constant.DELETE_USER_SUCCESS:{
            // const draft = state;
            let allUser = state.allUser.filter((d)=>d.id!==action.payload)
            return {...state,allUser:allUser};
            
        }

        case constant.SINGLE_USER_SUCCESS:{
            // const draft = state;
            // const index = draft.allProducts.findIndex((d)=>d.id===action.payload) || -1
            // draft.product=draft.allProducts[index]
            // return draft;
            const index =state.allUser.findIndex(d=>d.id===action.payload);
            const user=state.allUser[index];
            return{...state,user:user};
            
        }


        default:
            return state;
    }
}
import *  as constant from './constant'
export const initialstate = {
    allrecord: [],
    record: {},
    error: null
}

export default function AttendenceReducer(state = initialstate, action) {
    switch (action.type) {
        case constant.GET_ATTENDENCE_RECORD_SUCCESS: {

            return { ...state, record: {}, allrecord: action.payload };
        }
        case constant.GET_ATTENDENCE_RECORD_ERROR,
        constant.ADD_ATTENDENCE_RECORD_ERROR: {

                return { ...state, record: {}, error: action.payload };

            }
        // Add Result
        case constant.ADD_ATTENDENCE_RECORD_SUCCESS: {

            let allrecord = state.allrecord;
            allrecord.push(action.payload);
            console.log("this is reducer data",allrecord);
            return { ...state, record: {}, allrecord: allrecord };
        }

        // update
        case constant.UPDATE_ATTENDENCE_RECORD_SUCCESS: {
            const draft = state;
            const index = draft.allrecord.findIndex((d) => d.id === action.payload.id) || -1
            draft.allrecord[index] = action.payload
            return draft;

        }
        case constant.SINGLE_ATTENDENCE_RECORD_SUCCESS:{
           
            const index =state.allrecord.findIndex(d=>d.id===action.payload);
            const record=state.allrecord[index];
            return{...state,record:record};
            
        }

        default:
            return state;
    }
}
import React, { Component } from 'react'


import * as recordAction from '../action';
import { connect } from 'react-redux';
import AttendenceTable from '../../../component/attendence/AttendenceTable';
export class AttendenceData extends Component {
    render() {
        return (
            <div>

                <AttendenceTable {...this.props} />

            </div>
        )
    }
}
// redux code
const mapStateToProps = (state) => ({
    allrecord: state.recordStore.allrecord,

});

const mapDispatchToprops = (dispatch) => ({
    initRecordRequest: () => dispatch(recordAction.getAllRecord()),
    addRecordRequest:(data)=>dispatch(recordAction.addRecord(data)),
    updateRecordRequest:(id)=>dispatch(recordAction.updateRecord(id))
    
});

export default connect(mapStateToProps, mapDispatchToprops)(AttendenceData);

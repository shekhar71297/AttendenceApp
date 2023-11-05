import React, { Component } from 'react'
import UserTable from '../../../component/user/UserTable';
import * as useraction from '../action'
import { connect } from 'react-redux';
import Login from '../../../component/user/Login';

const mapStateToProps = (state) => ({
  allUser: state.userStore.allUser,
  singleUser: state.userStore.user
});

const mapDispatchToProps = (dispatch) => ({
  initUserRequest: () => dispatch(useraction.getAlluser()),
  updateUserRequest: (data) => dispatch(useraction.updateUser(data)),
  addUserRequest: (data) => dispatch(useraction.addUser(data)),
  deleteUserRequest: (id) => dispatch(useraction.deleteUser(id)),
  getSingleUserRequest: (id) => dispatch(useraction.getSingleuser(id))

})

export default connect(mapStateToProps, mapDispatchToProps)(UserTable);
import React, { Component } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { TextField, Button, Grid, MenuItem, Radio, Typography, RadioGroup, FormControlLabel, FormControl, FormLabel } from '@mui/material';
import Box from '@mui/material/Box';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import * as TablePaginationActions from "../common/TablePagination"
import SearchIcon from '@mui/icons-material/Search';
import * as validation from '../../util/Validation';
import DialogBox from '../common/DialogBox';
import Switch from '@mui/material/Switch';



class UserTable extends Component {
  constructor(props) {
    super(props)

    this.state = {
      user: [],
      id: null,
      fname: "",
      lname: "",
      role: "",
      password: "",
      contact: "",
      gender: "",
      email: "",
      status:"offline",
      page: 0,
      rowsPerPage: 5,
      
      open: false,
      searchQuery: "",
      isAddUser: true,
      confirmDialogOpen: false,
      recordToDeleteId: null,
      snackbarOpen: false,
      snackbarMessage: '',
      assignWork: false,
      errors: {
        fnameError: false,
        lnameError: false,
        contactError: false,
        emailError: false,
        passwordError: false
      },
      showPassword: false,
      severity: "success",
      selectedUserdetail: "",
      isDetailsPopup: false
    }
  }


  componentDidUpdate(prevProps) {
    if (prevProps.allUser !== this.props.allUser) {
            this.setState({ user: this.props.allUser }, () => console.log("updated", this.state.user));
            // console.log("updated all exam data", this.props.allExam);
        }

    if (prevProps.singleUser !== this.props.singleUser) {
      const { id, fname, lname, role, password, contact, gender, email,assignWork,status } = this.props.singleUser;
      this.setState({
        id, fname, lname, role, password, contact, gender, email,assignWork,status
      })
    }
  }
  componentDidMount() {
    this.props.initUserRequest();
  }

  //search function
  handleSearchQueryChange = (event) => {
    this.setState({ searchQuery: event.target.value, page: 0 });
  };
  //  pagination function
  handleChangePage = (event, newPage) => {
    this.setState({ page: newPage });
  };

  handleChangeRowsPerPage = (event) => {
    this.setState({ rowsPerPage: parseInt(event.target.value, 10), page: 0 });
  };

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value }, () => {
      if (name === "fname") {
        const isFnameError = !(validation.isValidName(this.state[name]));
        this.setState({ errors: { ...this.state.errors, fnameError: isFnameError } })
      }

      if (name === "lname") {
        const isLnameError = !(validation.isValidName(this.state[name]));
        this.setState({ errors: { ...this.state.errors, lnameError: isLnameError } })
      }

      if (name === "contact") {
        const isContactError = !(validation.isValidContact(this.state[name]));
        this.setState({ errors: { ...this.state.errors, contactError: isContactError } })
      }

      if (name === "email") {
        const isEmailError = !(validation.isValidEmail(this.state[name]));
        this.setState({ errors: { ...this.state.errors, emailError: isEmailError } })
      }

      if (name === "password") {
        const isPasswordError = !(validation.isValidPassword(this.state[name]));
        this.setState({ errors: { ...this.state.errors, passwordError: isPasswordError } })
      }
    });

  }
  // to popup user details
  handleopenDetails = (record) => {
    this.setState({ isDetailsPopup: true, selectedUserdetail: record });
  };

  handlecloseDetails = () => {
    this.setState({ isDetailsPopup: false, selectedUserdetail: "" });
  };
  //to popup add and update form
  handleOpen = (id = null) => {

    if (id !== null) {
      this.getsinglerecord(id);
      this.setState({ open: true, isAddUser: false,id: id });
    } else {
      this.setState({ open: true, isAddUser: true });
      this.resetUserFormHandler();
    }

  };

  handleClose = () => {
    this.setState({ open: false });
  };

  // delete action
  confirmDelete = () => {
    const id = this.state.recordToDeleteId;
    this.props.initUserRequest();
    this.props.deleteUserRequest(id);
    this.closeConfirmDialog();
    this.setState({
      snackbarOpen: true,
      snackbarMessage: 'User deleted successfully',
      severity: 'error'
    });
  };

  deletedata = (id) => {
    this.openConfirmDialog(id);
  };

  openConfirmDialog = (id) => {
    this.setState({
      confirmDialogOpen: true,
      recordToDeleteId: id,

    });
  };

  closeConfirmDialog = () => {
    this.setState({
      confirmDialogOpen: false,
      recordToDeleteId: null,
    });
  };

  // single record 
  getsinglerecord = (id) => {
    this.props.getSingleUserRequest(id)
  }

  // update and add actions
  resetUserFormHandler = () => {
    this.setState({
      id: null,
      fname: "",
      lname: "",
      role: "",
      password: "",
      contact: "",
      gender: "",
      email: "",
      assignWork:true,
    })
  }

  updateuser = (event) => {
    event.preventDefault();

    if (this.state.errors.fnameError || this.state.errors.lnameError || this.state.errors.emailError || this.state.errors.contactError || this.state.errors.passwordError) {
      this.setState({
        snackbarOpen: true,
        snackbarMessage: "please fix validiation error before submiting", severity: "error"
      })
      return;
    }
    let uobj = {
      email: this.state.email,
      fname: this.state.fname,
      lname: this.state.lname,
      password: this.state.password,
      role: this.state.role,
      gender: this.state.gender,
      contact: this.state.contact,
      assignWork:this.state.assignWork
    };
    if (this.state.isAddUser) {
      this.props.addUserRequest(uobj);
      this.setState({
        snackbarOpen: true,
        snackbarMessage: 'User added successfully',
        severity: "success"
      });
      this.props.initUserRequest()
    } else {
      uobj['id'] = this.state.id;
      this.props.initUserRequest();
      this.props.updateUserRequest(uobj);
      this.setState({
        snackbarOpen: true,
        snackbarMessage: 'User updated successfully',
        severity: "success"
      });
    }

    this.handleClose();
    this.props.initUserRequest()
  };

  // close alert message 
  closeSnackbar = () => {
    this.setState({
      snackbarOpen: false,
      snackbarMessage: '',
    });
  };

toggleChange = (index, newWorkStatus) => {
  const { page, rowsPerPage, user } = this.state;
  // let exams = this.state.exams;
  const dataindex = page * rowsPerPage + index;

  user[dataindex].assignWork = newWorkStatus
  // console.log("updated exam", user[dataindex]);
  this.setState({ user: user }, () => {
      const updatedWork = user[dataindex];
      this.props.updateUserRequest(updatedWork);
  });
};

  


  
  render() {

    const { page, rowsPerPage, searchQuery, fname, open, lname, password, contact, email, gender, role,status, selectedUserdetail } = this.state;
    const { fnameError, lnameError, emailError, contactError, passwordError } = this.state.errors;
    const isSubmitDisabled = !fname || !lname || !email || !contact || !role || !gender || !password || fnameError || lnameError || emailError || contactError || passwordError;
    const filteredUsers = this.props.allUser && this.props.allUser.filter((data) => {
      // console.log(data);
      const searchQuery = this.state.searchQuery;
      const fnameIncludes = data.fname && data.fname.toLowerCase().includes(searchQuery)
      const lnameIncludes = data.lname && data.lname.toLowerCase().includes(searchQuery)
      const emailIncludes = data.email && data.email.toLowerCase().includes(searchQuery)
      const roleIncludes = data.role && data.role.toLowerCase().includes(searchQuery)
      const genderIncludes = data.gender && data.gender.toLowerCase().includes(searchQuery)
      const workStatusIncludes = data.status && data.status.toLowerCase().includes(searchQuery)


      return fnameIncludes || lnameIncludes||workStatusIncludes || emailIncludes || roleIncludes || genderIncludes
    }
    );
    return (

      <div className='container' style={{ marginRight: '25px', marginLeft: "-25px" }}>

        {/* User table  */}
        <Box>
          <Paper>
            <TableContainer sx={{ marginTop: 5 }}>
              <Table aria-label="simple table" sx={{}}>
                <TableHead style={{ overflow: 'auto' }}>
                  <TableRow>
                    <TableCell align="center" colSpan={10} sx={{ color: "white", backgroundColor: "#1976d2", fontSize: "25px", textAlign: "start", fontWeight: "bolder" }}>

                      <Grid container alignItems="center" justifyContent="space-between" style={{ position: 'relative', overflow: "auto", top: 0, zIndex: 1, }}>
                        <Grid item>
                          Manage User
                        </Grid>
                        <Grid item>

                          <TextField
                            className='searchinput'
                            type="text"
                            value={searchQuery}
                            onChange={this.handleSearchQueryChange}
                            placeholder="Search User"
                            variant="standard"
                            sx={{
                              backgroundColor: 'white',
                              padding: "2px 3px",
                              borderRadius: "4px",
                              width: "auto",

                            }}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="end">
                                  <SearchIcon />
                                </InputAdornment>
                              ),
                            }}

                          />
                        </Grid>
                      </Grid>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <Button variant="contained" color="primary" size="small" type="button" sx={{ margin: "8px", padding: "4px 4px", }} onClick={() => (this.handleOpen())}><AddIcon />User</Button>
                  </TableRow>
                  <TableRow>
                    <TableCell align="center"><Typography component="span" variant="subtitle1" sx={{ fontWeight: 'bold' }}>SrNo</Typography></TableCell>
                    <TableCell align="center"><Typography component="span" variant="subtitle1" sx={{ fontWeight: 'bold' }}>Name</Typography></TableCell>
                    {/* <TableCell align="center"><Typography component="span" variant="subtitle1" sx={{ fontWeight: 'bold' }}>Last Name</Typography></TableCell> */}
                    <TableCell align="center"><Typography component="span" variant="subtitle1" sx={{ fontWeight: 'bold' }}>Email</Typography></TableCell>
                    <TableCell align="center"><Typography component="span" variant="subtitle1" sx={{ fontWeight: 'bold' }}>Role</Typography></TableCell>
                    <TableCell align="center"><Typography component="span" variant="subtitle1" sx={{ fontWeight: 'bold' }}>Online/Offline</Typography></TableCell>
                    <TableCell align="center"><Typography component="span" variant="subtitle1" sx={{ fontWeight: 'bold' }}>Status</Typography></TableCell>
                    <TableCell align="center"><Typography component="span" variant="subtitle1" sx={{ fontWeight: 'bold' }}>Action</Typography></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>

                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} align='center'>
                        <strong style={{ fontSize: "34px" }}>No data found</strong>

                      </TableCell>
                    </TableRow>
                  ) : (


                    filteredUsers && filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((data, index) => {
                      const currentIndex = page * rowsPerPage + index + 1;
                      const status = data.assignWork ? "online" : "offline";
                      return (<TableRow key={index}>
                        <TableCell component="th" align="center" scope="row">{currentIndex}</TableCell>
                        <TableCell className="tablebody" align="center">{data.fname + "  " + data.lname}</TableCell >
                        <TableCell className="tablebody" align="center">{data.email}</TableCell>
                        <TableCell className="tablebody" align="center">{data.role}</TableCell>
                        <TableCell align='center'>
                          <Switch
                            checked={data.assignWork}
                            onChange={() => this.toggleChange(index, !data.assignWork)} // Handle toggle changes
                            inputProps={{ 'aria-label': 'controlled' }}
                          />
                          
                        </TableCell>
                        <TableCell className="tablebody" align="center">{status}</TableCell >
            
                        <TableCell className="tablebody" align="center" >
                          <Button onClick={() => this.handleopenDetails(data)}><VisibilityIcon /></Button>
                          <Button onClick={() => (this.handleOpen(data.id))}><EditIcon /></Button>
                          <Button onClick={() => this.deletedata(data.id)}><DeleteIcon /></Button>
                        </TableCell>

                      </TableRow>
                      )
                    }) || [])}

                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              colSpan={8} // Adjust the colSpan value according to your table structure
              count={filteredUsers.length}
              rowsPerPage={rowsPerPage}
              page={page}
              SelectProps={{
                inputProps: {
                  'aria-label': 'rows per page',
                },
                native: true,
              }}
              onPageChange={this.handleChangePage}
              onRowsPerPageChange={this.handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions.default} // Imported component
            />

          </Paper>
        </Box>

        {/* popup update and add  */}

        <DialogBox
          open={open}
          onClose={this.handleClose}
          onConfirm={(event) => {
            this.handleClose()
            this.updateuser(event)

          }}

          message={`Are you sure you want to ${this.state.isAddUser ? 'add' : 'update'} this User?`} title={this.state.isAddUser ? 'Add User' : 'Update User'}
          content={
            <form onSubmit={this.updateuser}>
              <Grid container spacing={2}>
                <Grid item xs={12} >
                  <TextField
                    required
                    label="First Name"
                    variant="outlined"
                    fullWidth
                    name="fname"
                    type="text"
                    value={fname}
                    onChange={this.handleChange}
                    error={fnameError
                    }
                    helperText={fnameError && validation.errorText("Please enter a valid first name") || 'eg:John'}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    label="Last Name"
                    variant="outlined"
                    type="text"
                    fullWidth
                    name="lname"
                    value={lname}
                    onChange={this.handleChange}
                    error={lnameError}
                    helperText={lnameError && validation.errorText("Please enter a valid last name") || 'eg: Dev'}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    label="Email"
                    variant="outlined"
                    fullWidth
                    type='email'
                    name="email"
                    value={email}
                    onChange={this.handleChange}
                    error={emailError}
                    helperText={emailError && validation.errorText("Please enter a valid Email") || 'eg: John1@gmail.com'}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    label="contact"
                    variant="outlined"
                    fullWidth
                    type="tel"
                    name="contact"
                    value={contact}
                    onChange={this.handleChange}
                    error={contactError}
                    helperText={contactError && validation.errorText("Please enter a valid contact") || 'eg: 8888888888'}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    select
                    margin="normal"
                    required
                    fullWidth
                    label="Role"
                    name="role"
                    id="role"
                    value={role}
                    onChange={this.handleChange}
                  >
                    <MenuItem value="admin">Admin</MenuItem>
                    <MenuItem value="trainer">Trainer</MenuItem>
                    <MenuItem value="counsellor">Counsellor</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <FormControl component="fieldset">
                    <FormLabel component="legend" required >Gender</FormLabel>
                    <RadioGroup
                      aria-label="gender"
                      name="gender"
                      value={gender}
                      onChange={this.handleChange}
                      row
                    >
                      <FormControlLabel value="male" checked={gender === "male"} control={<Radio />} label="Male" />
                      <FormControlLabel value="female" checked={gender === "female"} control={<Radio />} label="Female" />
                      <FormControlLabel value="other" checked={gender === "other"} control={<Radio />} label="Other" />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Password"
                    name="password"
                    type={this.state.showPassword ? 'text' : 'password'}
                    id="pass"
                    value={password}
                    onChange={this.handleChange}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() =>
                              this.setState((prevState) => ({
                                showPassword: !prevState.showPassword,
                              }))
                            }
                            edge="end"

                          >
                            {this.state.showPassword ? (
                              <VisibilityIcon />
                            ) : (
                              <VisibilityOffIcon />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    error={passwordError}
                    helperText={passwordError && validation.errorText("Please enter a valid password") || 'eg: Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character'}
                  />
                </Grid>
              </Grid>
            </form>
          }
          disable={isSubmitDisabled}
          submitLabel={this.state.isAddUser ? 'Add User' : 'Update User'}
        />
        {/* Delete pop up model  */}
        <DialogBox
          open={this.state.confirmDialogOpen}
          onClose={this.closeConfirmDialog}
          onConfirm={() => {
            this.closeConfirmDialog();
            this.confirmDelete();
          }}
          message={`Are you sure you want to delete this record?`}
          title={`Delete Record`}
          submitLabel={`Delete`}

        />
        {/* alert message after action perform */}
        <Snackbar
          open={this.state.snackbarOpen}
          autoHideDuration={3000}
          onClose={this.closeSnackbar}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <MuiAlert
            elevation={6}
            variant="filled"
            onClose={this.closeSnackbar}
            severity={this.state.severity}
            sx={{ width: '100%' }}
          >
            {this.state.snackbarMessage}
          </MuiAlert>
        </Snackbar>

        <DialogBox
          open={this.state.isDetailsPopup}
          onClose={this.handlecloseDetails}
          onConfirm={(event) => {
            this.handlecloseDetails()
          }}
          title={"User Details"}
          content={
            selectedUserdetail && (
              <Typography  >
                <Typography component="span" variant="subtitle1" sx={{ fontSize: '23px', }} >
                  <span style={{ fontWeight: "bold" }}> First Name:</span>
                  {selectedUserdetail.fname} <br />
                </Typography>{" "}

                <Typography component="span" variant="subtitle1" sx={{ fontSize: '23px' }}>
                  <span style={{ fontWeight: "bold" }}> Last Name :</span>
                  {selectedUserdetail.lname} <br />
                </Typography>{" "}

                <Typography component="span" variant="subtitle1" sx={{ fontSize: '23px' }}>
                  <span style={{ fontWeight: "bold" }}> Email:</span>
                  {selectedUserdetail.email} <br />
                </Typography>{" "}

                <Typography component="span" variant="subtitle1" sx={{ fontSize: '23px' }}>
                  <span style={{ fontWeight: "bold" }}>   Contact:</span>
                  {selectedUserdetail.contact} <br />
                </Typography>{" "}

                <Typography component="span" variant="subtitle1" sx={{ fontSize: '23px' }}>
                  <span style={{ fontWeight: "bold" }}>  Role:</span>
                  {selectedUserdetail.role} <br />
                </Typography>{" "}

                <Typography component="span" variant="subtitle1" sx={{ fontSize: '23px' }}>
                  <span style={{ fontWeight: "bold" }}>  Gender:</span>
                  {selectedUserdetail.gender} <br />
                </Typography>{" "}

                <Typography component="span" variant="subtitle1" sx={{ fontSize: '23px' }}>
                  <span style={{ fontWeight: "bold" }}>  Password:</span>
                  {selectedUserdetail.password} <br />
                </Typography>{" "}
              </Typography>
            )
          }

        />
      </div >
    )
  }
}

export default UserTable;
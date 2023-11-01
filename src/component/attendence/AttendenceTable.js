import React, { Component } from 'react';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TablePagination from '@mui/material/TablePagination';
import LoginIcon from '@mui/icons-material/Login';
import { Box, Button, Grid, Paper } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {  Typography } from '@mui/material';
import TextField from '@mui/material/TextField';
import LogoutIcon from '@mui/icons-material/Logout';
import * as TablePaginationActions from "../common/TablePagination";
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import DialogBox from '../common/DialogBox';


export class AttendenceTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      attendenceData: [],
      page: 0,
      rowsPerPage: 5,
      searchQuery: '',
      isDeletePopupOpen: false,
      deletingRecordId: null,
      isDetailsPopupOpen: false,
      selectedRecord: "",
      snackbarOpen: false,
      snackbarMessage: '',
      isWorking: true,
      id: null,
      Date:"",
      fullname:" ",
      startTime:" ",
      startLocation:"pune",
      endTime:" ",
      endLocation:"pune",
      totalTime:" ",
      status:" ",
    };
  }
  handleStartWork = () => {
    const currentTime = new Date();
    const formattedTime = currentTime.toLocaleTimeString();
     // Get user name from session storage
    const userName = sessionStorage.getItem("user");
    console.log(userName);
    // Get current date
    const currentDate = new Date();
    console.log(currentDate);
    const formattedDate = currentDate.toLocaleDateString();
    

    this.setState({
      startTime: formattedTime,
      status: "InProgress",
      Date: formattedDate,
      fullname: userName,
    });

    let uobj = {
      fullname: this.state.fullname,
      startTime: this.state.startTime,
      startLocation: this.state.startLocation,
      status: this.state.status,
      Date: this.state.Date,
    };
    this.props.addRecordRequest(uobj)

    console.log("button hit")
  };

  handleStopWork = () => {
    const currentEndTime = new Date();
    const endTime = new Date(currentEndTime);

    const totalTime = endTime - this.state.startTime; // This will give you the time difference in milliseconds
    const newstatus="Done"
    this.setState({status:newstatus})
    let uobj = {
      
      fullname: this.state.fullname,
      startTime: this.state.startTime,
      startLocation: this.state.startLocation,
      endTime: currentEndTime.toLocaleTimeString(),
      endLocation: this.state.endLocation,
      totalTime: totalTime,
      status: this.state.status,
      Date: this.state.Date,
    };
    // uobj['id'] = this.state.id;
      this.props.initRecordRequest();
      this.props.updateRecordRequest(uobj.id);
  
   // Inside handleStopWork method



    console.log(uobj);
    

  };
  componentDidUpdate(prevProps) {
    if (prevProps.allrecord !== this.props.allrecord) {
      this.setState({ attendenceData: this.props.allrecord });
    }
  }
  componentDidMount() {
    this.props.initRecordRequest();
  }
  // pop up table
  // Function to open the table
  openDetailsPopup = (record) => {
    this.setState({ isDetailsPopupOpen: true, selectedRecord: record });
  };
  // Function to close the table
  closeDetailsPopup = () => {
    this.setState({ isDetailsPopupOpen: false, selectedRecord: "" });
  };

  
  // pagination function
  handleChangePage = (event, newPage) => {
    this.setState({ page: newPage });
  };
  handleChangeRowsPerPage = (event) => {
    this.setState({ rowsPerPage: parseInt(event.target.value, 10), page: 0 });

  };
  // search function
  handleSearchChange = (event) => {
    this.setState({ searchQuery: event.target.value, page: 0 });
  }

  



  render() {
    const { searchQuery, page, rowsPerPage, isDeletePopupOpen, selectedRecord, isDetailsPopupOpen } = this.state;
        const filteredResults = this.props.allrecord && this.props.allrecord.filter((val) => {
      const searchQuery = this.state.searchQuery;
      const UserNameIncludes = val.fullname && val.fullname.toLowerCase().includes(searchQuery);
      const StartTimeIncludes = val.startTime && val.startTime.toLowerCase().includes(searchQuery);
      const endTimeIncludes = val.endTime && val.endTime.toLowerCase().includes(searchQuery);
      const statusIncludes = val.status && val.status.toLowerCase().includes(searchQuery);
      const StartLocationIncludes = val.startLocation && val.startLocation.toLowerCase().includes(searchQuery);
      const EndLocationIncludes = val.endLocation && val.endLocation.toLowerCase().includes(searchQuery);
      const TotalTimeIncludes = val.totalTime && val.totalTime.toLowerCase().includes(searchQuery);

      return UserNameIncludes || StartTimeIncludes || endTimeIncludes || StartLocationIncludes ||
        EndLocationIncludes || statusIncludes || TotalTimeIncludes
    }
    );
    return (
      <div >

        {/* table pop up */}
       
         <DialogBox
  open={isDetailsPopupOpen}
  onClose={this.closeDetailsPopup}
  title="Result Details"
  content={
    selectedRecord && (
      <>
      <Typography>
        <Typography component="span" variant="subtitle1" sx={{ fontSize: '23px' }}>
          <span style={{ fontWeight: 'bold' }}> UserName:</span>
          {selectedRecord.fullname} <br />
        </Typography>
        <Typography component="span" variant="subtitle1" sx={{ fontSize: '23px' }}>
          <span style={{ fontWeight: 'bold' }}> StartTime:</span>
          {selectedRecord.startTime} <br />
        </Typography>
        
        <Typography component="span" variant="subtitle1" sx={{ fontSize: '23px' }}>
          <span style={{ fontWeight: 'bold' }}> StartLocationIncludes:</span>
          {selectedRecord.startLocation} <br />
        </Typography>
        
       
        <Typography component="span" variant="subtitle1" sx={{ fontSize: '23px' }}>
          <span style={{ fontWeight: 'bold' }}> endLocation:</span>
          {selectedRecord.endLocation} <br />
        </Typography>
        <Typography component="span" variant="subtitle1" sx={{ fontSize: '23px' }}>
          <span style={{ fontWeight: 'bold' }}> EndTime:</span>
          {selectedRecord.endTime} <br />
        </Typography>
        <Typography component="span" variant="subtitle1" sx={{ fontSize: '23px' }}>
          <span style={{ fontWeight: 'bold' }}> Status:</span>
          {selectedRecord.status} <br />
        </Typography>
        <Typography component="span" variant="subtitle1" sx={{ fontSize: '23px' }}>
          <span style={{ fontWeight: 'bold' }}> TotalTime:</span>
          {selectedRecord.totalTime} <br />
        </Typography>
      </Typography>
      {/* <Button onClick={this.closeDetailsPopup} color="primary" sx={{ fontSize: "px" }}>
              Close
            </Button> */}
      </>
    )
  }
/>
  {/* start table */}
        <Box sx={{ marginRight: "25px", marginTop: 5, position: "relative", right: 20 }}>
          <Paper>
            <TableContainer >
              <Table aria-label="simple table" sx={{}} >
                <TableHead style={{ overflow: 'auto' }}>
                  <TableRow>
                    <TableCell align="center" colSpan={10} sx={{ backgroundColor: '#1976d2', fontSize: "25px", fontWeight: "bolder", color: "white" }}>
                      <Grid className='resultheader' container alignItems="center" justifyContent="space-between" style={{ position: 'relative', overflow: "auto", top: 0, zIndex: 1, }}>
                        <Grid item>
                          Attendence Data
                        </Grid>
                        <Grid item>

                          <TextField
                            className='searchinput'
                            type="text"
                            value={searchQuery}
                            onChange={this.handleSearchChange}
                            placeholder="Search Record"
                            // label="Search Result"

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
                  <Button variant="contained" color="primary" sx={{ marginTop: 4 }} size="small" type="button" onClick={() => this.handleStartWork()}> <LoginIcon /> Login </Button>
                  <TableRow>
                    <TableCell align="center" ><Typography component="span" variant="subtitle1" sx={{ fontWeight: "bold" }}>SrNo</Typography></TableCell>
                    <TableCell align="center"><Typography component="span" variant="subtitle1" sx={{ fontWeight: "bold" }}>UserName</Typography></TableCell>
                    <TableCell align="center"><Typography component="span" variant="subtitle1" sx={{ fontWeight: "bold" }}>StartTime</Typography></TableCell>
                    <TableCell align="center"><Typography component="span" variant="subtitle1" sx={{ fontWeight: "bold" }}>StartLocation</Typography></TableCell>
                    <TableCell align="center"><Typography component="span" variant="subtitle1" sx={{ fontWeight: "bold" }}>EndTime</Typography></TableCell>
                    <TableCell align="center"><Typography component="span" variant="subtitle1" sx={{ fontWeight: "bold" }}>EndLocation</Typography></TableCell>
                    <TableCell align="center"><Typography component="span" variant="subtitle1" sx={{ fontWeight: "bold" }}>Status</Typography></TableCell>
                    <TableCell align="center"><Typography component="span" variant="subtitle1" sx={{ fontWeight: "bold" }}>TotalTime</Typography></TableCell>
                    <TableCell align="center"><Typography component="span" variant="subtitle1" sx={{ fontWeight: "bold" }}>Action</Typography></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredResults.length === 0 ? (
                    <TableRow>
                      <TableCell align="center">
                        <strong style={{ fontSize: "34px" }}>  No data found</strong>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredResults && filteredResults.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((val, index) => {
                     
                      const currentIndex = page * rowsPerPage + index + 1;
                      return (
                        <TableRow key={val.id} >
                          <TableCell align="center" component="th" scope="row">{currentIndex}</TableCell>
                          <TableCell align="center">{val.fullname}</TableCell >
                          <TableCell align="center">{val.startTime}</TableCell >
                          <TableCell align="center">{val.startLocation}</TableCell>
                          <TableCell align="center">{val.endLocation}</TableCell>
                          <TableCell align="center">{val.endTime}</TableCell>
                          <TableCell align="center">{val.status}</TableCell>
                          <TableCell align="center">{val.totalTime}</TableCell>
                          <TableCell align='center'>
                            <Button
                              onClick={() => this.openDetailsPopup(val)} align="center"><VisibilityIcon />
                            </Button>
                            <Button
                            onClick={()=>this.handleStopWork()}
                               align="center"><LogoutIcon />
                            </Button>
                          </TableCell>
                        </TableRow>
                      )
                    })
                  )}
                </TableBody>
              </Table>
            </TableContainer>
           
            {/* table pagination */}

            <TablePagination

              rowsPerPageOptions={[5, 10, 25]}
              colSpan={7} // Adjust the colSpan value according to your table structure
              count={filteredResults.length}
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
      </div>
    );
  }
}
export default AttendenceTable

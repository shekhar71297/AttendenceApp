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
import { Typography } from '@mui/material';
import TextField from '@mui/material/TextField';
import LogoutIcon from '@mui/icons-material/Logout';
import * as TablePaginationActions from "../common/TablePagination";
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import DialogBox from '../common/DialogBox';
import axios from 'axios';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';


export class RecordTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoggedIn: false,
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
            date: "",
            fullname: " ",
            startTime: " ",
            startLocation: "",
            endTime: " ",
            endLocation: "",
            totalTime: "",
            status: " ",
            sTime: null,
        };
    }
    openDetailsPopup = (record) => {
        this.setState({ isDetailsPopupOpen: true, selectedRecord: record });
    };
    // Function to close the table
    closeDetailsPopup = () => {
        this.setState({ isDetailsPopupOpen: false, selectedRecord: "" });
    };

    //geoLocation
    getUserLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(this.handleLocationSuccess, this.handleLocationError);
        } else {
            // Geolocation is not supported
            this.setState({ isGeolocationAvailable: false });
        }
    };

    handleData = () => {
        axios.get("http://localhost:8889/attendenceData").then((res) => {
            console.log(res.data);
            this.setState({ attendenceData: res.data })
        })
    }


    getRecord = (id) => {
        let url = `${"http://localhost:8889/attendenceData"}/${id}`;
        axios.get(url).then((res) => {
            // Update the record state
            const { id, fullname, startTime, endTime, startLocation, endLocation, status, totalTime, date } = res.data;
            this.setState({ id, fullname, startTime, endTime, startLocation, endLocation, status, totalTime, date }, () => {
                // After updating the state, call the updateEmp function
                this.updateEmp();
            });
        });
    }

    handleStartWork = () => {
        // e.preventDefault();
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    // console.log(navigator.geolocation);
                    // Get latitude and longitude from the geolocation data
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;

                    // Combine latitude and longitude to create the location string
                    const userLocation = `Lat: ${latitude}, Long: ${longitude}`;
                    this.fetchLocationDetails(latitude, longitude, (location) => {
                        this.setState({
                          startLocation: location, // Update startLocation with the obtained location
                        });
                      });
                      

                    const currentTime = new Date();
                    const formattedTime = currentTime.toLocaleTimeString();
                    const time = Date.now();
                    const userName = sessionStorage.getItem("user");
                    const currentDate = new Date();
                    const formattedDate = currentDate.toLocaleDateString();

                    this.setState({
                        isLoggedIn: true,
                        sTime: time,
                    });
                    this.setState({
                        snackbarOpen: true,
                        snackbarMessage: 'User Login Successfully',
                        severity: "success"
                    });

                    const sobj = {
                        fullname: userName,
                        startTime: formattedTime,
                        startLocation: userLocation, // Update startLocation in the sobj
                        endTime: "",
                        endLocation: this.state.endLocation,
                        totalTime: "",
                        status: "InProgress",
                        date: formattedDate,

                    }
                    axios.post("http://localhost:8889/attendenceData", sobj).then(() => {

                    })

                    // Add the new record to the state or send it to your API

                },
                (error) => {
                    console.error("Error obtaining user location:", error);
                }
            );
        } else {
            // Geolocation is not supported
            this.setState({ isGeolocationAvailable: false });
        }
    };
    updateEmp = () => {
        // Calculate totalTime
        const { sTime } = this.state;
        const eTime = Date.now()
        const totalTimeMs = eTime - sTime;
        const currentTime = new Date();
        const formattedTime = currentTime.toLocaleTimeString();
        let totalTime;
        if (totalTimeMs!=0) {
            totalTime = `${Math.ceil(totalTimeMs / 1000)}s`;
        } else if (totalTimeMs < 3600000) {
            totalTime = `${Math.ceil(totalTimeMs / 60000)}m`;
        } else {
            totalTime = `${Math.ceil(totalTimeMs / 3600000)}h`;
        }
        this.setState({ isLoggedIn: false });
        this.setState({
            snackbarOpen: true,
            snackbarMessage: 'Logout successfully',
            severity: "success"
        });

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    // Get latitude and longitude from the geolocation data
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;
                    const userLocation = `Lat: ${latitude}, Long: ${longitude}`;

                    // Update status and other fields, including endLocation with latitude and longitude
                    let eObj = {
                        id: this.state.id,
                        date: this.state.date,
                        fullname: this.state.fullname,
                        startTime: this.state.startTime,
                        startLocation: this.state.startLocation,
                        endTime: formattedTime,
                        endLocation: userLocation, // Updated with latitude and longitude
                        totalTime: totalTime,
                        status: "Done"
                    };

                    let url = `${"http://localhost:8889/attendenceData"}/${this.state.id}`;
                    axios.put(url, eObj)
                        .then(() => {
                            this.handleData();
                        });
                },
                (error) => {
                    console.error("Error obtaining user location:", error);
                }
            );
        } else {
            // Geolocation is not supported
            this.setState({ isGeolocationAvailable: false });
        }
    }

   

fetchLocationDetails = (latitude, longitude,) => {
  const apiKey = 'f74469f1a51c4c5c96e6fe739681f03e'; // Get an API key from OpenCage (required)
  const latlng = `${latitude},${longitude}`;
  const apiUrl = `https://api.opencagedata.com/geocode/v1/json?q=${latlng}&key=${apiKey}&no_annotations=1`;

  axios.get(apiUrl)
    .then((response) => {
      if (response.status === 200) {
        // Extract the location data from the API response
        const results = response.data.results;
        if (results.length > 0) {
          const formattedAddress = results[0].formatted;
          console.log('User Location:', formattedAddress);

          // Do something with the address (e.g., display it to the user)
        }
      } else {
        console.error('OpenCage Geocoder API error:', response.statusText);
      }
    })
    .catch((error) => {
      console.error('Error fetching location data:', error);
    });
}


    componentDidMount() {
        console.log("mount call");
        this.handleData()
    }
    componentDidUpdate(prevProps, prevState) {
        // Check if the isLoggedIn state has changed
        if (this.state.isLoggedIn !== prevState.isLoggedIn) {
            // If the user has just logged in, fetch updated data
            if (this.state.isLoggedIn) {
                this.handleData();
            }
        }
    }
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

    closeSnackbar = () => {
        this.setState({
          snackbarOpen: false,
          snackbarMessage: '',
        });
      };

    render() {
        const { searchQuery, page, rowsPerPage, isDeletePopupOpen, selectedRecord, isDetailsPopupOpen, attendenceData } = this.state;
        const filteredRecord = attendenceData && attendenceData.filter((val) => {
            const searchQuery = this.state.searchQuery;
            const UserNameIncludes = val.fullname && val.fullname.toLowerCase().includes(searchQuery);
            const StartTimeIncludes = val.startTime && val.startTime.toLowerCase().includes(searchQuery);
            const endTimeIncludes = val.endTime && val.endTime
            const statusIncludes = val.status && val.status.toLowerCase().includes(searchQuery);
            const StartLocationIncludes = val.startLocation && val.startLocation.toLowerCase().includes(searchQuery);
            const EndLocationIncludes = val.endLocation && val.endLocation.toLowerCase().includes(searchQuery);
            const TotalTimeIncludes = val.totalTime && val.totalTime;
            const dateIncludes = val.date && val.date.toLowerCase().includes(searchQuery);

            return UserNameIncludes || StartTimeIncludes || endTimeIncludes || StartLocationIncludes || EndLocationIncludes || statusIncludes || TotalTimeIncludes
                || dateIncludes
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
                                        <span style={{ fontWeight: 'bold' }}> Date:</span>
                                        {selectedRecord.date} <br />
                                    </Typography>
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
                                    <Button variant="contained" color="primary" sx={{ marginTop: 4 }} size="small" type="button" onClick={() => this.handleStartWork()} disabled={this.state.isLoggedIn}> <LoginIcon /> Login </Button>
                                    <TableRow>
                                        <TableCell align="center" ><Typography component="span" variant="subtitle1" sx={{ fontWeight: "bold" }}>SrNo</Typography></TableCell>
                                        <TableCell align="center"><Typography component="span" variant="subtitle1" sx={{ fontWeight: "bold" }}>Date</Typography></TableCell>
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
                                    {filteredRecord.length === 0 ? (
                                        <TableRow>
                                            <TableCell align="center">
                                                <strong style={{ fontSize: "34px" }}>  No data found</strong>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredRecord && filteredRecord.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((val, index) => {

                                            const currentIndex = page * rowsPerPage + index + 1;
                                            return (
                                                <TableRow key={index} >
                                                    <TableCell align="center" component="th" scope="row">{currentIndex}</TableCell>
                                                    <TableCell align="center">{val.date}</TableCell >
                                                    <TableCell align="center">{val.fullname}</TableCell >
                                                    <TableCell align="center">{val.startTime}</TableCell >
                                                    <TableCell align="center">{val.startLocation}</TableCell>
                                                    <TableCell align="center">{val.endTime}</TableCell>
                                                    <TableCell align="center">{val.endLocation}</TableCell>
                                                    <TableCell align="center">{val.status}</TableCell>
                                                    <TableCell align="center">{val.totalTime}</TableCell>
                                                    <TableCell align='center'>
                                                        <Button
                                                            onClick={() => this.openDetailsPopup(val)} align="center"><VisibilityIcon />
                                                        </Button>
                                                        {this.state.isLoggedIn && val.status !== "Done" ? (
                                                            <Button
                                                                variant="contained"
                                                                color="primary"
                                                                size="small"
                                                                type="button"
                                                                onClick={() => this.getRecord(val.id)}
                                                            >
                                                                <LogoutIcon /> Logout
                                                            </Button>
                                                        ) : null}

                                                    </TableCell>
                                                </TableRow>
                                            )
                                        }) || [])}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        {/* alert snackbar */}
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


                        {/* table pagination */}

                        <TablePagination

                            rowsPerPageOptions={[5, 10, 25]}
                            colSpan={8} // Adjust the colSpan value according to your table structure
                            count={filteredRecord.length}
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
export default RecordTable

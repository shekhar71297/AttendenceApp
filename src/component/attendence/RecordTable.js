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
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;
                    const userLocation = `Lat: ${latitude}, Long: ${longitude}`;
    
                    // Check if the status in sessionStorage is "offline"
                    const status = localStorage.getItem('status');
                    if (status === 'offline' && !this.areCoordinatesValid(latitude, longitude)) {
                        this.setState({isWorking:false})
                    }else{
                        
                        this.fetchLocationDetails(latitude, longitude, (location) => {
                            this.setState({
                                startLocation: location, // Update startLocation with the obtained location
                            });
                        });

                        const sTime = this.state.sTime || Date.now();

                        const currentTime = new Date();
                        const formattedTime = currentTime.toLocaleTimeString();
                        const time = Date.now();
                        const userName = sessionStorage.getItem("user");
                        const currentDate = new Date();
                        const formattedDate = `${currentDate.getDate()}/${currentDate.toLocaleString('en-US', { month: 'short' })}`;
                    
                        this.setState({
                            isLoggedIn: true,
                            sTime: sTime, // Set the sTime to the value already set or the current time
                        });
                        sessionStorage.setItem('isLoggedIn', 'true');
                    
                        this.setState({
                            snackbarOpen: true,
                            snackbarMessage: 'User Login Successfully',
                            severity: "success"
                        });

                        const sobj = {
                            fullname: userName,
                            startTime: formattedTime,
                            startLocation: userLocation,
                            endTime: "",
                            endLocation: this.state.endLocation,
                            totalTime: "",
                            status: "InProgress",
                            date: formattedDate,
                        };
                    
                        axios.post("http://localhost:8889/attendenceData", sobj).then(() => {
                            this.handleData();
                        });

                    
                    }
                }) 
            }         
    };
 

    // Handle case when sTime is already set
   
   


    
    
    // Helper function to check if coordinates match default values
    areCoordinatesValid = (latitude, longitude) => {
        const lat = latitude;
        const roundedlat = lat.toFixed(3)
        const lon = longitude;
        const roundedlon = lon.toFixed(3)
        // Define your default latitude and longitude values here
        const defaultLatitude = 18.527; // Replace with your default latitude
        const defaultLongitude = 73.969; // Replace with your default longitude
        
        console.log(roundedlat);
        console.log(roundedlon);
        // Compare the user's coordinates with the default coordinates
        if (roundedlat == defaultLatitude && roundedlon == defaultLongitude) {
            return true;
        } else {
            return false;
        }
    };
    
    updateEmp = () => {
        // Calculate totalTime
        const { sTime } = this.state;
        const eTime = Date.now()
        const totalTimeMs = eTime - sTime;
        const currentTime = new Date();
        const formattedTime = currentTime.toLocaleTimeString();
        // Function to format the time in a user-friendly way
    const formatTime = (milliseconds) => {
        const totalSeconds = Math.floor(milliseconds / 1000);
        if (totalSeconds < 60) {
            return totalSeconds + 's';
        } else if (totalSeconds < 3600) {
            const minutes = Math.floor(totalSeconds / 60);
            const seconds = totalSeconds % 60;
            return minutes + 'm ' + seconds + 's';
        } else {
            const hours = Math.floor(totalSeconds / 3600);
            const remainingSeconds = totalSeconds % 3600;
            const minutes = Math.floor(remainingSeconds / 60);
            return hours + 'h ' + minutes + 'm';
        }
    };

    // Calculate and format the total time
    const formattedTotalTime = formatTime(totalTimeMs);
        this.setState({ isLoggedIn: false });
        sessionStorage.setItem('isLoggedIn', 'false');
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
                        totalTime: formattedTotalTime,
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
        localStorage.removeItem("status")
        sessionStorage.removeItem("isLoggedIn")
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
          const formattedAddress = results[0].components.neighbourhood
          ;

          console.log('User Location:', formattedAddress);
          console.log(results);

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
    // Check if isLoggedIn is set in sessionStorage
    const isLoggedInInStorage = sessionStorage.getItem('isLoggedIn');
    if (isLoggedInInStorage === 'true') {
        this.setState({ isLoggedIn: true });
    }

    this.handleData();
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
        console.log(attendenceData);
        const filteredRecord = attendenceData && attendenceData.filter((val) => {
            const searchQuery = this.state.searchQuery;
            const UserNameIncludes = val.fullname && val.fullname.toLowerCase().includes(searchQuery);
            const StartTimeIncludes = val.startTime && val.startTime.toLowerCase().includes(searchQuery);
            // const endTimeIncludes = val.endTime && val.endTime
            const statusIncludes = val.status && val.status.toLowerCase().includes(searchQuery);
            const StartLocationIncludes = val.startLocation && val.startLocation.toLowerCase().includes(searchQuery);
            const EndLocationIncludes = val.endLocation && val.endLocation.toLowerCase().includes(searchQuery);
            // const TotalTimeIncludes = val.totalTime && val.totalTime;
            const dateIncludes = val.date && val.date.toLowerCase().includes(searchQuery);

            return UserNameIncludes || StartTimeIncludes  || StartLocationIncludes || EndLocationIncludes || statusIncludes || dateIncludes
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
                                    <Button variant="contained" color="primary" sx={{ marginTop: 4 }} size="small" type="button" onClick={() => this.handleStartWork()} disabled={this.state.isLoggedIn || !this.state.isWorking}> <LoginIcon /> Login </Button>
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
                                            <TableCell colSpan={8} align="center">
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

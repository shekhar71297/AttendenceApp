
import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { FaUsers } from 'react-icons/fa';
import { GiHamburgerMenu } from 'react-icons/gi';
import { PiStudentFill } from 'react-icons/pi';
import {IoMdLogOut } from 'react-icons/io';
import { Outlet, useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

import './dashboard.css'
import DialogBox from '../../component/common/DialogBox';

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));


const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

const Dashboard = () => {

  const theme = useTheme();
  const [open, setOpen] = React.useState(true);
  const [showAlert, setShowAlert] = React.useState(false);
  const [alertMessage, setAlertMessage] = React.useState('');
  const [alertSeverity, setAlertSeverity] = React.useState('info');
  const navigate = useNavigate();
  const location = useLocation();

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const navigatePage = (path) => {
    navigate(path)
  }



  const isAdminLog = !!sessionStorage.getItem("admin");

  const isTrainerLog = !!sessionStorage.getItem("trainer");

  const isCounsellorLog = !!sessionStorage.getItem("counsellor");

  const handleLogout = () => {
  if (isAdminLog || isTrainerLog || isCounsellorLog) {
    const role = isAdminLog ? "admin" : isTrainerLog ? "trainer" : "counsellor";
    localStorage.removeItem("user");
    sessionStorage.removeItem("admin");
    sessionStorage.removeItem("trainer");
    sessionStorage.removeItem("counsellor");
    setAlertSeverity('warning'); // or 'info', 'error', etc. based on your needs
    setAlertMessage(`Are you sure you want to logout as ${role}?`);
    setShowAlert(true);
  }
};

  const userName = sessionStorage.getItem("user");


  
    return (

      <>

        <Box sx={{ display: 'flex' }}>
          <CssBaseline />
          <AppBar position="fixed">
            <Toolbar>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={() => setOpen(!open)}
                edge="start"

              >
                <GiHamburgerMenu />
              </IconButton>
          {userName ? (
            <Typography variant="h6" noWrap component="div">
              Welcome, {userName}
            </Typography>
          ) : (
            <Typography variant="h6" noWrap component="div">
              Dashboard
            </Typography>
          )}
            <Box sx={{ flexGrow: 1 }} />
            <IconButton
              color="inherit"
              aria-label="logout"
              onClick={handleLogout}
              edge="end"
            >
              <IoMdLogOut />
            </IconButton>
          </Toolbar>
        </AppBar>


          <Drawer variant="permanent" open={open}>
            <DrawerHeader>
              <IconButton onClick={handleDrawerClose}>
                {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
              </IconButton>
            </DrawerHeader>
            <Divider />

            <List>
{/* User module               */}
{isAdminLog && (
              <ListItem
              disablePadding
              sx={{ display: 'block' }}
              className={location.pathname === '/dashboard/user' ? 'selected' : ''}
            >
                <ListItemButton onClick={() => navigatePage("/dashboard/user")}
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? 'initial' : 'center',
                    px: 2.5,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : 'auto',
                      justifyContent: 'center',
                    }}
                  >

                    <FaUsers />
                  </ListItemIcon>
                  <ListItemText primary='User' sx={{ opacity: open ? 1 : 0 }} />
                </ListItemButton>
              </ListItem>
                 )}
{/* Attendence record module */}
<ListItem
              disablePadding
              sx={{ display: 'block' }}
              className={location.pathname === '/dashboard/record' ? 'selected' : ''}
            >
                <ListItemButton onClick={() => navigatePage("/dashboard/record")}
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? 'initial' : 'center',
                    px: 2.5,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : 'auto',
                      justifyContent: 'center',
                    }}
                  >
                    <PiStudentFill />
                  </ListItemIcon>
                  <ListItemText primary='Attendence' sx={{ opacity: open ? 1 : 0 }} />
                </ListItemButton>
              </ListItem>
            </List>
            <Divider />

          </Drawer>
          <div className='child-components'>
            <Outlet />
          </div>
        </Box>
     {/* Alert Dialog */}
     <DialogBox
        open={showAlert}
        onClose={() => setShowAlert(false)}
        onConfirm={() => {
          setShowAlert(false);
          sessionStorage.removeItem(isAdminLog ? "admin" : isTrainerLog ? "trainer" : "counsellor");
          sessionStorage.removeItem("user");
          localStorage.removeItem("status");
          navigate("/");
        }}
        title={`Confirmation`}
        message={alertMessage}
        submitLabel={`Logout`}
      />
      </>
    );
  }


export default Dashboard

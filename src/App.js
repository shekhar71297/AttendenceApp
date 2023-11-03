
import './App.css';
import Login from './component/user/Login';
import { Provider } from 'react-redux';
import store from './store/store'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/dashboard/Dashboard';
import PrivateRoute from './component/PrivateRoute';
import User from './pages/user/container/User';
import AttendenceData from './pages/record/container/AttendenceData';
import RecordTable from './component/attendence/RecordTable';


function App() {
  return (
    <Provider store={store}>
    <div className="App">
      <BrowserRouter>
      <Routes>
      <Route path='/' element={<Login />} />
      <Route path='/dashboard' element={<PrivateRoute><Dashboard/></PrivateRoute>}>
      <Route path='user' element={<PrivateRoute><User /></PrivateRoute>} />
      <Route path='record' element={<PrivateRoute><RecordTable/></PrivateRoute>}/>
      </Route>
      </Routes>
      </BrowserRouter>
    </div>
    </Provider>
  );
}

export default App;

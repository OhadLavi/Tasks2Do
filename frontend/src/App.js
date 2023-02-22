import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Login from './Screens/Login/Login';
import Register from './Screens/Register/Register';
import Tasks from './Screens/Task/Tasks';
import AddTasks from './Screens/Task/AddTask';
import MainLayout from './Layouts/MainLayout/MainLayout';
import Lists from './Screens/Lists/AddList';
import './App.css';

const App = () => {
  return (
    <div className='App'>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route
              path='/'
              element={<Navigate to='/tasks/todayTasks' replace />}
            ></Route>
            <Route path='/addtask' element={<AddTasks />}></Route>
            <Route path='/tasks/:type' element={<Tasks />}></Route>
            <Route path='/:list/:name/:type' element={<Tasks />}></Route>
            <Route path='/add-list' element={<Lists />}></Route>
          </Route>
          <Route>
            <Route path='/login' element={<Login />}></Route>
            <Route path='/register' element={<Register />}></Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;

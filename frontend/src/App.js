import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import SignUp from './Pages/Signup';
import { Route, Routes } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './Components/Auth/AuthContext';
import Home from './Pages/Home';
import Login from './Pages/Login';
import Add from './Pages/Add';
import ViewStudents from './Pages/ViewStudents';
import StudentPage from './Pages/ViewStudent';
import AddCourse from './Pages/Course/AddCourse';
import ViewCourses from './Pages/Course/ViewCourses';
import CoursePage from './Pages/Course/CoursePage';
import Error from './Pages/Error';

function App() {
  const {state} = useContext(AuthContext);
  const {user, isAuthenticated} = state;

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
         
           <Route
            path="/add-student"
            element={
              isAuthenticated && user && user.role === "Admin"
                ? <Add />
                : <Error />
            }
          />

            <Route path="/view-students" element={
              isAuthenticated && user && (user.role === "Admin" || user.role === "Editor")
                ? <ViewStudents />
                : <Error />
            } />
            <Route path="/view-student" element={
              isAuthenticated && user && user.role === "Admin"
                ? <StudentPage />
                : <Error />
            } />
            <Route path="/course/add" element={
              isAuthenticated && user && user.role === "Admin"
                ? <AddCourse />
                : <Error />
            } />
            <Route path="/course/view" element={
              isAuthenticated && user && (user.role === "Admin" || user.role === "Editor")
                ? <ViewCourses />
                : <Error />
            } />
            <Route path="/course" element={
              isAuthenticated && user && user.role === "Admin"
                ? <CoursePage />
                : <Error />
            } />
      </Routes>
    </>
  )
}

export default App;


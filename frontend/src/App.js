import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import SignUp from './Pages/Signup';
import { Route, Routes } from 'react-router-dom';
import Home from './Pages/Home';
import Login from './Pages/Login';
import Add from './Pages/Add';
import ViewStudents from './Pages/ViewStudents';
import StudentPage from './Pages/ViewStudent';
import AddCourse from './Pages/Course/AddCourse';
import ViewCourses from './Pages/Course/ViewCourses';
import CoursePage from './Pages/Course/CoursePage';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/add-student" element={<Add/>} />
        <Route path="/view-students" element={<ViewStudents/>} />
        <Route path="/view-student" element={<StudentPage/>} />
        <Route path="/course/add" element={<AddCourse/>} />
        <Route path="/course/view" element={<ViewCourses/>} />
        <Route path="/course" element={<CoursePage/>} />
      </Routes>
    </>
  )
}

export default App;


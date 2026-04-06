import React, { useState, useEffect, useContext } from "react";
import {useNavigate} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { endPoint, axiosInstance } from "../../endPoint/api";
import Cookies from "js-cookie";
import { AuthContext } from "../../Components/Auth/AuthContext";
import Header from "../../Components/Other/Header";
import Sidebar from "../../Components/Other/Sidebar";

export default function StudentChoice( props ) {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [student, setStudent] = useState(null);
    const [section, setSection] = useState("");
    const [status, setStatus] = useState(null);
    const [sections, setSections] = useState([]);
    const navigate = useNavigate();

    const {state} = useContext(AuthContext);
    const {user, isAuthenticated} = state;
    

    useEffect(() => {
        
        const fetchStudents = async () => {
            try {

                const optionsresponse = await axiosInstance.get(endPoint.OPTIONS);
                setSections(optionsresponse.data.sections);
                const response = await axiosInstance.get(endPoint.ALLCOURSES,
                    {
                        params: {section: section, status: status},
                        headers: {
                            "Authorization": `Bearer ${Cookies.get("token")}`,
                            "Content-Type": "application/json"
                        }
                    }
                );
                
                setCourses(response.data);
                if (response.data == []) {
                    toast.warning("No Courses are available.");
                } 
            } catch (err) {
                console.log("Error fetching courses:", err);
                if (err.response && err.response.status === 404) {
                    setCourses([]);
                    toast.warning("No Courses found");
                } else if (err.response && err.response.status === 401) {
                    toast.error("Unauthorized. Please log in again.");
                } else {
                    toast.error("Internal Server Error");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
    }, [section, status]);

    const getProfile = async (id) => {
        const token = Cookies.get("token");
        try {
            setLoading(true);
            console.log(token);
            const response = await axiosInstance.get(
                endPoint.GETSTUDENT,
                {
                    params: {id},
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });
            
            console.log(response.data);
            setStudent(response.data);
        } catch (err) {
            console.log("Error fetching student Profile:", err);
            if (err.response && err.response.status === 401) {
                toast.warning("Student profile could not be fetched");
            } else {
                toast.error("Internal Server Error");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
  <Header
    isAuthenticated={isAuthenticated}
    user={user ? user.name : null}
    role={user ? user.role : null}
  />

  <div className="container" style={{ margin: '5vh auto auto', maxWidth: '100%' }}>
    <h1 className="text-center mt-5 p-3">View Courses Modal</h1>
    <Sidebar>

    <div className="position-relative">
      {loading && (
        <div className="loading-overlay">
          <div className="spinner-border text-light"></div>
        </div>
      )}

      <div className="flex-grow-1">
        <h4 className="mb-3">Filter by Section</h4>
        <select
            value={section}
            size={1} // make it a dropdown on mobile
            onChange={(e) => { setSection(e.target.value); setLoading(true); }}
            className="form-control w-25 mb-2 align-self-center justify-self-center"
          >
            <option value="">All Sections (ሁሉም)</option>
            {sections.map((sec, index) => (
              <option key={index} value={sec}>{sec}</option>
            ))}
          </select>  
        <h4 className="mb-3">Filter by Status</h4>
        <select
            value={status}
            size={1} // make it a dropdown on mobile
            onChange={(e) => { setStatus(e.target.value); setLoading(true); }}
            className="form-control w-25 mb-2 align-self-center justify-self-center"
          >
            <option value={null}>All Statuses (ሁሉም)</option>
            <option value={true}>Active</option>
            <option value={false}>Inactive</option>
          </select>
      {/* Responsive Layout */}
      <div className="d-flex flex-column flex-sm-row align-items-start justify-content-between gap-3">
        
        {/* Students Table */}
        <div className="flex-grow-1 table-responsive">
          <table className="table table-striped align-middle w-100">
            <thead>
              <tr>
                <th>No.</th>
                <th>Name</th>
                <th>Section</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Teacher</th>
                <th>Created By</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course, index) => (
                <tr key={`${course.id}-${index}`}>
                  <td>{index + 1}</td>
                  <td>{course.name}</td>
                  <td>{course.section}</td>
                  <td>{course.start_date}</td>
                  <td>{course.end_date}</td>
                  <td>{course.teacher}</td>
                  <td>{course.created_by.name}</td>
                  <td>
                    {course.status ? "Active" : "Inactive"}
                  </td>
                  <td>
                    <button
                      className="btn btn-dark btn-sm w-100 w-sm-auto"
                      onClick={() => navigate("/course?id=" + course._id)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Student Profile */}
        {/*  */}

      </div>
    </div>
    </div>
    </Sidebar>
    
  </div>
</>
        
    );
}
import React, { useState, useEffect, useContext } from "react";
import {useSearchParams} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { endPoint, axiosInstance } from "../endPoint/api";
import Cookies from "js-cookie";
import { AuthContext } from "../Components/Auth/AuthContext";
import Header from "../Components/Other/Header";

const Attendance = (props) => (
  <div>
    <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>No</th>
              <th>Date</th>
              <th>Type</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {props.student.attendance.map((record, index) => (
      
            <tr>
              <td>{index + 1}</td>
              <td>{new Date(record.day).toLocaleDateString()}</td>
              <td>{record.type}</td>
              <td
                style={{ 
                  background: record.status === "Absent" ? "red" : "",
                  color: record.status === "Absent" ? "white" : "auto"}}
              >{record.status}</td>
            </tr>
          
            ))}
          </tbody>
        </table>
      </div>
  </div>
);

const Course = (props) => (
  <div>
    <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>No</th>
              <th>Name</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {props.student.course?.map((record, index) => (
      
                <tr>
                  <td>{index + 1}</td>
                  <td>{record.name}</td>
                  <td>{new Date(record.start_date).toLocaleDateString()}</td>
                  <td>{new Date(record.end_date).toLocaleDateString()}</td>
                  <td
                    className="text-center"
                    style={{ 
                      background: record.status === false ? "red" : "green",
                      color: record.status === false ? "white" : "white"}}
                  >{record.status === true ? "Active" : "Inactive"}</td>
                  <td>
                    <button onClick={() => {props.setActiveTab("course-attendance"); props.setCourseId(record.id); props.setCourseName(record.name);}} type="button" className="btn btn-dark">View Attendance</button>
                  </td>
                </tr>
          
            ))}
          </tbody>
        </table>
      </div>  
  </div>
);

const Profile = () => (
  <div>
    <h4>Profile</h4>
    <p>Student profile content.</p>
  </div>
);

const CourseAttendance = (props) => {
  useEffect(() => {
    
    const fetchCourseAttendance = async () => {
      try {
        const response = await axiosInstance.get(
          `${endPoint.GETSTUDENTATTENDANCEBYCOURSE}/${props.id}`, 
          {
          params: {courseId: props.courseId},
        });
        
      } catch (err) {
        if (err.response && err.response.status === 404) {
          toast.warning("Course attendance could not be fetched");
        } else {
          toast.error("Internal Server Error");
        }
      }
      
    };
    fetchCourseAttendance();
  }, []);

  return (
    <div>
      <div className="d-flex flex-row justify-content-between align-items-start">
        <button
          className="btn btn-secondary mb-2 p-2"
          onClick={() => props.setActiveTab("courses")}
        >
          ← Back to Courses
        </button>
        <h5>Attendance for {props.courseName}</h5>

      </div>
      

      <p>Course Attendance</p>
    </div>
  );
};

export default function StudentPage () {

    const [loading, setLoading] = useState(true);
    const [student, setStudent] = useState(null);
    const [courseId, setCourseId] = useState(null);
    const [courseName, setCourseName] = useState(null);

    const [id, setId] = useState(null);
    const [searchParams] = useSearchParams();

    const {state} = useContext(AuthContext);
    const {user, isAuthenticated} = state;
    const [activeTab, setActiveTab] = useState("attendance");

    const tabs = [
      { id: "attendance", label: "Attendance" },
      { id: "courses", label: "Courses" },
      { id: "profile", label: "Profile" },
    ];

    const renderContent = () => {
      switch (activeTab) {
        case "attendance":
          return <Attendance student={student} />;
        case "courses":
          return <Course student={student} setActiveTab={setActiveTab} setCourseId={setCourseId} setCourseName={setCourseName} />;
        case "profile":
          return <Profile />;
        case "course-attendance":
          return <CourseAttendance setActiveTab={setActiveTab} id={id} courseId={courseId} courseName={courseName} />;
        default:
          return null;
      }
    };

    const queryId = searchParams.get("id");

    useEffect(() => {
        if (!queryId) return; // no id, do nothing
        setId(queryId);

        const getProfile = async () => {
        const token = Cookies.get("token");
        try {
            setLoading(true);
            const response = await axiosInstance.get(endPoint.GETSTUDENT, {
            params: { id: queryId },
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            });
            
            console.log(response.data);
            setStudent(response.data);
        } catch (err) {
            console.error("Error fetching student profile:", err);
            if (err.response && err.response.status === 401) {
            toast.warning("Student profile could not be fetched");
            } else {
            toast.error("Internal Server Error");
            }
        } finally {
            setLoading(false);
        }
        };

        getProfile();
    }, [queryId]);

    return (
        <>
            <Header
                isAuthenticated={isAuthenticated}
                user={user ? user.name : null}
             />
             <ToastContainer position="top-right" autoClose={3000} hideProgressBar={true} closeOnClick pauseOnHover draggable theme="colored" />
            <div className="container pt-5">
                {loading ? (
                  <div className="loading-overlay">
                    <p className="text-center">Loading student profile...</p>
                  </div>
                ) : student && (
                  <>
                    <h1 className="p-5 text-center">Student Profile</h1>
                    <div className="d-flex flex-row gap-5 w-100">
                      <div className="card align-self-start p-4">
                        <h4>{student.name}</h4>
                        <hr/>
                        <h5>{student.section}</h5>
                      </div>
                      {/* Horizontal Menu */}
                      <div className="w-75">
                      {activeTab !== "course-attendance" && (
                      <div className="d-flex gap-4 border-bottom ">
                        {tabs.map((tab) => (
                          <div
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`menu-item ${
                              activeTab === tab.id ? "active" : ""
                            }`}
                          >
                            {tab.label}
                          </div>
                        ))}
                      </div>
                      )}

                      {/* Dynamic Content */}
                      <div className="content-box mt-3">{renderContent()}</div>
                      </div>
                    </div>
                  </>
                  
                  )}
            </div>
        </>
    );
}
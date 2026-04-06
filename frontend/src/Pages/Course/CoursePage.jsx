import { useState, useEffect, useContext } from "react";
import {useSearchParams} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { endPoint, axiosInstance } from "../../endPoint/api";
import Cookies from "js-cookie";
import { AuthContext } from "../../Components/Auth/AuthContext";
import Header from "../../Components/Other/Header";

const tabs = [
  { id: "students", label: "Students" },
  { id: "add", label: "Update Students List" },
];

const CourseAttendance = (props) => {
  const [attendance, setAttendance] = useState([]);

  useEffect(() => {
    if (!props.courseId || !props.student?._id) return;

    const fetchAttendance = async () => {
      const token = Cookies.get("token");
      try {
        const response = await axiosInstance.get(
          `${endPoint.GETSTUDENTATTENDANCEBYCOURSE}/${props.student._id}`, 
          {
            params: { courseId: props.courseId },
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
        });
        setAttendance(response.data.slice(-10));
      } catch (err) {
        console.error("Error fetching attendance:", err);
        toast.error(err.response && err.response.data && err.response.data.message ? err.response.data.message : "Internal Server Error");
      }
    };
    fetchAttendance();
  }, [props.courseId, props.student]);

  return (
    <div className="d-flex flex-row justify-content-center">
      {
        attendance.length === 0 ? (
          <p>No records found</p>
        ) : (
          attendance.map((record, index) => (
            <span
              key={index}
              className={`btn btn-${
                record.status === "Absent"
                  ? "danger"
                  : record.status === "Present"
                  ? "success"
                  : record.status === "Late-30mins"
                  ? "warning"
                  : record.status === "Permission"
                  ? "primary"
                  : "secondary"
              }`}
            >
              {record.status === "Present"
                ? "✓"
                : record.status === "Absent"
                ? "A"
                : record.status === "Late-30mins"
                ? "L"
                : record.status === "Permission"
                ? "P"
                : "N/A"}
            </span>
          ))
        )
      }
    </div>
  );
};

const Student = (props) => {
   const [activeStudent, setActiveStudent] = useState(null);
  
  return (
    <div>
      <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>No</th>
                <th>Name</th>
                <th>Section</th>
                <th>Attendance Status</th>
              </tr>
            </thead>
            <tbody>
              {props.student.map((record, index) => (
        
              <tr>
                <td>{index + 1}</td>
                <td>{record.name}</td>
                <td>{record.section}</td>
                <td>
                  {activeStudent === record._id ? (
                    <CourseAttendance courseId={props.courseId} student={record} />
                    // <button className="btn btn-danger" onClick={() => setActiveStudent(null)}>Mark Absent</button>
                  ) : (
                    <button className="btn btn-secondary" onClick={() => setActiveStudent(record._id)}>
                      <span className="bi bi-eye p-2"></span>
                    </button>
                  )}
                </td>
              </tr>
            
              ))}
            </tbody>
          </table>
        </div>
    </div>
  );
}

const AddStudents = (props) => {
  const [students, setStudents] = useState([]);
  const section = props.section;
  const existingStudents = props.students && props.students.map(student => student._id);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axiosInstance.get(endPoint.STUDENTS, {
          params: { section },
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
            "Content-Type": "application/json",
          },
        });
        setStudents(response.data);
      } catch (err) {
        console.error("Error fetching students:", err);
        toast.error("Internal Server Error");
      }
    };

    if (section) {
      fetchStudents();
    }
  }, [section]);

  return (
    <div>
      {students.length > 0 && (
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>No</th>
                <th>Name</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => (
                <tr key={student._id}>
                  <td>{index + 1}</td>
                  <td>{student.name}</td>
                  <td>
                    {props.course.status ? (
                      <button
                      className={`btn btn-${existingStudents.includes(student.id) ? "danger" : "primary"}`}
                      onClick={() => {existingStudents.includes(student.id) ? (() => {
                        props.addStudentToCourse(props.course._id, student.id, "remove");
                        props.setActiveTab("students");
                      })() : ( () => {props.addStudentToCourse(props.course._id, student.id, "add"); props.setActiveTab("students");})()}}

                    >
                      {existingStudents.includes(student.id) ? "Remove from Course" : "Add to Course"}
                    </button>): (
                      <span className="text-muted">Course is inactive</span>
                    )}
                    
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default function CoursePage () {

    const [loading, setLoading] = useState(true);
    const [course, setCourse] = useState(null);
    const [students, setStudents] = useState(null);
    const [status, setStatus] = useState(true);
    const [id, setId] = useState(null);
    const [searchParams] = useSearchParams();
    const [activeTab, setActiveTab] = useState("students");

    const {state} = useContext(AuthContext);
    const {user, isAuthenticated} = state;

    const queryId = searchParams.get("id");

    useEffect(() => {
        if (!queryId) return;
        setId(queryId);

        const getProfile = async () => {
          const token = Cookies.get("token");
          try {
              setLoading(true);
              const response = await axiosInstance.get(endPoint.GETCOURSE, {
              params: { id: queryId },
              headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
              },
              });

              const studentsResponse = await axiosInstance.get(endPoint.GETCOURSESTUDENTS, {
                params: { id: queryId },
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
              });
              console.log(studentsResponse.data);

              setStudents(studentsResponse.data);

              setCourse(response.data);
              setStatus(response.data.status);
          } catch (err) {
              console.error("Error fetching course:", err);
              if (err.response && err.response.status === 401) {
              toast.warning("Course could not be fetched");
              } else {
              toast.error("Internal Server Error");
              }
          } finally {
              setLoading(false);
          }
        };

        getProfile();
    }, [queryId]);

    const renderContent = () => {
      switch (activeTab) {
        case "students":
          return <Student student={students} getStudents={getStudents} courseId={id}/>;
        case "add":
          return <AddStudents students={students} course={course} addStudentToCourse={addStudentToCourse} section={course.section} setActiveTab={setActiveTab}/>;
        default:
          return null;
      }
    };

    const addStudentToCourse = async (courseId, studentId, action) => {
      const token = Cookies.get("token");
      try {
        setLoading(true);
        await axiosInstance.post(endPoint.ADDSTUDENTTOCOURSE, {
          courseId,
          studentId,
          action,
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        toast.success("Student added to course successfully");
      } catch (err) {
        console.error("Error adding student to course:", err);
        if (err.response && err.response.status === 404) {
          toast.warning("Course or student not found");
        } else if (err.response && err.response.status === 400) {
          toast.warning("Student is already enrolled in this course");
        } else {
          toast.error("Internal Server Error");
        }
      } finally {
        setLoading(false);
        const studentsResponse = await axiosInstance.get(endPoint.GETCOURSESTUDENTS, {
          params: { id: courseId },
          headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
          },
        });
        setStudents(studentsResponse.data);
      }
    };

    const updateStatus = async (status) => {
      const token = Cookies.get("token");
      try {
        const response = await axiosInstance.post(endPoint.UPDATECOURSE, {
          id: id,
          status: status,
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        toast.success(response.data.message);
      } catch (err) {
        console.error("Error updating course status:", err);
        if (err.response && err.response.status === 404) {
          toast.warning("Course not found");
        } else {
          toast.error(err.response && err.response.data && err.response.data.message ? err.response.data.message : "Internal Server Error");
        }
      } finally {
        setLoading(false);
      }
    };

    const getStudents = async (section) => {
      const token = Cookies.get("token");
      try {
        const response = await axiosInstance.get(endPoint.STUDENTS, {
          params: { section },
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        return response.data;
      } catch (err) {
        console.error("Error fetching students:", err);
        toast.error("Internal Server Error");
        return [];
      }
    };

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
                    <p className="text-center">Loading Course...</p>
                  </div>
                ) : course && (
                  <>
                  <h1 className="mt-5 text-center align-self-center">Course Page</h1>
                  <div className="d-flex flex-md-row flex-column align-items-start justify-content-start gap-5 mt-5 flex-grow-1">
                    <div className="d-flex flex-md-row flex-column gap-5 w-100">
                      <div className="card p-5 mb-3">
                        <h3 className="text-center"><b>{course.name}</b></h3>
                        <hr></hr>
                        <h6>Section: {course.section}</h6>
                        <h6>Teacher: {course.teacher}</h6>
                        <h6>Start Date: {new Date(course.start_date).toLocaleDateString()}</h6>
                        <h6>End Date: {new Date(course.end_date).toLocaleDateString()}</h6>
                        <div>

                        </div>
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={status}
                            onChange={() => setStatus(!status)}
                          />
                          <label className="form-check-label">
                            Status: {status ? "Active" : "Inactive"}
                          </label>
                        </div>
                        <h6>Created by: {course.created_by.name}</h6>
                        <button type="button" onClick={() => {updateStatus(status); setLoading(true); }} className="btn btn-warning rounded-pill">Update Course</button>
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
                    
                  </div>
                  </>
                  )}
            </div>
        </>
    );
}
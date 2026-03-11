import React, { useContext, useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import '../App.css';
import { AuthContext } from "../Components/Auth/AuthContext";
import Header from "../Components/Other/Header";
import { endPoint, axiosInstance } from "../endPoint/api";
import Loading from "../Components/Other/Loading";
import Cookies from "js-cookie";

const Home = (props) => {
    const getTodayDate = () => new Date().toISOString().split('T')[0];

    const [attendanceDate, setAttendanceDate] = useState(getTodayDate());
    const { state } = useContext(AuthContext);
    const { user, isAuthenticated } = state;
    const [attendances, setAttendances] = useState([]);
    const [message, setMessage] = useState({});
    const [loading, setLoading] = useState(false);
    const [loadingSearch, setLoadingSearch] = useState(true);

    useEffect(() => {
        
        const fetchStudents = async () => {
            // setMessage(null);
            try {
                if (!loading) {
                    setLoadingSearch(true);
                }
                
                console.log(attendanceDate);
                const response = await axiosInstance.post(endPoint.FULLATTENDANCEBYDATE,
                    { "date": attendanceDate },
                    {
                        headers: {
                            "Authorization": `Bearer ${Cookies.get("token")}`,
                            "Content-Type": "application/json"
                        }
                    }
                );
                console.log(response);
                setAttendances(response.data);
                toast.warning("Attendance records loaded for " + attendanceDate);
            } catch (err) {
                console.log("Error fetching attendances:", err);
                if (err.response && err.response.status === 404) {
                    setAttendances([]);
                    toast.warning("No attendance records found for this date");
                } else if (err.response && err.response.status === 401) {
                    toast.error("Unauthorized. Please log in again.");
                } else {
                    toast.error("Error fetching attendances");
                }
            } finally {
                setLoadingSearch(false);
            }
        };

        fetchStudents();
    }, [loading,  attendanceDate]);

    const handleStatusChange = async (attendanceId, status) => {
        const token = Cookies.get("token");
        try {
            const response = await axiosInstance.put(
                endPoint.UPDATEATTENDANCE,
                {
                    attendanceId: attendanceId,
                    status: status
                },
                {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );
            console.log(response);
            toast.success("Attendance updated successfully");
        } catch (err) {
            console.log("Error updating attendance:", err);
            if (err.status === 400) {
                toast.warning("Invalid attendance ID or status");
            } else if (err.status === 401) {
                toast.error("Unauthorized. Please log in again.");
            } else {
                toast.error(err.message);
            }
        } finally {
            setLoading(false);
        }
    };


    const createAttendance = async () => {
        const token = Cookies.get("token");
        console.log(token);
        try {
            setLoadingSearch(true);
            const response = await axiosInstance.post(
                endPoint.CREATEDAILYFORALL, 
                {
                    "date": attendanceDate,
                },
                {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }
            );
            console.log(response);
        } catch (err) {
            console.log("Error creating attendance:", err);
            if (err.status === 400) {
                toast.warning("Attendance for this date already exists");
            } else if (err.status === 401) {
                toast.error("Unauthorized. Please log in again.");
            } else {
                toast.error(err.message);
            }
        } finally {
            setLoadingSearch(false);
        }
    };

    if (loadingSearch) {
        return <Loading message="Loading page..."></Loading>
    }

    return (
        <div>
            <Header isAuthenticated={isAuthenticated} user={user ? user.name : null} role={user ? user.role: null}></Header>
            <div className="container" style={{margin: '10vh auto auto'}}>
                <h1>Student Attendance Dashboard</h1>
                {/* {message &&
                    <div className={`alert alert-${message.type} text-center w-50 mx-auto`} role="alert">
                    {message.message}
                    </div>
                } */}
                <ToastContainer position="top-right" autoClose={3000} hideProgressBar={true} closeOnClick={true} pauseOnHover={true} draggable={true} theme="colored" />
                <div className="d-flex align-items-center justify-content-between mb-3">
                        <input type="date" value={attendanceDate} onChange={(e) => { setAttendanceDate(e.target.value); setLoadingSearch(true); }} className="form-control w-50 mb-3"/>
                        <div className="ms-auto">
                            <button className="btn btn-success mb-3 mx-2 float-end" onClick={(e) => { e.preventDefault(); createAttendance(); }}>Create Attendance</button>
                            <button className="btn btn-warning mb-3 mx-2 float-end" onClick={(e) => { e.preventDefault(); createAttendance(); }}>Update Attendance</button>
                        </div>
                </div> 
                <div className="position-relative">

            {loading && (
                <div className="loading-overlay">
                <div className="spinner-border text-light"></div>
                </div>
            )}

            {attendances.length === 0 ? (
                <p>No attendance records found.</p>
            ) : (
                <div>
                <table className="table table-striped">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Section</th>
                        <th>Day</th>
                        <th>Status</th>
                        <th>Change</th>
                    </tr>
                    </thead>

                    <tbody>
                    {attendances.map((attendance, index) => (
                        <tr key={attendance._id || attendance.id}>
                        <td>{index + 1}</td>
                        <td>{attendance.student.name || "Unknown Name"}</td>
                        <td>{attendance.student.section || "Unknown Section"}</td>
                        <td>{attendance.day || "Unknown Day"}</td>
                        <td>{attendance.status ? attendance.status : "Not Set"}</td>
                        <td>
                            <button
                            className="btn btn-success p-1 mx-1"
                            onClick={() => {setLoading(true); handleStatusChange(attendance._id, "Present");}}>
                            ✓
                            </button>

                            <button className="btn btn-danger p-1 mx-1" onClick={() => {setLoading(true); handleStatusChange(attendance._id, "Absent");}}>                         A
                            </button>

                            <button
                            className="btn btn-warning p-1 mx-1"
                            onClick={() => {setLoading(true); handleStatusChange(attendance._id, "Late-30mins");}}
                            >
                            L
                            </button>

                            <button
                            className="btn btn-primary p-1 mx-1"
                            onClick={() => {setLoading(true); handleStatusChange(attendance._id, "Permission");}}
                            >
                            P
                            </button>
                        </td>
                        </tr>
                    ))}
                    </tbody>

                </table>
                </div>
            )}

            </div>
            </div>
        </div>
    );
};

export default Home;
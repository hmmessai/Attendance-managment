import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import '../App.css';
import { AuthContext } from "../Components/Auth/AuthContext";
import Header from "../Components/Other/Header";
import StudentChoice from "../Components/Other/StudentChoice";
import { endPoint, axiosInstance } from "../endPoint/api";
import Loading from "../Components/Other/Loading";
import Cookies from "js-cookie";

const Home = (props) => {
    const getTodayDate = () => new Date().toISOString().split('T')[0];

    const [attendanceDate, setAttendanceDate] = useState(getTodayDate());
    const { state } = useContext(AuthContext);
    const { user, isAuthenticated } = state;
    const [attendances, setAttendances] = useState([]);
    const [loading, setLoading] = useState(true);
    const [section, setSection] = useState("");
    const navigate = useNavigate();
    // const [loadingSearch, setLoadingSearch] = useState(true);

    useEffect(() => {
        
        const fetchStudents = async () => {
            // setMessage(null);
            try {
                console.log(attendanceDate);
                const response = await axiosInstance.post(endPoint.FULLATTENDANCEBYDATE,
                    { "date": attendanceDate, "section": section },
                    {
                        headers: {
                            "Authorization": `Bearer ${Cookies.get("token")}`,
                            "Content-Type": "application/json"
                        }
                    }
                );
                console.log(response);
                setAttendances(response.data);
                if (response.data == []) {
                    toast.warning("No attendance records found for this date");
                } 
            } catch (err) {
                console.log("Error fetching attendances:", err);
                if (err.response && err.response.status === 404) {
                    setAttendances([]);
                    toast.warning("No attendance records found for this date and section");
                } else if (err.response && err.response.status === 401) {
                    toast.error("Unauthorized. Please log in again.");
                } else {
                    toast.error("Error fetching attendances");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
    }, [loading,  attendanceDate, section]);

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
                });
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

    const lockAttendance = async () => {
        const token = Cookies.get("token");
        console.log(token);
        try {
            const response = await axiosInstance.post(
                endPoint.LOCKATTENDANCE, 
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
            toast.success("Attendance locked successfully for " + attendanceDate);
        } catch (err) {
            console.log("Error locking attendance:", err);
            if (err.status === 401) {
                toast.error("Unauthorized. Please log in again.");
            } 
            else if (err.status === 403) {
                toast.error("Attendance date should be in the past to be locked.");
            }else if (err.status === 404) {
                toast.warning("No attendance records found for the specified date");
            }
            else {
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
            const response = await axiosInstance.post(
                endPoint.CREATEDAILYFORALL, 
                {
                    "date": attendanceDate,
                    "section": section
                },
                {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }
            );
            console.log(response);
            toast.success("Attendance created successfully for " + attendanceDate);
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
            setLoading(false);
        }
    };

    // if (loadingSearch) {
    //     return <Loading message="Loading page..."></Loading>
    // }

    return (
        <div>
            <Header isAuthenticated={isAuthenticated} user={user ? user.name : null} role={user ? user.role: null}></Header>
            <div className="container" style={{margin: '10vh auto auto'}}>
                <h1 className="text-center mt-4 pt-4">Student Attendance Dashboard</h1>

                <ToastContainer position="top-right" autoClose={3000} hideProgressBar={true} closeOnClick={true} pauseOnHover={true} draggable={true} theme="colored" />
                {!isAuthenticated ? <div></div> : ( 
                <div> 
                    {user && user.role === "Visitor" ? 
                    <div>
                        <StudentChoice/>
                    </div>
                     : (
                        <div>
                            <div className="d-flex flex-column-sm align-items-center justify-content-between mb-3 mt-3">
                                    <input type="date" value={attendanceDate} onChange={(e) => { setAttendanceDate(e.target.value); setLoading(true); }} className="form-control w-25 mb-3 mx-2"/>
                                    <select
                                        value={section}
                                        size={5}
                                        onChange={(e) => {
                                            setSection(e.target.value);
                                            setLoading(true);
                                        }}
                                        className="form-control w-25 mb-3 mx-2"
                                        >
                                        <option value="">All Sections(ሁሉም)</option>
                                        <option value="1">1ኛ ክፍል</option>
                                        <option value="2">2ኛ ክፍል</option>
                                        <option value="3">3ኛ ክፍል</option>
                                        <option value="4">4ኛ ክፍል</option>
                                        <option value="5">5ኛ ክፍል</option>
                                        <option value="6">6ኛ ክፍል</option>
                                        <option value="7">7ኛ ክፍል</option>
                                        <option value="8">8ኛ ክፍል</option>
                                        <option value="9">9ኛ ክፍል</option>
                                        <option value="10">10ኛ ክፍል</option>
                                        <option value="11">ዮሐንስ ቀዳማይ</option>
                                        <option value="12">ዮሐንስ ካልዐይ</option>
                                        <option value="13">ዮሐንስ ሳልሳይ</option>
                                        <option value="14">ዮሐንስ ማዕከላዊ</option>
                                    </select>
                                    
                                    {isAuthenticated && user && user.role !== "Visitor" && (
                                    <div className="ms-auto">
                                        <button className="btn btn-success mb-3 mx-2 float-end" onClick={(e) => { e.preventDefault(); createAttendance(); setLoading(true);}}>Create Attendance</button>
                                        <button className="btn btn-warning mb-3 mx-2 float-end" onClick={(e) => { e.preventDefault(); }}>Update Attendance</button>
                                        <button className="btn btn-primary mb-3 mx-2 float-end" onClick={(e) => { e.preventDefault(); lockAttendance(); setLoading(true);}}>Lock Attendance</button>
                                        {isAuthenticated && user && user.role === "Admin" && (
                                            <button className="btn btn-info mb-3 mx-2 float-end" onClick={(e) => { e.preventDefault(); navigate('/add-student')}}>Add Students</button>
                                        )}
                                    </div>)}
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
                                            {isAuthenticated && (
                                            <th>Change</th>)}
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
                                            {isAuthenticated && ( attendance.locked ? <td>Locked</td> :
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
                                            </td>)}
                                            </tr>
                                        ))}
                                        </tbody>

                                    </table>
                                    </div>
                                )}

                            </div>
                    </div>)}
                </div>)}
                
            </div>
        </div>
    );
};

export default Home;
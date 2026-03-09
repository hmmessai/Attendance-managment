import React, { useContext, useState, useEffect } from "react";
import '../App.css';
import { AuthContext } from "../Components/Auth/AuthContext";
import Header from "../Components/Other/Header";
import { endPoint, axiosInstance } from "../endPoint/api";
import Loading from "../Components/Other/Loading";
import Cookies from "js-cookie";

const Home = (props) => {
    const getTodayDate = () => new Date("2026-02-19").toISOString().split('T')[0];

    const [attendanceDate, setAttendanceDate] = useState(getTodayDate());
    const { state } = useContext(AuthContext);
    const { user, isAuthenticated } = state;
    const [students, setStudents] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadingSearch, setLoadingSearch] = useState(true);

    useEffect(() => {
        const fetchStudents = async () => {
            if(!loadingSearch) return;
            try {
                setLoadingSearch(true);
                const response = await axiosInstance.get(endPoint.GETFULLATTENDANCEBYDATE, {
                    params: { date: attendanceDate },
                    headers: {
                        "Authorization": `Bearer ${Cookies.get("token")}`
                    }
                });
                console.log(response);
                setStudents(response.data);
            } catch (err) {
                console.log("Error fetching students:", err);
                setError(err.message);
            } finally {
                setLoadingSearch(false);
            }
        };

        fetchStudents();
    }, [loadingSearch, attendanceDate]);

    const createAttendance = async () => {
        const token = Cookies.get("token");
        console.log(token);
        try {
            setLoadingSearch(true);
            const response = await axiosInstance.post(
                endPoint.POSTATTENDANCE, 
                {
                    day: attendanceDate,
                    data: students.map(student => ({
                        studentId: student.id,
                        status: null
                    }))
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
            setError(err.message);
        } finally {
            setLoadingSearch(false);
        }
    };

    if (loadingSearch) {
        return <Loading></Loading>
    }

    return (
        <div>
            <Header isAuthenticated={isAuthenticated} user={user ? user.name : null} role={user ? user.role: null}></Header>
            <div className="container" style={{margin: '10vh auto auto'}}>
                <h1>Student Attendance Dashboard</h1>
                <div className="d-flex align-items-center justify-content-between mb-3">
                        <input type="date" value={attendanceDate} onChange={(e) => { setAttendanceDate(e.target.value); setLoadingSearch(true); }} className="form-control w-50 mb-3"/>
                        <div className="ms-auto">
                            <button className="btn btn-success mb-3 mx-2 float-end" onClick={(e) => { e.preventDefault(); createAttendance(); }}>Create Attendance</button>
                            <button className="btn btn-warning mb-3 mx-2 float-end" onClick={(e) => { e.preventDefault(); createAttendance(); }}>Update Attendance</button>
                        </div>
                </div>
                {students.length === 0 ? (
                    <p>No students found in the database.</p>
                ) : (<div>
                    <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Section</th>
                            <th>Day</th>
                        </tr>
                    </thead>
                    <tbody>
                    {students.map((student, index) => (
                        <tr key={student.student._id || student.id}>
                            <td>{index + 1}</td>
                            <td>{student.student.name || "Unknown Name"}</td>
                            <td>{student.student.section || "Unknown Section"}</td>
                            <td>{student.status ? student.status : "No attendance data"}</td>
                        </tr>
                    ))}
                    </tbody>

                    </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
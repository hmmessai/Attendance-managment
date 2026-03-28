import React, { useState, useEffect, useContext } from "react";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { endPoint, axiosInstance } from "../endPoint/api";
import Cookies from "js-cookie";
import { AuthContext } from "../Components/Auth/AuthContext";
import Header from "../Components/Other/Header";

export default function StudentChoice( props ) {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [student, setStudent] = useState(null);
    const {state} = useContext(AuthContext);
    const {user, isAuthenticated} = state;
    

    useEffect(() => {
        
        const fetchStudents = async () => {
            try {
                const response = await axiosInstance.get(endPoint.STUDENTS,
                    {
                        headers: {
                            "Authorization": `Bearer ${Cookies.get("token")}`,
                            "Content-Type": "application/json"
                        }
                    }
                );
                console.log(response);
                setStudents(response.data);
                if (response.data == []) {
                    toast.warning("No Students are available.");
                } 
            } catch (err) {
                console.log("Error fetching students:", err);
                if (err.response && err.response.status === 404) {
                    setStudents([]);
                    toast.warning("No Students found");
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
    }, []);

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
            <Header isAuthenticated={isAuthenticated} user={user ? user.name : null} role={user ? user.role: null}></Header>
            <div className="container" style={{margin: '10vh auto auto'}}>
                <h1 className="text-center mt-5 p-3">Student Attendance Dashboard</h1>
                <div className="text-center p-5 fs-4">View Students Modal</div>
                <div className="position-relative">
                    {loading && (
                        <div className="loading-overlay">
                        <div className="spinner-border text-light"></div>
                        </div>
                    )}
                    <div className="d-flex flex-row align-items-start justify-content-between" style={{ minHeight: "60vh" }}>
                        <table className="table table-stripped align-items-center w-50">
                            <thead>
                                <tr>
                                    <td>No.</td>
                                    <td>ID</td>
                                    <td>Name</td>
                                    <td>Section</td>
                                    <td>View</td>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map((student, index) => (
                                    
                                    <tr>
                                        <td>{index}</td>
                                        <td>{student.id}</td>
                                        <td>{student.name}</td>
                                        <td>{student.section}</td>
                                        <td>
                                            <button key={student.id} className="btn btn-dark px-5" onClick={() => getProfile(student.id)}>View</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {student ? 
                        <div className="position-sticky" style={{top: 75}}>
                            <h1>Name: {student.name}</h1>
                            <h2>Section: {student.section}</h2>
                            <table className="table table-stripped">
                                {student.attendance.map((att, index) => {
                                    return(<tbody>
                                        <tr>
                                            <td>{index}</td>
                                            <td>{att.day}</td>
                                            <td style={{background: att.status === "Absent" ? 'red': ''}}>{att.status}</td>
                                        </tr>
                                    </tbody>)
                                })}
                            </table>
                        </div> : null}
                    </div>
                </div>
            </div>
        </>
        
    );
}
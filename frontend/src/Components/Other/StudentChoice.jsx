import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { endPoint, axiosInstance } from "../../endPoint/api";
import Cookies from "js-cookie";
import { AuthContext } from "../Auth/AuthContext";

export default function StudentChoice( props ) {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [student, setStudent] = useState(null);
    

    useEffect(() => {
        
        const fetchStudents = async () => {
            try {
                const response = await axiosInstance.get(endPoint.GETSTUDENTBYUSER,
                    {
                        headers: {
                            "Authorization": `Bearer ${Cookies.get("token")}`,
                            "Content-Type": "application/json"
                        }
                    }
                );
                console.log(response);
                setStudents(response.data.students);
                if (response.data == []) {
                    toast.warning("You have not subscribed to any of our students updates");
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
        <div className="position-relative">
            {loading && (
                <div className="loading-overlay">
                <div className="spinner-border text-light"></div>
                </div>
            )}
            <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: "60vh", display: student !== {} ? 'none': 'show' }}>
                <h2 className="mb-4">Select a Student</h2>
                {students.map((student, index) => (
                    <button key={student._id} className="btn btn-dark w-50 m-2" onClick={() => getProfile(student._id)}>
                        {student.name}
                    </button>
                ))}
                <div 
                className="container-fluid p-5 mt-3"
                style={{ display: student ? 'block' : 'none' }}
                >
                    <div className="d-flex flex-row align-items-center justify-content-between">
                        <div className="align-self-start bg-dark p-3 pt-0 rounded-pill">
                            <img src="https://picsum.photos/id/227/300/300" alt="profile-pic"/>
                            <h2 className="text-center text-white">{student && student.name}</h2>
                            <h3 className="text-center text-white">{student && student.section} ክፍል</h3>
                        </div>
                        <div className="align-self-start">
                            <h1>{student && student.name}'s Attendance Records</h1>
                            <table className="table table-stripped flex-column align-items-center justify-content-left">
                                <thead>
                                    <tr key={student && student.id}>
                                        <th>ID</th>
                                        <th>Date</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {student && student.attendance && student.attendance.map((att, index) => { 
                                        return(
                                            <tr key={att.id}>
                                                <td>{index}</td>
                                                <td>{att.day}</td>
                                                <td style={{background: att.status === "Absent" ? 'red': ''}}>{att.status}</td>
                                            </tr>
                                        
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    
                </div>
            </div>
        </div>
        
    );
}
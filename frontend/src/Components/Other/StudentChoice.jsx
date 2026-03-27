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
    const [student, setStudent] = useState({});
    

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
    }, [loading]);

    const getProfile = async (id) => {
        try {
            setLoading(true);
            const response = await axiosInstance.get(endPoint.GETSTUDENT,
                {
                    id: id,
                },
                {
                    headers: {
                        "Authorization": `Bearer ${Cookies.get("token")}`,
                        "Content-Type": "application/json"
                    }
                });
            
            console.log(response);
            setStudent(response.data);
        } catch (err) {
            console.log("Error fetching student Profile:", err);
            if (err.response && err.response.status === 404) {
                setStudents([]);
                toast.warning("Student profile could not be fetched");
            } else if (err.response && err.response.status === 401) {
                toast.error("Unauthorized. Please log in again.");
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
            <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: "60vh", display: !student ? 'none': 'show' }}>
                <h2 className="mb-4">Select a Student</h2>
                {students.map((student, index) => (
                    <button key={student.id} className="btn btn-dark w-50 m-2" onClick={getProfile(student.id)}>
                        {student.name}
                    </button>
                ))}
                <div 
                className="d-flex flex-row align-items-center justify-content-center"
                style={{ display: student ? 'none' : 'flex' }}
                >
                    <h1>{student.name}</h1>
                    {student.attendance.map((att, index) => {
                        <div>
                            <p>{index}</p>
                            <p>{att.date}</p>
                        </div>
                        
                    })}
                </div>
            </div>
        </div>
        
    );
}
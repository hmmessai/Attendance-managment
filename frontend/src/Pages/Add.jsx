import { useState, useContext, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "../Components/Auth/AuthContext";
import { endPoint, axiosInstance } from "../endPoint/api";
import Header from "../Components/Other/Header";
import Cookies from "js-cookie";

const Add = (props) => {
    const [name, setName] = useState("");
    const [section, setSection] = useState("");
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(false);
    const { state } = useContext(AuthContext);
    const { isAuthenticated, user } = state;

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const optionsResponse = await axiosInstance.get(endPoint.OPTIONS);
                setSections(optionsResponse.data.sections);
            } catch (err) {
                console.log("Error fetching options:", err);
                toast.error("Failed to load options");
            }
        };

        fetchOptions();
    }, []);

    const submitHandler = async (e) => {
        try {
            setLoading(true);
            e.preventDefault();
            const response = await axiosInstance.post(endPoint.NEWSTUDENT,
                { "name": name, "section": section },
                {
                    headers: {
                        "Authorization": `Bearer ${Cookies.get("token")}`,
                        "Content-Type": "application/json"
                    }
                }
            );
            if (response.status === 201) {
                toast.success(`Student ${name} added successfully`);
            } else {
                toast.error("Failed to add student");
            }
        } catch (err) {
            console.log("Error creating student:", err);
            if (err.response && err.response.data && err.response.data.message) {
                toast.error(err.response.data.message);
            } else {
                toast.error("An unexpected error occurred");
            }
        } finally {
            setLoading(false);
        }
        
    };
    return (
        <>
            <Header isAuthenticated={isAuthenticated} user={user ? user.name : null} role={user ? user.role: null}></Header>
                        <div className="container" style={{margin: '10vh auto auto'}}>
                            <h1 className="text-center mt-4 pt-4">Student Attendance Dashboard</h1>
            <div className="text-center p-5 m-4 fs-4">Add Student Modal</div>
            <div className="d-flex flex-column justify-content-center align-items-center">
                <ToastContainer position="top-right" autoClose={3000} hideProgressBar={true} closeOnClick={true} pauseOnHover={true} draggable={true} theme="colored" />
                <form className="w-50" onSubmit={submitHandler} action="">
                    <div className="d-flex flex-column gap-3">
                    <input
                        type="text"
                        className="form-control p-3"
                        placeholder="Name"
                        onChange={(e) => {
                        setName(e.target.value);
                        }}
                    />

                    <select
                            value={section}
                            onChange={(e) => {
                                setSection(e.target.value);
                                setLoading(true);
                            }}
                            className="form-control mb-3 mx-2"
                            >
                            {sections.map((sec, index) => (
                                <option key={index} value={sec}>{sec}</option>
                            ))}
                        </select>

                    
                    </div>
                    <div className="my-3">
                    
                    </div>
                    <div className="d-grid">
                        <button
                            type="submit"
                            className="btn btn-dark action-btn fs-5 fw-semibold">
                            Add Student
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </>
    );
};

export default Add;
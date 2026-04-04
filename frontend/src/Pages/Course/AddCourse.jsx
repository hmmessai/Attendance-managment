import { useState, useContext, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "../../Components/Auth/AuthContext";
import { endPoint, axiosInstance } from "../../endPoint/api";
import Header from "../../Components/Other/Header";
import Cookies from "js-cookie";

const AddCourse = (props) => {
    const [name, setName] = useState("");
    const [section, setSection] = useState("");
    const [teacher, setTeacher] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [status, setStatus] = useState(true);
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
        e.preventDefault();

        try {
            setLoading(true);

            const response = await axiosInstance.post(
                endPoint.NEWCOURSE,
                {
                    name,
                    section,
                    status,
                    teacher,
                    start_date: startDate,
                    end_date: endDate,
                    created_by: user?.id
                },
                {
                    headers: {
                        Authorization: `Bearer ${Cookies.get("token")}`,
                    }
                }
            );
            if (response.status === 201) {
                toast.success(`Course ${name} created successfully`);
            } else {
                toast.error("Failed to create course");
            }
        } catch (err) {
            console.log("Error creating course:", err);
            if (err.response && err.response.data && err.response.data.message) {
                toast.error(err.response.data.message);
            } else {
                toast.error("An unexpected error occurred");
            }
        } finally {
            setLoading(false);
            setName("");
            setSection("");
            setTeacher("");
            setStartDate("");
            setEndDate("");
        }
        
    };
    return (
        <>
            <Header isAuthenticated={isAuthenticated} user={user ? user.name : null} role={user ? user.role: null}></Header>
            <div className="container" style={{margin: '10vh auto auto'}}>
                <div className="text-center p-5 m-4 fs-4">Add Course Modal</div>
                <div className="d-flex flex-column justify-content-center align-items-center gap-4 m-4 p-4">
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

                        <input
                            type="text"
                            className="form-control p-3"
                            placeholder="Teacher"
                            onChange={(e) => {
                            setTeacher(e.target.value);
                            }}
                        />

                        <input
                            type="date"
                            className="form-control p-3"
                            placeholder="Start Date"
                            onChange={(e) => {
                            setStartDate(e.target.value);
                            }}
                        />

                        <input
                            type="date"
                            className="form-control p-3"
                            placeholder="End Date"
                            onChange={(e) => {
                            setEndDate(e.target.value);
                            }}
                        />
                        <div className="d-flex flex-row align-items-left gap-3">
                            <label className="d-flex align-items-center gap-2">
                                Status: 
                            </label>
                            <button
                                onClick={() => setStatus(!status)}
                                type="button"
                                style={{
                                    padding: "10px 20px",
                                    border: "none",
                                    borderRadius: "6px",
                                    cursor: "pointer",
                                    backgroundColor: status ? "green" : "gray",
                                    color: "white",
                                    width: "100px",
                                }}
                                >
                                {status ? "Active" : "Inactive"}
                            </button>
                        </div>
                        

                        </div>
                        <div className="my-3">
                        
                        </div>
                        <div className="d-grid">
                            <button
                                type="submit"
                                className="btn btn-dark action-btn fs-5 fw-semibold">
                                Create Course
                            </button>
                        </div>
                    </form>
                </div>
        </div>
    </>
    );
};

export default AddCourse;
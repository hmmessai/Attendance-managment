import axios from "axios";

const BaseUrl = process.env.REACT_APP_API_URI || "https://supreme-journey-6x6qr77v76xf4wj9-5000.app.github.dev/api";

const endPoint = {
    LOGIN: `${BaseUrl}/auth/login`,
    SIGNUP: `${BaseUrl}/auth/register`,
    ME: `${BaseUrl}/auth/currentUser`,
    STUDENTS: `${BaseUrl}/student/all`,
    GETSTUDENT: `${BaseUrl}/student/get`,
    GETSTUDENTBYUSER: `${BaseUrl}/student/get-by-user`,
    NEWSTUDENT: `${BaseUrl}/student/create`,
    POSTATTENDANCE: `${BaseUrl}/attendance/post-bulk`,
    OPTIONS: `${BaseUrl}/attendance/options`,
    CREATEDAILYFORALL: `${BaseUrl}/attendance/daily-all`,
    CREATEDAILYFORSPECIFIC: `${BaseUrl}/attendance/daily-specific`,
    FULLATTENDANCE: `${BaseUrl}/attendance/get-full`,
    FULLATTENDANCEBYDATE: `${BaseUrl}/attendance/get-full-by-date`,
    DAILYATTENDANCE: `${BaseUrl}/attendance/get-daily`,
    YEARLYATTENDANCE: `${BaseUrl}/attendance/create-yearly`,
    YEARLYATTENDANCEALL: `${BaseUrl}/attendance/create-yearly-all`,
    UPDATEATTENDANCE: `${BaseUrl}/attendance/update-status`,
    LOCKATTENDANCE: `${BaseUrl}/attendance/lock`,
    NEWCOURSE: `${BaseUrl}/course/create`,
    ALLCOURSES: `${BaseUrl}/course/all`,
    GETCOURSE: `${BaseUrl}/course/get`,
    GETCOURSESTUDENTS: `${BaseUrl}/course/get-students`,
    GETCOURSEBYSECTION: `${BaseUrl}/course/get-by-section`,
    GETCOURSEBYSTUDENT: `${BaseUrl}/course/get-by-student`,
    GETSTUDENTATTENDANCEBYCOURSE: `${BaseUrl}/course/get-student-attendance`,
}

const axiosInstance = axios.create({
    baseURL: BaseUrl,
});

export { endPoint, axiosInstance };

const ErrorPage = () => {
  return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh", flexDirection: "column", width: "100%" }}>
      <h1>Unauthorized Access</h1>
      <hr className="w-100" />
      <p className="pb-2">You are not authorized to view this page.</p>
      <a href="/home" className="btn btn-secondary mt-3 px-3">Back to Home</a>
    </div>
  );
};

export default ErrorPage;
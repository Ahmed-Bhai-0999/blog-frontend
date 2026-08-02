import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import { Outlet } from "react-router-dom";
import { useBlog } from "../context/BlogContext";
import Loader from "../components/common/Loader";
import Error from "../components/common/Error";

export default function MainLayout() {
    const { loading, error } = useBlog();

    if (loading) {
        return (
            <div className="d-flex align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
                <Loader />
            </div>
        );
    }

    if (error) {
        return (
            <div className="container py-5 mt-5">
                <Error message={error} />
            </div>
        );
    }

    return (
        <div className="d-flex flex-column min-vh-100">
            <Navbar />

            <main className="flex-grow-1">
                <Outlet />
            </main>

            <Footer />
        </div>
    );
}
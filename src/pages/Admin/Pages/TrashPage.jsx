import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import { getTrashPages, restorePage, forceDeletePage } from "../../../services/pageService";

export default function TrashPage() {

    const [pages, setPages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadTrashPages();
    }, []);

    const loadTrashPages = async () => {
        setLoading(true);

        try {
            const res = await getTrashPages();
            setPages(res.data.page);
        } catch (err) {
            toast.error(err.response?.data?.message || "Unable to load trash pages.");
        }
        setLoading(false);
    };

    const handleRestore = async (id) => {
        if (!window.confirm("Restore this page?")) return;

        try {
            const res = await restorePage(id);
            toast.success(res.data.message);
            loadTrashPages();
        } catch (err) {
            toast.error(err.response?.data?.message);
        }
    };

    const handleForceDelete = async (id) => {
        if (!window.confirm("Delete permanently?")) return;

        try {
            const res = await forceDeletePage(id);
            toast.success(res.data.message);
            loadTrashPages();
        } catch (err) {
            toast.error(err.response?.data?.message);
        }
    };

    return (

        <div className="container-fluid">

            <div className="card shadow">
                <div className="card-header d-flex justify-content-between align-items-center">
                    <h4 className="mb-0">
                        <i className="bi bi-trash me-2"></i>
                        Deleted Pages
                    </h4>

                    <Link to="/admin/pages" className="btn btn-primary" >
                        <i className="bi bi-arrow-left me-2"></i>
                        Back
                    </Link>
                </div>

                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-bordered table-hover">
                            <thead className="table-dark">
                                <tr>
                                    <th>#</th>
                                    <th>Title</th>
                                    <th>Slug</th>
                                    <th>Status</th>
                                    <th>Deleted At</th>
                                    <th width="170">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="6" className="text-center" >
                                            Loading...
                                        </td>
                                    </tr>
                                ) : pages.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="text-center" >
                                            No Deleted Pages Found
                                        </td>
                                    </tr>
                                ) : (
                                    pages.map((page, index) => (
                                        <tr key={page.id}>
                                            <td>{index + 1}</td>
                                            <td>{page.title}</td>
                                            <td>{page.slug}</td>
                                            <td>
                                                <span
                                                    className={`badge ${
                                                        page.status === "Published" ? "bg-success" : "bg-secondary"
                                                    }`}
                                                >
                                                    {page.status}
                                                </span>
                                            </td>
                                            <td>
                                                {page.deleted_at ? new Date(page.deleted_at).toLocaleString() : "-"}
                                            </td>
                                            <td>
                                                <button className="btn btn-success btn-sm me-2"
                                                    onClick={() => handleRestore(page.id)} >
                                                    <i className="bi bi-arrow-counterclockwise"></i>
                                                </button>
                                                <button className="btn btn-danger btn-sm"
                                                    onClick={() => handleForceDelete(page.id)} >
                                                    <i className="bi bi-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

        </div>

    );

}
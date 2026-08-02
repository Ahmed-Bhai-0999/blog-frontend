import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Swal from "sweetalert2";
import { toast } from "react-toastify";

import { getDeletedCategories, restoreCategory, forceDeleteCategory } from "../../../services/categoryService";

export default function TrashCategories() {

    const [categories, setCategories] = useState([]);
    const [meta, setMeta] = useState({});
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    useEffect(() => {
        loadCategories();
    }, [search, page]);

    const loadCategories = async () => {
        try {
            const res = await getDeletedCategories({search, page});
            setCategories(res.data);
            setMeta(res.meta);

        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    const restore = async (id) => {
        const result = await Swal.fire({
            title: "Restore Category?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Restore",
            confirmButtonColor: "#198754",
        });

        if (!result.isConfirmed) return;

        try {
            const res = await restoreCategory(id);
            toast.success(res.data.message);
            loadCategories();
        } catch (err) {
            toast.error(err.response?.data?.message);
        }
    };

    const forceDelete = async (id) => {
        const result = await Swal.fire({
            title: "Delete Permanently?",
            text: "This action cannot be undone.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Delete Forever",
            confirmButtonColor: "#dc3545",
        });

        if (!result.isConfirmed) return;

        try {
            const res = await forceDeleteCategory(id);
            toast.success(res.data.message);
            loadCategories();
        } catch (err) {
            toast.error(err.response?.data?.message);
        }
    };

    if (loading) return <h4>Loading...</h4>;

    return (

        <div className="card shadow">

            <div className="card-header d-flex justify-content-between align-items-center">
                <h4 className="mb-0">Trash Categories</h4>

                <Link to="/admin/categories" className="btn btn-primary" >
                    Back
                </Link>
            </div>

            <div className="card-body">

                <div className="row mb-3">
                    <div className="col-md-4">
                        <input className="form-control" placeholder="Search..." value={search}
                            onChange={(e) => {setSearch(e.target.value); setPage(1); }} />
                    </div>
                </div>

                <table className="table table-bordered table-hover align-middle">
                    <thead className="table-dark">
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Status</th>
                            <th>Deleted At</th>
                            <th width="220">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.length === 0 && (
                            <tr>
                                <td colSpan="6" className="text-center">No Deleted Categories </td>
                            </tr>
                        )}

                        {categories.map((category, index) => (
                            <tr key={category.id}>
                                <td>{(meta.from || 1) + index}</td>
                                <td>{category.name}</td>
                                <td>{category.description}</td>
                                <td>
                                    <span className={`badge ${
                                            category.status === "Active" ? "bg-success" : "bg-danger"
                                        }`}
                                    >
                                        {category.status}
                                    </span>
                                </td>
                                <td>
                                    {category.deleted_at ? new Date(category.deleted_at).toLocaleString() : "-"}
                                </td>
                                <td>
                                    <button className="btn btn-success btn-sm me-2" onClick={() => restore(category.id)} >
                                        Restore
                                    </button>

                                    <button className="btn btn-danger btn-sm" onClick={() => forceDelete(category.id)} >
                                        Delete Forever
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Pagination */}
                <div className="d-flex justify-content-end">
                    <nav>
                        <ul className="pagination">
                            <li className={`page-item ${meta.current_page === 1 ? "disabled" : "" }`} >
                                <button className="page-link" onClick={() => setPage(meta.current_page - 1) } >
                                    Previous
                                </button>
                            </li>

                            {Array.from(
                                {
                                    length: meta.last_page || 1,
                                },
                                (_, i) => (
                                    <li key={i} className={`page-item ${
                                            meta.current_page === i + 1 ? "active" : ""
                                        }`}
                                    >
                                        <button className="page-link" onClick={() => setPage(i + 1)} >
                                            {i + 1}
                                        </button>
                                    </li>
                                )
                            )}

                            <li className={`page-item ${ meta.current_page === meta.last_page ? "disabled" : "" }`} >
                                <button className="page-link" onClick={() => setPage(meta.current_page + 1)} >
                                    Next
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </div>

    );

}
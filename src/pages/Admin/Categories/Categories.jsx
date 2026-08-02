import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Swal from "sweetalert2";
import { toast } from "react-toastify";

import { getCategories, deleteCategory, changeCategoryStatus } from "../../../services/categoryService";
import Loader from "../../../components/common/Loader";
import Pagination from "../../../components/common/Pagination";

export default function Categories({onPageChange}) {

    const [categories, setCategories] = useState([]);
    const [meta, setMeta] = useState({});
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    const [statusFilter, setStatusFilter] = useState("");

    useEffect(() => {
        loadCategories();
    }, [search, page, statusFilter]);

    const loadCategories = async () => {
        try {
            const res = await getCategories({search, page, status: statusFilter});

            setCategories(res.data);
            setMeta(res.meta);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    const removeCategory = async (id) => {
        const result = await Swal.fire({
            title: "Delete Category?",
            text: "You can restore it later from Trash.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#dc3545",
            confirmButtonText: "Delete",
        });

        if (!result.isConfirmed) return;
        
        try {
            const res = await deleteCategory(id);
            toast.success(res.data.message);
            loadCategories();
        } catch (err) {
            toast.error(err.response?.data?.message);
        }
    };

    const openStatusModal = async (category) => {
        const { value: status } = await Swal.fire({
            title: "Change Status",
            input: "select",
            inputOptions: {
                Active: "Active",
                Inactive: "Inactive",
            },
            inputValue: category.status,
            showCancelButton: true,
            confirmButtonText: "Update",
        });

        if (!status) return;

        try {
            const res = await changeCategoryStatus(category.id, status);
            toast.success(res.data.message);
            loadCategories();
        } catch (err) {
            toast.error(err.response?.data?.message);
        }
    };

    if (loading) return <Loader />

    return (

        <div className="card shadow">

            <div className="card-header">
                <div className="d-flex justify-content-between align-items-center">
                    <h4 className="mb-0">Categories</h4>
                    <div>
                        <Link to="/admin/categories/create" className="btn btn-primary" >
                            Add Category
                        </Link>

                        <Link to="/admin/categories/trash" className="btn btn-danger ms-2" >
                            Trash
                        </Link>
                    </div>
                </div>
            </div>

            <div className="card-body">
                <div className="row mb-3">
                    <div className="col-md-4">
                        <input className="form-control" placeholder="Search..." value={search}
                            onChange={(e) => {setSearch(e.target.value); setPage(1); }} />
                    </div>
                    <div className="col-md-6"></div>
                    <div className="col-md-2">
                        <select className="form-select" value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)} >

                            <option value="">All Status</option>
                            <option value="Active">Active Status</option>
                            <option value="Inactive">Inactive Status</option>
                        </select>
                    </div>
                </div>


                <table className="table table-bordered table-hover align-middle">
                    <thead className="table-dark">
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Status</th>
                            <th>Created By</th>
                            <th width="180">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.length === 0 && (
                            <tr>
                                <td colSpan="6" className="text-center" >No Record Found</td>
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
                                <td>{category.creator?.name}</td>
                                <td width="260">
                                    <button className="btn btn-success btn-sm me-2" onClick={() => openStatusModal(category)} >
                                        Status
                                    </button>

                                    <Link to={`/admin/categories/edit/${category.id}`} className="btn btn-warning btn-sm me-2" >
                                        Edit
                                    </Link>

                                    <button className="btn btn-danger btn-sm" onClick={() => removeCategory(category.id)} >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Pagination */}
                <Pagination pagination={meta} onPageChange={onPageChange} />
                {/* <div className="d-flex justify-content-end">
                    <nav>
                        <ul className="pagination">
                            <li className={`page-item ${
                                meta.current_page === 1 ? "disabled" : ""
                                }`}
                            >
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

                            <li className={`page-item ${ 
                                    meta.current_page ===
                                    meta.last_page ? "disabled" : ""
                                }`}
                            >
                                <button className="page-link" onClick={() => setPage(meta.current_page + 1) }>
                                    Next
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div> */}
            </div>
        </div>

    );
}
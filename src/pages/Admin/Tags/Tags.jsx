import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Swal from "sweetalert2";
import { toast } from "react-toastify";

import { getTags, deleteTag, changeTagStatus } from "../../../services/tagService";

export default function Tags() {

    const [tags, setTags] = useState([]);
    const [meta, setMeta] = useState({});
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState("");

    useEffect(() => {
        loadTags();
    }, [search, page, statusFilter]);

    const loadTags = async () => {
        try {
            const res = await getTags({
                search,
                page,
                status: statusFilter,
            });
            console.log(res.data)
            setTags(res.data);
            setMeta(res.meta);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    const removeTag = async (id) => {
        const result = await Swal.fire({
            title: "Delete Tag?",
            text: "You can restore it later.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#dc3545",
            confirmButtonText: "Delete",
        });

        if (!result.isConfirmed) return;

        try {
            const res = await deleteTag(id);
            toast.success(res.data.message);
            loadTags();
        } catch (err) {
            toast.error(err.response?.data?.message);
        }
    };

    const openStatusModal = async (tag) => {
        const { value: status } = await Swal.fire({
            title: "Change Status",
            input: "select",
            inputOptions: {
                Active: "Active",
                Inactive: "Inactive",
            },
            inputValue: tag.status,
            showCancelButton: true,
            confirmButtonText: "Update",
        });

        if (!status) return;

        try {
            const res = await changeTagStatus(tag.id, status);
            toast.success(res.data.message);
            loadTags();
        } catch (err) {
            toast.error(err.response?.data?.message);
        }
    };

    if (loading) return <h4>Loading...</h4>;

    return (

        <div className="card shadow">
            <div className="card-header">
                <div className="d-flex justify-content-between align-items-center">
                    <h4 className="mb-0">Tags</h4>
                    <div>
                        <Link to="/admin/tags/create" className="btn btn-primary" >
                            Add Tag
                        </Link>

                        <Link to="/admin/tags/trash" className="btn btn-danger ms-2" >
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
                            onChange={(e) => {setStatusFilter(e.target.value); setPage(1); }} >

                            <option value="">All Status</option>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                    </div>
                </div>

                <table className="table table-bordered table-hover">
                    <thead className="table-dark">
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Status</th>
                            <th>Created By</th>
                            <th width="250">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tags.length === 0 && (
                            <tr>
                                <td colSpan="6" className="text-center">No Record Found</td>
                            </tr>
                        )}

                        {tags.map((tag, index) => (
                            
                            <tr key={tag.id}>
                                <td>{(meta.from || 1) + index}</td>
                                <td>{tag.name}</td>
                                <td>
                                    <span className={`badge ${
                                            tag.status === "Active" ? "bg-success" : "bg-danger"
                                        }`}
                                    >
                                        {tag.status}
                                    </span>
                                </td>
                                <td>{tag.creator?.name}</td>
                                <td>
                                    <button className="btn btn-success btn-sm me-2" onClick={() => openStatusModal(tag)} >
                                        Status
                                    </button>

                                    <Link to={`/admin/tags/edit/${tag.id}`} className="btn btn-warning btn-sm me-2" >
                                        Edit
                                    </Link>

                                    <button className="btn btn-danger btn-sm" onClick={() => removeTag(tag.id)} >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

    );

}
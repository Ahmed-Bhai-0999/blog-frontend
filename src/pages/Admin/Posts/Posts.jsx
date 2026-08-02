import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import api from "../../../services/api";

import Swal from "sweetalert2";
import { toast } from "react-toastify";
import Loader from "../../../components/common/Loader";

import {getPosts, deletePost, changeStatus } from "../../../services/postService";

export default function Posts() {

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [statuses, setStatuses] = useState([]);

    const [page, setPage] = useState(1);

    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        from: 0,
        to: 0,
        total: 0,
    });

    const loadPosts = async () => {
        try {
            const res = await getPosts({
                search,
                page,
            });

            setPosts(res.data);
            setPagination(res.meta);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    const loadStatuses = async () => {
        try {
            const res = await api.get("/post-statuses");
            setStatuses(res.data);
        } catch (err) {
            console.log(err);
        }
    };
    
    useEffect(() => {
    console.log("STATE POSTS =", posts);
}, [posts]);

    useEffect(() => {
        loadPosts();
        loadStatuses();
    }, []);

    useEffect(() => {
        loadPosts();
    }, [search, page]);

    const removePost = async (id) => {
        const result = await Swal.fire({
            title: "Delete Post?",
            text: "You can restore it later from Trash.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#dc3545",
            confirmButtonText: "Delete",
        });

        if (!result.isConfirmed) return;

        try {
            const res = await deletePost(id);
            toast.success(res.data.message);
            loadPosts();
        } catch (err) {
            toast.error(err.response?.data?.message);
        }
    };

    const openStatusModal = async (post) => {
        const { value: status } = await Swal.fire({
            title: "Change Status",
            input: "select",
            inputOptions: {
                Draft: "Draft",
                Published: "Published",
                Scheduled: "Scheduled",
                Archived: "Archived",
            },
            inputValue: post.status,
            showCancelButton: true,
            confirmButtonText: "Update",
        });

        if (!status) return;
        try {
            const res = await changeStatus(post.id, status);
            toast.success(res.data.message);
            loadPosts();
        } catch (err) {
            toast.error(err.response?.data?.message);
        }
    };

    const statusChanged = async (id, status) => {
        try {
            const res = await changeStatus(id, status);
            toast.success(res.data.message);
            loadPosts();
        } catch (err) {
            toast.error(err.response?.data?.message);
        }
    };

    if (loading) return <Loader />;

    return (

        <div className="card shadow">
            <div className="card-header d-flex justify-content-between align-items-center">
                <h4 className="mb-0">Posts</h4>
                <div>
                    <Link to="/admin/posts/create" className="btn btn-primary" > Add New </Link>
                    <Link to="/admin/posts/trash" className="btn btn-danger ms-2" > Trash </Link>
                </div>
            </div>

            <div className="card-body">
                <div className="row mb-3">
                    <div className="col-md-4">
                        <input className="form-control" placeholder="Search..." value={search}
                            onChange={(e) => setSearch(e.target.value)} />
                    </div>
                </div>

                <table className="table table-bordered table-hover align-middle">
                    <thead className="table-dark">
                        <tr>
                            <th width="60">#</th>
                            <th width="90">Image</th>
                            <th>Title</th>
                            <th>Category</th>
                            <th>Author</th>
                            <th>Status</th>
                            <th>Views</th>
                            <th width="230">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(posts?.length ?? 0) === 0 ? (
                            <tr>
                                <td colSpan="8" className="text-center" >
                                    No Record Found
                                </td>
                            </tr>
                        ) : (
                            (posts || []).map((post,index)=>(
                            <tr key={post.id}>
                                <td>{(pagination?.from ?? 1) + index}</td>
                                <td>
                                    <img src={post.featured_image} width="70" className="img-thumbnail" alt="" />
                                </td>
                                <td>{post.title}</td>
                                <td>{post.category?.name}</td>
                                <td>{post.author?.name}</td>
                                <td>
                                    <span className={`badge ${
                                            post.status === "Published"
                                                ? "bg-success" : post.status === "Draft"
                                                ? "bg-warning text-dark" : post.status === "Archived"
                                                ? "bg-danger" : "bg-info"
                                        }`}
                                    >
                                        {post.status}
                                    </span>
                                </td>
                                <td>{post.views}</td>
                                <td>
                                    <button className="btn btn-success btn-sm me-2" onClick={() => openStatusModal(post)} >
                                        Status
                                    </button>
                                    
                                    <Link to={`/admin/posts/edit/${post.id}`} className="btn btn-warning btn-sm me-2" >
                                        Edit
                                    </Link>

                                    <button className="btn btn-danger btn-sm" onClick={() => removePost(post.id)} >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>

                <div className="d-flex justify-content-between align-items-center mt-3">

                    <div>
                        Showing {pagination?.from ?? 0} to {pagination?.to ?? 0} of {pagination?.total ?? 0}
                    </div>

                    <div>

                        <button className="btn btn-outline-primary me-2" disabled={page === 1}
                            onClick={() => setPage(page - 1)} >
                            Previous
                        </button>

                        <span className="fw-bold">
                            Page {pagination?.current_page ?? 1} of {pagination?.last_page ?? 1}
                        </span>

                        <button className="btn btn-outline-primary ms-2"
                            disabled={page >= (pagination?.last_page ?? 1)}
                            onClick={() => setPage(page + 1)} >
                            Next
                        </button>

                    </div>

                </div>
            </div>
        </div>

    );

}
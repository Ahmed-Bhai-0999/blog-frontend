import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Swal from "sweetalert2";
import { toast } from "react-toastify";

import {getDeletedPosts, restorePost, forceDeletePost } from "../../../services/postService";

export default function TrashPosts() {

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        loadPosts();
    }, []);

    useEffect(() => {
        loadPosts();
    }, [search]);

    const loadPosts = async () => {
        try {
            const res = await getDeletedPosts({
                search,
            });
            setPosts(res.data || []);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    const restore = async (id) => {
        const result = await Swal.fire({
            title: "Restore Post?",
            text: "This post will be restored.",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Restore",
            confirmButtonColor: "#198754",
        });

        if (!result.isConfirmed) return;
        try {
            const res = await restorePost(id);
            toast.success(res.data.message);
            loadPosts();
        } catch (err) {
            toast.error(err.response?.data?.message || "Restore failed.");
        }
    };

    const forceDelete = async (id) => {
        const result = await Swal.fire({
            title: "Delete Permanently?",
            text: "This action cannot be undone.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#dc3545",
            confirmButtonText: "Delete Forever",
        });
        if (!result.isConfirmed) return;
        try {
            const res = await forceDeletePost(id);
            toast.success(res.data.message);
            loadPosts();
        } catch (err) {
            toast.error(err.response?.data?.message || "Force delete failed.");
        }
    };

    if (loading) {
        return <h4>Loading...</h4>;
    }

    return (

        <div className="card shadow">

            <div className="card-header d-flex justify-content-between align-items-center">
                <h4 className="mb-0">Trash Posts</h4>
                <Link to="/admin/posts" className="btn btn-primary">Back</Link>
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
                            <th>Deleted</th>
                            <th width="220">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {posts.length === 0 && (
                            <tr>
                                <td colSpan="8" className="text-center">
                                    No Deleted Posts
                                </td>
                            </tr>
                        )}

                        {posts.map((post, index) => (
                            <tr key={post.id}>
                                <td>{index + 1}</td>
                                <td>
                                    {post.featured_image ? (
                                        <img src={post.featured_image} width="70"
                                            className="img-thumbnail" alt="" />
                                    ) : (
                                        <span className="text-muted"> No Image </span>
                                    )}
                                </td>
                                <td>{post.title}</td>
                                <td>{post.category?.name}</td>
                                <td>{post.author?.name}</td>
                                <td>
                                    <span className={`badge ${
                                        post.status ===
                                            "Published"
                                                ? "bg-success"
                                                : post.status ===
                                                  "Draft"
                                                ? "bg-warning text-dark"
                                                : post.status ===
                                                  "Archived"
                                                ? "bg-danger"
                                                : "bg-info"
                                        }`}
                                    >
                                        {post.status}
                                    </span>
                                </td>
                                <td>
                                    <span className="badge bg-danger">
                                        {post.deleted_at ? new Date(post.deleted_at).toLocaleString()
                                            : "-"}
                                    </span>
                                </td>
                                <td>
                                    <button className="btn btn-success btn-sm me-2"
                                        onClick={() => restore(post.id)} >
                                        Restore
                                    </button>

                                    <button className="btn btn-danger btn-sm"
                                        onClick={() => forceDelete(post.id)} >
                                        Delete Forever
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
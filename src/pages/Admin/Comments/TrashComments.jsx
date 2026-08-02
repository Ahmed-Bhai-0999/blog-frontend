import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Swal from "sweetalert2";
import { toast } from "react-toastify";

import { getDeletedComments, restoreComment, forceDeleteComment } from "../../../services/commentService";

export default function TrashComments() {

    const [comments, setComments] = useState([]);
    const [meta, setMeta] = useState({});
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    useEffect(() => {
        loadComments();
    }, [search, page]);

    const loadComments = async () => {
        try {
            const res = await getDeletedComments({search, page});
            setComments(res.data);
            setMeta(res.meta);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    const restore = async (id) => {
        const result = await Swal.fire({
            title: "Restore Comment?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Restore",
            confirmButtonColor: "#198754",
        });

        if (!result.isConfirmed) return;

        try {
            const res = await restoreComment(id);
            toast.success(res.data.message);
            loadComments();
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
            const res = await forceDeleteComment(id);
            toast.success(res.data.message);
            loadComments();
        } catch (err) {
            toast.error(err.response?.data?.message);
        }
    };

    if (loading) return <h4>Loading...</h4>;

    return (
        <div className="card shadow">

            <div className="card-header d-flex justify-content-between">
                <h4>Trash Comments</h4>

                <Link to="/admin/comments" className="btn btn-secondary" >
                    Back
                </Link>
            </div>

            <div className="card-body">
                <div className="mb-3">
                    <input className="form-control" placeholder="Search..." value={search}
                        onChange={(e)=>{setSearch(e.target.value); setPage(1); }}
                    />
                </div>

                <table className="table table-bordered">
                    <thead className="table-dark">
                        <tr>
                            <th>#</th>
                            <th>Comment</th>
                            <th>Post</th>
                            <th>Deleted At</th>
                            <th width="210">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {comments.length===0 && (
                            <tr>
                                <td colSpan="5" className="text-center" >
                                    No Deleted Comments
                                </td>
                            </tr>
                        )}

                        {comments.map((comment,index)=>(
                            <tr key={comment.id}>
                                <td>{(meta.from||1)+index}</td>
                                <td>{comment.comment}</td>
                                <td>{comment.post?.title}</td>
                                <td>{comment.deleted_at}</td>
                                <td>
                                    <button className="btn btn-success btn-sm me-2" onClick={()=>restore(comment.id)} >
                                        Restore
                                    </button>

                                    <button className="btn btn-danger btn-sm" onClick={()=>forceDelete(comment.id)} >
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
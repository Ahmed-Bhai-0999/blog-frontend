import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Swal from "sweetalert2";
import { toast } from "react-toastify";

// import CommentItem from "./CommentItem";
import CommentTable from "./CommentTable";
import { getAdminComments, deleteComment, changeCommentStatus } from "../../../services/commentService";
import Loader from "../../../components/common/Loader";

export default function Comments() {

    const [comments, setComments] = useState([]);
    const [meta, setMeta] = useState({});

    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    const [page, setPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState("");

    useEffect(() => {
        loadComments();
    }, [search, page, statusFilter]);

    const loadComments = async () => {
        try {
            const res = await getAdminComments({search, page, status: statusFilter});
            setComments(res.data);
            setMeta(res.meta);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    const removeComment = async (id) => {
        const result = await Swal.fire({
            title: "Delete Comment?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Delete",
            confirmButtonColor: "#dc3545",
        });

        if (!result.isConfirmed) return;

        try {
            const res = await deleteComment(id);
            toast.success(res.data.message);
            loadComments();
        } catch (err) {
            toast.error(err.response?.data?.message);
        }
    };

    const openStatusModal = async (comment) => {
        const { value: status } = await Swal.fire({
            title: "Change Status",
            input: "select",
            inputOptions: {
                Pending: "Pending",
                Approved: "Approved",
                Rejected: "Rejected",
            },
            inputValue: comment.status,
            showCancelButton: true,
            confirmButtonText: "Update",
        });

        if (!status) return;

        try {
            const res = await changeCommentStatus(comment.id, status);
            toast.success(res.data.message);
            loadComments();
        } catch (err) {
            toast.error(err.response?.data?.message);
        }
    };

    if (loading) {
        return <Loader />;
    }

    return (

        <div className="card shadow">

            <div className="card-header">
                <div className="d-flex justify-content-between align-items-center">
                    <h4 className="mb-0">Comments</h4>
                    <div>
                        <Link to="/admin/comments/trash" className="btn btn-danger btn-sm ms-2" >
                            Trash
                        </Link>
                    </div>
                </div>
            </div>

            <div className="card-body">
                <div className="row mb-3">
                    <div className="col-md-4">
                        <input className="form-control" placeholder="Search Comment..." value={search}
                            onChange={(e)=>{setSearch(e.target.value); setPage(1); }} />
                    </div>

                    <div className="col-md-6"></div>
                    <div className="col-md-2">
                        <select className="form-select" value={statusFilter} 
                            onChange={(e)=>{setStatusFilter(e.target.value); setPage(1); }} >

                            <option value="">All</option>
                            <option value="Pending">Pending</option>
                            <option value="Approved">Approved</option>
                            <option value="Rejected">Rejected</option>
                        </select>
                    </div>
                </div>
                
                <div className="row">

                    <CommentTable comments={comments} meta={meta} reload={loadComments}
                        onStatus={openStatusModal} onPageChange={setPage} />
                    
                        {/*  */}
                     {/* {comments.map((comment) => (
                        <CommentItem key={comment.id} comment={comment} reload={loadComments} />
                    ))} */}
                </div>
            </div>
        </div>

    );

}
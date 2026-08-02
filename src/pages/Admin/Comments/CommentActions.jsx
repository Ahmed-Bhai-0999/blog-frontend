import { useState } from "react";

import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

import CommentHistoryModal from "./CommentHistoryModal";
import { deleteComment, changeCommentStatus } from "../../../services/commentService";

export default function CommentActions({comment,reload,}) {

    const [showHistory, setShowHistory] = useState(false);

    const updateStatus = async (status) => {
        try {
            const res = await changeCommentStatus(comment.id, status);
            toast.success(res.data.message);
            reload();
        }catch (err) {
            toast.error(err.response?.data?.message ?? "Status update failed.");
        }
    };

    const removeComment = async () => {
        const result = await Swal.fire({
            title: "Delete Comment?",
            text: "You won't be able to recover it.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Delete",
            confirmButtonColor: "#dc3545",
        });

        if (!result.isConfirmed) return;

        try {
            const res = await deleteComment(comment.id);
            toast.success(res.data.message);
            reload();
        }catch (err) {
            toast.error(err.response?.data?.message);
        }
    };

    return (

        <div className="dropdown">
            <button className="btn btn-outline-secondary btn-sm dropdown-toggle" data-bs-toggle="dropdown" >
                Actions
            </button>

            <ul className="dropdown-menu dropdown-menu-end">
                {comment.status !== "Approved" && (
                    <li>
                        <button className="dropdown-item text-success"
                            onClick={() => updateStatus("Approved") }
                        >
                            ✔ Approve
                        </button>
                    </li>
                )}
                {comment.status !== "Rejected" && (
                    <li>
                        <button className="dropdown-item text-danger" onClick={() => updateStatus("Rejected")} >
                            ✖ Reject
                        </button>
                    </li>
                )}

                {comment.status !== "Pending" && (
                    <li>
                        <button className="dropdown-item text-warning" onClick={() => updateStatus("Pending")} >
                            ⏳ Pending
                        </button>
                    </li>
                )}

                <li><hr className="dropdown-divider"/></li>
                <li>
                    <Link className="dropdown-item" to={`/admin/comments/edit/${comment.id}`} >
                        ✏ Edit
                    </Link>
                </li>
                <li>
                    <button className="dropdown-item" disabled >
                        💬 Reply
                        <small className="text-muted ms-2">Coming Soon</small>
                    </button>
                </li>
                <li>
                    <button className="dropdown-item" onClick={()=>setShowHistory(true)} >
                        🕘 History
                    </button>
                    <CommentHistoryModal commentId={comment.id} show={showHistory}
                        onClose={()=>setShowHistory(false)} />
                </li>
                <li>
                    <hr className="dropdown-divider"/>
                </li>
                <li>
                    <button className="dropdown-item text-danger" onClick={removeComment} >
                        🗑 Delete
                    </button>
                </li>
            </ul>
        </div>
    );

}
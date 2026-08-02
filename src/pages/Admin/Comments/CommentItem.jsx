import { useState } from "react";
import CommentActions from "./CommentActions";
import CommentReply from "./CommentReply";
import ReplyForm from "./ReplyForm";
import LikeDislike from "./LikeDislike";

export default function CommentItem({comment, reload, level = 0,}) {

    const [showReply, setShowReply] = useState(false);

    const badgeColor = () => {
        switch (comment.status) {
            case "Approved":
                return "success";

            case "Rejected":
                return "danger";

            default:
                return "warning";
        }
    };

    return (

        <div className="card shadow-sm mb-3" style={{marginLeft: `${level * 35}px`}} >
            <div className="card-body">

                {/* Header */}
                <div className="d-flex justify-content-between">
                    <div className="d-flex">
                        <div
                            className="rounded-circle bg-primary text-white fw-bold d-flex align-items-center justify-content-center"
                            style={{width: 45, height: 45}}
                        >

                            {comment.author?.name
                                ? comment.author.name.charAt(0).toUpperCase()
                                : comment.guest_name?.charAt(0).toUpperCase()}
                        </div>

                        <div className="ms-3">
                            <h6 className="mb-0">{comment.author?.name ??comment.guest_name}</h6>
                            <small className="text-muted">{comment.created_at}</small>
                            <div className="mt-1">
                                {comment.badges?.map((badge) => (
                                    <span key={badge} className="badge bg-dark me-1" >
                                        {badge}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div>
                        <span className={`badge bg-${badgeColor()}`} >
                            {comment.status}
                        </span>
                    </div>
                </div>

                <hr />

                {/* Comment */}
                <p className="mb-3" style={{whiteSpace: "pre-wrap"}} >
                    {comment.comment}
                </p>

                {/* Footer */}
                <div className="d-flex align-items-center justify-content-between">
                    <div>
                        <LikeDislike comment={comment} />
                    </div>

                    <div>
                        <button className="btn btn-sm btn-outline-primary me-2"
                            onClick={() =>setShowReply(!showReply)} >
                            Reply
                        </button>

                        <CommentActions comment={comment} reload={reload} />
                    </div>
                </div>

                {/* Reply Form */}
                {showReply && (
                    <div className="mt-3">
                        <ReplyForm parent={comment} reload={reload} close={() => setShowReply(false)} />
                    </div>
                )}

                {/* Replies */}
                {comment.replies?.length > 0 && (
                    <div className="mt-4">
                        {comment.replies.map((reply) => (
                            <CommentReply key={reply.id} comment={reply} reload={reload} level={level + 1} />
                        ))}
                    </div>
                )}
            </div>
        </div>

    );

}
import { Link } from "react-router-dom";
import CommentActions from "./CommentActions";

export default function CommentRow({comment,index,meta,reload,onStatus,}) {

    const badgeColor = (status) => {
        switch (status) {
            case "Approved":
                return "success";

            case "Rejected":
                return "danger";

            default:
                return "warning";
        }
    };

    const getAuthorName = () => {
        return comment.author?.name ?? comment.guest_name ?? "Unknown";
    };

    const getAvatar = () => {
        return getAuthorName()
            .charAt(0)
            .toUpperCase();
    };

    return (

        <tr>
            {/* Serial */}
            <td>{(meta.from || 1) + index}</td>

            {/* Author */}
            <td width="220">
                <div className="d-flex align-items-center">
                    <div className="rounded-circle bg-primary text-white fw-bold d-flex align-items-center justify-content-center"
                        style={{width: 40, height: 40, minWidth: 40}} 
                    >
                        {getAvatar()}
                    </div>

                    <div className="ms-3">
                        <div className="fw-bold">{getAuthorName()}</div>
                        {comment.author ?
                            <small className="text-success">Registered User</small>
                            :<small className="text-secondary"> Guest</small>
                        }
                        <br/>
                                    {/* use for Adimn , Auth, Guest */}
                        {/* {comment.badges?.map((badge)=>(
                            <span key={badge} className="badge bg-dark me-1 mt-1" >
                                {badge}
                            </span>
                        )) } */}
                    </div>
                </div>
            </td>

            {/* Post */}
            <td>
                {comment.post ?
                        <Link to={`/post/${comment.post.slug}`} target="_blank" >
                            {comment.post.title}
                        </Link>
                        : "-"
                }
            </td>

            {/* Comment */}
            <td>
                {comment.comment.length > 120 
                    ? comment.comment.substring(0,120)+"..."
                    : comment.comment
                }
            </td>

            {/* Replies */}
            <td className="text-center">
                <span className="badge bg-info">{comment.replies_count}</span>
            </td>

            {/* Date */}
            <td>{comment.created_at}</td>

            {/* Status */}
            <td>
                <span className={`badge bg-${badgeColor(comment.status)}`} >
                    {comment.status}
                </span>
            </td>

            {/* Actions */}
            <td>
                <CommentActions comment={comment} reload={reload} onStatus={onStatus} />
            </td>
        </tr>

    );

}
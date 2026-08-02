import { useState } from "react";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import { reactComment } from "../../../services/commentService";
import { toast } from "react-toastify";

export default function LikeDislike({ comment }) {

    const [likes, setLikes] = useState(comment.likes_count);
    const [dislikes, setDislikes] = useState(comment.dislikes_count);

    const [reaction, setReaction] = useState(comment.user_reaction);
    const [loading, setLoading] = useState(false);

    const handleReaction = async (value) => {

        if (loading) return;
            
        setLoading(true);

        try {
            const res = await reactComment(comment.id, value);
            setLikes(res.data.likes_count);
            setDislikes(res.data.dislikes_count);
            setReaction(res.data.user_reaction);
            if (res.data.guest_token) {
                localStorage.setItem("guest_token", res.data.guest_token);
            }
        } catch (err) {
            toast.error(err.response?.data?.message ?? "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    return (

        <div className="d-flex align-items-center gap-3">
            <button className={`btn btn-sm ${
                    reaction === 1 ? "btn-primary" : "btn-outline-primary" 
                }`}
                disabled={loading} onClick={() => handleReaction(1)}
            >
                <FaThumbsUp className="me-1" />
                {likes}
            </button>

            <button className={`btn btn-sm ${
                    reaction === 0 ? "btn-danger" : "btn-outline-danger"
                }`}
                disabled={loading} onClick={() => handleReaction(0)}
            >
                <FaThumbsDown className="me-1" />
                {dislikes}
            </button>
        </div>
    
    );
}
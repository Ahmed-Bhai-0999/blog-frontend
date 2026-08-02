import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

import { markNotificationRead, deleteNotification } from "../../../../services/commentService";

export default function NotificationActions({notification, reload}) {

    const navigate = useNavigate();

    const markRead = async () => {
        if (notification.is_read) return;

        try {
            const res = await markNotificationRead(notification.id);
            toast.success(res.data.message);
            reload();
        } catch (err) {
            toast.error(
                err.response?.data?.message ??
                "Unable to mark notification."
            );
        }
    };

    const removeNotification = async () => {
        const result = await Swal.fire({
            title: "Delete Notification?",
            text: "This action cannot be undone.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Delete",
            confirmButtonColor: "#dc3545",
        });

        if (!result.isConfirmed) return;

        try {
            const res = await deleteNotification(notification.id);
            toast.success(res.data.message);
            reload();
        } catch (err) {
            toast.error(
                err.response?.data?.message ??
                "Unable to delete notification."
            );
        }
    };

    const openComment = async () => {
        if (!notification.is_read) {
            await markRead();
        }
        navigate(`/admin/comments/edit/${notification.comment?.id}`);
    };

    return (

        <div className="dropdown">

            <button className="btn btn-outline-secondary btn-sm dropdown-toggle"
                data-bs-toggle="dropdown" >
                Actions
            </button>

            <ul className="dropdown-menu dropdown-menu-end">
                <li>
                    <button className="dropdown-item" onClick={openComment} >
                        👁 View Comment
                    </button>
                </li>

                {!notification.is_read && (
                    <li>
                        <button className="dropdown-item text-success" onClick={markRead} >
                            ✔ Mark Read
                        </button>
                    </li>
                )}

                <li>
                    <hr className="dropdown-divider"/>
                </li>
                <li>
                    <button className="dropdown-item text-danger" onClick={removeNotification} >
                        🗑 Delete
                    </button>
                </li>
            </ul>
        </div>

    );

}
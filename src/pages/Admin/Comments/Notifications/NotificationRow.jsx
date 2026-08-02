import NotificationActions from "./NotificationActions";

export default function NotificationRow({notification,index,meta,reload}) {

    const typeBadge = (type) => {
        switch (type) {
            case "reply":
                return "primary";

            case "mention":
                return "warning";

            case "new_comment":
                return "success";

            default:
                return "secondary";
        }

    };

    return (

        <tr className={!notification.is_read ? "table-light fw-bold" : ""}>
            <td>
                {(meta.from || 1) + index}
            </td>
            <td>
                <div>
                    {notification.message}
                </div>
                <small className="text-muted">{notification.comment?.comment}</small>
            </td>
            <td>
                <span className={`badge bg-${typeBadge(notification.type)}`}>
                    {notification.type.replace("_", " ")}
                </span>
            </td>
            <td>
                {notification.is_read ? (
                    <span className="badge bg-success"> Read </span>
                ) : (
                    <span className="badge bg-danger"> Unread </span>
                )}
            </td>
            <td>
                <div>{notification.created_at}</div>
                <small className="text-muted">{notification.created_at_full}</small>
            </td>
            <td>
                <NotificationActions notification={notification} reload={reload} />
            </td>
        </tr>
    );

}
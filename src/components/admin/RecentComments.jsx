export default function RecentComments({ comments }) {

    return (

        <div className="card shadow-sm">

            <div className="card-header">
                <strong>Recent Comments </strong>
            </div>

            <table className="table">
                <tbody>
                    {comments.map(comment => (
                        <tr key={comment.id}>
                            <td>
                                <strong>
                                    {comment.author?.name || comment.guest_name || "Guest"}
                                </strong>
                                <br />
                                {comment.comment}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

        </div>

    );

}
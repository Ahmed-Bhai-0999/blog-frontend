import CommentRow from "./CommentRow";
import Pagination from "../../../components/common/Pagination";

export default function CommentTable({comments, meta, reload, onStatus, onPageChange}) {

    return (
        <div className="container">
            <table className="table table-bordered table-hover align-middle">
                <thead className="table-dark">
                    <tr>
                        <th>#</th>
                        <th>Author</th>
                        <th>Post</th>
                        <th>Comment</th>
                        <th>Status</th>
                        <th>Replies</th>
                        <th>Date</th>
                        <th width="120">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {comments.length == 0 ? (
                            <tr>
                                <td colSpan="8" className="text-center" >
                                    No Comments Found
                                </td>
                            </tr>
                        ):
                        comments.map((comment,index)=>(
                            <CommentRow 
                                key={comment.id} 
                                comment={comment} 
                                index={index}
                                meta={meta}
                                reload={reload}
                                onStatus={onStatus}
                            />
                        ))
                    }
                </tbody>
            </table>
            <Pagination pagination={meta} onPageChange={onPageChange} />
        </div>

    );

}
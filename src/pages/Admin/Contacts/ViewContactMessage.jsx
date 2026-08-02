import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { editContactMessage, replyContactMessage, markAsRead, markAsUnread,
            } from "../../../services/contactService";

import Loader from "../../../components/common/Loader";

export default function ViewContactMessage() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [replyLoading, setReplyLoading] = useState(false);

    const [message, setMessage] = useState({});
    const [reply, setReply] = useState("");

    useEffect(() => {
        loadMessage();
    }, []);

    const loadMessage = async () => {
        setLoading(true);
        try {
            const res = await editContactMessage(id);
            setMessage(res.data.data);
            setReply(res.data.data.reply || "");
        } catch (err) {
            console.log(err);
        }
        setLoading(false);
    };

    const submitReply = async () => {
        if (reply.trim() === "") {
            toast.error("Reply is required.");
            return;
        }
        setReplyLoading(true);

        try {
            const res = await replyContactMessage(id, {reply});
            toast.success(res.data.message);
            loadMessage();
        } catch (err) {
            toast.error(err.response?.data?.message);
        }
        setReplyLoading(false);
    };

    const readMessage = async () => {
        try {
            const res = await markAsRead(id);
            toast.success(res.data.message);
            loadMessage();
        } catch (err) {
            toast.error(err.response?.data?.message);
        }
    };

    const unreadMessage = async () => {
        try {
            const res = await markAsUnread(id);
            toast.success(res.data.message);
            loadMessage();
        } catch (err) {
            toast.error(err.response?.data?.message);
        }
    };

    if (loading) {
        return <Loader />
    }

    return (

        <div className="container-fluid">
            <div className="card shadow">
                <div className="card-header d-flex justify-content-between">
                    <h4> Contact Message</h4>
                    <button className="btn btn-secondary" onClick={() => navigate(-1)} >
                        Back
                    </button>
                </div>

                <div className="card-body">
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="fw-bold">Name</label>
                            <div className="form-control">
                                {message.name}
                            </div>
                        </div>

                        <div className="col-md-6 mb-3">
                            <label className="fw-bold">Email</label>
                            <div className="form-control">
                                {message.email}
                            </div>
                        </div>

                        <div className="col-md-6 mb-3">
                            <label className="fw-bold">Phone</label>
                            <div className="form-control">
                                {message.phone || "-"}
                            </div>
                        </div>

                        <div className="col-md-6 mb-3">
                            <label className="fw-bold">Subject</label>
                            <div className="form-control">
                                {message.subject}
                            </div>
                        </div>

                        <div className="col-12 mb-3">
                            <label className="fw-bold">Message</label>
                            <textarea rows="8" className="form-control" value={message.message || ""}
                                readOnly />
                        </div>

                        <div className="col-12 mb-4">
                            <label className="fw-bold">Reply</label>
                            <textarea rows="6" className="form-control" value={reply}
                                onChange={(e) => setReply(e.target.value)} />
                        </div>
                    </div>

                    <div className="d-flex justify-content-between">
                        <div>
                            {message.is_read 
                                ?<button className="btn btn-warning me-2" onClick={unreadMessage} >
                                    Mark Unread
                                </button>
                                :<button className="btn btn-success me-2" onClick={readMessage} >
                                    Mark Read
                                </button>
                            }
                        </div>

                        <button className="btn btn-primary" onClick={submitReply} disabled={replyLoading} >
                            {replyLoading ? "Sending..." : "Send Reply"}
                        </button>
                    </div>
                </div>

            </div>
        </div>

    );

}
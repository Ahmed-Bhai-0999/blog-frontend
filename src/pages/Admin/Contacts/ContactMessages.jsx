import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Swal from "sweetalert2";
import { toast } from "react-toastify";

import { getContactMessages, deleteContactMessage, markAsRead, markAsUnread,
            } from "../../../services/contactService";

import Pagination from "../../../components/common/Pagination";


export default function ContactMessages({onPageChange}) {

    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);

    const [search, setSearch] = useState("");
    const [isRead, setIsRead] = useState("");

    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0,
    });

    useEffect(() => {
        loadMessages();
    }, []);

    useEffect(() => {
        loadMessages(1);
    }, [search, isRead]);

    const loadMessages = async (page = 1) => {
        setLoading(true);
        try {
            const res = await getContactMessages({page, search, is_read: isRead});

            setMessages(res.data.data);
            setPagination({
                current_page: res.data.meta.current_page,
                last_page: res.data.meta.last_page,
                per_page: res.data.meta.per_page,
                total: res.data.meta.total,
            });
        } catch (err) {
            console.log(err);
        }
        setLoading(false);
    };

    const handleDelete = async (id) => {
        const confirm = await Swal.fire({
            title: "Delete Message?",
            text: "You won't be able to recover it.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Delete",
        });

        if (!confirm.isConfirmed) return;

        try {
            const res = await deleteContactMessage(id);
            toast.success(res.data.message);
            loadMessages(pagination.current_page);
        } catch (err) {
            toast.error(err.response?.data?.message);
        }
    };

    const handleRead = async (id) => {
        try {
            const res = await markAsRead(id);
            toast.success(res.data.message);
            loadMessages(pagination.current_page);
        } catch (err) {
            toast.error(err.response?.data?.message);
        }
    };

    const handleUnread = async (id) => {
        try {
            const res = await markAsUnread(id);
            toast.success(res.data.message);
            loadMessages(pagination.current_page);
        } catch (err) {
            toast.error(err.response?.data?.message);
        }
    };

    return (

        <div className="container-fluid">

            <div className="card shadow">
                <div className="card-header">
                    <h4 className="mb-0">Contact Messages</h4>
                    <span className="badge bg-primary ms-2">
                        {pagination.total}
                    </span>
                </div>

                <div className="card-body">
                    <div className="row mb-3">
                        <div className="col-md-4">
                            <input className="form-control" placeholder="Search..." value={search}
                                onChange={(e)=>setSearch(e.target.value)} />
                        </div> 
                        <div className="col-md-6"></div>
                        <div className="col-md-2">
                            <select className="form-select" value={isRead}
                                onChange={(e)=>setIsRead(e.target.value)} >

                                <option value="">All</option>
                                <option value="0">Unread</option>
                                <option value="1">Read</option>
                            </select>
                        </div>
                    </div>

                    <table className="table table-bordered table-hover align-middle">
                        <thead className="table-dark">
                            <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Subject</th>
                                <th>Status</th>
                                <th>Date</th>
                                <th width="200">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="text-center" >Loading...</td>
                                </tr>

                            ) : messages.length > 0 ? (
                                messages.map((message,index)=>(
                                    <tr key={message.id}>
                                        <td>{index+1}</td>
                                        <td>{message.name}</td>
                                        <td>{message.email}</td>
                                        <td>{message.subject}</td>
                                        <td>
                                            {message.is_read ? <span className="badge bg-success">Read</span>
                                                : <span className="badge bg-warning text-dark">Unread</span>
                                            }
                                        </td>
                                        <td>{message.created_at}</td>
                                        <td>
                                            <Link to={`/admin/contacts/view/${message.id}`}
                                                className="btn btn-info btn-sm me-2" >
                                                View
                                            </Link>

                                            {message.is_read 
                                                ? <button className="btn btn-secondary btn-sm me-2"
                                                        onClick={()=>handleUnread(message.id)} >
                                                      Unread
                                                   </button>
                                                : <button className="btn btn-success btn-sm me-2"
                                                        onClick={()=>handleRead(message.id)} >
                                                      Read
                                                   </button>
                                            }

                                            <button className="btn btn-danger btn-sm" onClick={()=>handleDelete(message.id)} >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="text-center" >
                                        No Messages Found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    {/* Pagination */}
                    <Pagination 
                        // pagination={meta} 
                        onPageChange={onPageChange} />
                </div>
            </div>
        </div>

    );

}
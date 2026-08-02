import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

import Pagination from "../../../components/common/Pagination";

import { getNotifications, deleteNotification, markRead, markAllRead,
            clearNotifications } from "../../../services/notificationService";

export default function Notifications() {

    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);

    const [search, setSearch] = useState("");
    const [type, setType] = useState("");
    const [isRead, setIsRead] = useState("");

    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0,
    });

    useEffect(() => {
        loadNotifications();
    }, []);

    useEffect(() => {
        loadNotifications(1);
    }, [search, type, isRead]);

    const loadNotifications = async (page = 1) => {
        setLoading(true);
        try {
            const res = await getNotifications({page, search, type, is_read: isRead});
            setNotifications(res.data.data ?? []);
            setPagination({
                current_page: res.data.meta?.current_page ?? 1,
                last_page: res.data.meta?.last_page ?? 1,
                per_page: res.data.meta?.per_page ?? 10,
                total: res.data.meta?.total ?? 0,
            });
        } catch (err) {
            console.error(err);
            toast.error( 
                err.response?.data?.message ?? "Failed to load notifications."
            );
        }
        setLoading(false);
    };

    const handleDelete = async (id) => {
        const confirm = await Swal.fire({
            title: "Delete Notification?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Delete",
            confirmButtonColor: "#dc3545",
        });

        if (!confirm.isConfirmed) return;

        try {
            const res = await deleteNotification(id);
            toast.success(res.data.message);
            loadNotifications(pagination.current_page);
        } catch (err) {
            toast.error(err.response?.data?.message);
        }
    };

    const handleRead = async (id) => {
        try {
            const res = await markRead(id);
            toast.success(res.data.message);
            loadNotifications(pagination.current_page);
        } catch (err) {
            toast.error(err.response?.data?.message);
        }
    };

    const handleMarkAll = async () => {
        const confirm = await Swal.fire({
            title: "Mark All Read?",
            icon: "question",
            showCancelButton: true,
        });

        if (!confirm.isConfirmed) return;

        const res = await markAllRead();
        toast.success(res.data.message);
        loadNotifications();
    };

    const handleClear = async () => {
        const confirm = await Swal.fire({
            title: "Delete All Notifications?",
            icon: "warning",
            showCancelButton: true,
        });

        if (!confirm.isConfirmed) return;

        const res = await clearNotifications();
        toast.success(res.data.message);
        loadNotifications();
    };

    return (

        <div className="container-fluid">
            <div className="card shadow">
                <div className="card-header d-flex justify-content-between align-items-center">
                    <h4>Notifications
                        <span className="badge bg-primary ms-2">
                            {pagination.total}
                        </span>
                    </h4>
                    <div>
                        <button className="btn btn-success me-2" onClick={handleMarkAll} >
                            Mark All Read
                        </button>
                        <button className="btn btn-danger" onClick={handleClear} >
                            Clear All
                        </button>
                    </div>
                </div>

                <div className="card-body">
                    <div className="row mb-3">
                        <div className="col-md-4">
                            <input className="form-control" placeholder="Search..." value={search}
                                onChange={(e)=>setSearch(e.target.value)} />
                        </div>
                        <div className="col-md-3">
                            <select className="form-select" value={type}
                                onChange={(e)=>setType(e.target.value)} >

                                <option value="">All Types</option>
                                <option value="Success">Success</option>
                                <option value="Info">Info</option>
                                <option value="Warning">Warning</option>
                                <option value="Error">Error</option>
                            </select>
                        </div>

                        <div className="col-md-3">
                            <select className="form-select" value={isRead}
                                onChange={(e)=>setIsRead(e.target.value)} >

                                <option value="">All</option>
                                <option value="1">Read</option>
                                <option value="0">Unread</option>
                            </select>
                        </div>
                    </div>

                    <table className="table table-bordered table-hover">
                        <thead className="table-dark">
                            <tr>
                                <th>#</th>
                                <th>Title</th>
                                <th>Message</th>
                                <th>Type</th>
                                <th>Status</th>
                                <th>Date</th>
                                <th width="250">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="text-center">
                                        Loading...
                                    </td>
                                </tr>
                            ) : notifications.length > 0 ? (
                                notifications.map((notification,index)=>(
                                    <tr key={notification.id}>
                                        <td>{index+1}</td>
                                        <td>{notification.title}</td>
                                        <td>{notification.message}</td>
                                        <td>
                                            <span className={`badge ${
                                                notification.type==="Success"?"bg-success":
                                                notification.type==="Info"?"bg-info":
                                                notification.type==="Warning"?"bg-warning":"bg-danger"
                                            }`}>
                                                {notification.type}
                                            </span>
                                        </td>
                                        <td>
                                            {notification.is_read 
                                                ?<span className="badge bg-secondary">Read</span>
                                                :<span className="badge bg-primary">Unread</span>
                                            }
                                        </td>
                                        <td>
                                            {new Date(notification.created_at).toLocaleString()}
                                        </td>
                                        <td>
                                            <Link to={`/admin/notifications/view/${notification.id}`}
                                                className="btn btn-info btn-sm me-2" >
                                                View
                                            </Link>

                                            {!notification.is_read && (
                                                <button className="btn btn-success btn-sm me-2"
                                                    onClick={()=>handleRead(notification.id)} >
                                                    Read
                                                </button>
                                            )}
                                            <button className="btn btn-danger btn-sm"
                                                onClick={()=>handleDelete(notification.id)} >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="text-center">
                                        No Notifications Found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    <Pagination pagination={pagination} onPageChange={loadNotifications} />
                </div>
            </div>
        </div>

    );

}
import { useEffect, useState } from "react";

import Loader from "../../../../components/common/Loader";

import NotificationTable from "./NotificationTable";
import { getNotifications, markAllNotificationsRead, } from "../../../../services/commentService";

import { toast } from "react-toastify";

export default function Notifications() {

    const [notifications, setNotifications] = useState([]);
    const [meta, setMeta] = useState({});

    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    const [page, setPage] = useState(1);

    useEffect(() => {
        loadNotifications();
    }, [page, search]);

    const loadNotifications = async () => {
        try {
            const res = await getNotifications({page, search,});
            setNotifications(res.data);
            setMeta(res.meta);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    const readAll = async () => {
        try {
            const res = await markAllNotificationsRead();
            toast.success(res.data.message);
            loadNotifications();
        } catch (err) {
            toast.error(err.response?.data?.message);
        }
    };

    if (loading) return <Loader />;

    return (

        <div className="card shadow">
            <div className="card-header">
                <div className="d-flex justify-content-between">
                    <h4>Notifications</h4>
                    <button className="btn btn-success btn-sm" onClick={readAll} >
                        Mark All Read
                    </button>
                </div>
            </div>

            <div className="card-body">
                <div className="row mb-3">
                    <div className="col-md-4">
                        <input className="form-control" placeholder="Search Notification..." value={search}
                            onChange={(e) => {setSearch(e.target.value); setPage(1); }}
                        />
                    </div>
                </div>

                <NotificationTable
                    notifications={notifications}
                    meta={meta}
                    reload={loadNotifications}
                    setPage={setPage}
                />
            </div>
        </div>

    );

}
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
    getNotifications,
    getUnreadNotificationCount,
    markNotificationRead,
    markAllNotificationsRead,
} from "../../services/notificationService";

export default function NotificationBell() {

    const [notifications, setNotifications] = useState([]);
    const [count, setCount] = useState(0);

    const loadNotifications = async () => {
        try {
            const [list, unread] = await Promise.all([
                getNotifications({page: 1, }),
                getUnreadNotificationCount()
            ]);
            setNotifications(list.data.data.slice(0,5));
            setCount(unread.data.count);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        loadNotifications();
        const interval = setInterval(() => {
            loadNotifications();
        },30000);
        return ()=>clearInterval(interval);
    },[]);

    const markRead = async(id)=>{
        try{
            await markNotificationRead(id);
            loadNotifications();
        }catch(err){
            console.log(err);
        }
    };

    const readAll = async()=>{
        await markAllNotificationsRead();
        loadNotifications();
    };

    return (

        <div className="dropdown">
            <button className="btn btn-light position-relative" data-bs-toggle="dropdown" >
                🔔
                {count>0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" >
                        {count}
                    </span>
                )}
            </button>

            <div className="dropdown-menu dropdown-menu-end p-0 shadow" style={{width:"380px"}} >
                <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
                    
                    <h6 className="mb-0">Notifications</h6>
                    <button className="btn btn-link btn-sm" onClick={readAll} >
                        Mark All Read
                    </button>
                </div>
                <div style={{maxHeight:"420px", overflowY:"auto"}} >
                    {notifications.length===0 && (
                        <div className="p-4 text-center">
                            No Notifications
                        </div>
                    )}

                    {notifications.map(notification=>(
                        <div key={notification.id} 
                            className={`p-3 border-bottom ${ 
                                !notification.is_read ? "bg-light" : ""
                            }`}
                        >
                            <div className="fw-semibold">
                                {notification.message}
                            </div>
                            <small className="text-muted">{notification.created_at}</small>

                            <div className="mt-2">
                                <button className="btn btn-sm btn-primary me-2"
                                    onClick={()=>markRead(notification.id)} >
                                    Read
                                </button>

                                <Link className="btn btn-sm btn-outline-secondary"
                                    to={`/admin/comments/edit/${notification.comment?.id}`} >
                                    Open
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center border-top p-2">
                    <Link to="/admin/notifications" > View All Notifications </Link>
                </div>
            </div>
        </div>

    );

}
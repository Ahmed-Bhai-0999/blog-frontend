import NotificationRow from "./NotificationRow";
import Pagination from "../../../../components/common/Pagination";

export default function NotificationTable({notifications,meta,reload,setPage,}) {
    return (

        <div className="table-responsive">
            <table className="table table-bordered table-hover align-middle">
                <thead className="table-dark">
                    <tr>
                        <th>#</th>
                        <th>Message</th>
                        <th>Type</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th width="160">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {notifications.length === 0 ? (
                        <tr>
                            <td colSpan="6" className="text-center" >
                                No Notifications Found
                            </td>
                        </tr>
                    ) : (
                        notifications.map((notification, index) => (
                            <NotificationRow
                                key={notification.id}
                                notification={notification}
                                index={index}
                                meta={meta}
                                reload={reload}
                            />
                        ))
                    )}
                </tbody>
            </table>
            <Pagination pagination={meta} onPageChange={(page) => setPage(page)} />
        </div>
    );
}
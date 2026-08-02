import Swal from "sweetalert2";
import { toast } from "react-toastify";

import { deleteActivity } from "../../../services/activityLogService";
import Loader from "../../../components/common/Loader";
import Pagination from "../../../components/common/Pagination";

export default function ActivityTable({activities,meta,loading,reload}) {

    const removeActivity = async (id) => {
        const result = await Swal.fire({
            title: "Delete Activity?",
            text: "This activity log will be deleted permanently.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#dc3545",
            confirmButtonText: "Delete",
        });

        if (!result.isConfirmed) return;

        try {
            const res = await deleteActivity(id);
            toast.success(res.data.message);
            reload(meta.current_page);
        } catch (err) {
            toast.error(
                err.response?.data?.message || "Something went wrong."
            );
        }
    };

    if (loading) {
        return <Loader />
    }

    return (

        <>
            <table className="table table-bordered table-hover align-middle">
                <thead className="table-dark">
                    <tr>
                        <th width="60">#</th>
                        <th>User</th>
                        <th>Module</th>
                        <th>Action</th>
                        <th>Description</th>
                        <th>Date</th>
                        <th width="120">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {activities.length === 0 && (
                        <tr>
                            <td colSpan="7" className="text-center" >
                                No Activity Found
                            </td>
                        </tr>
                    )}

                    {activities.map((activity, index) => (
                        <tr key={activity.id}>
                            <td>{((meta?.from ?? 1) + index)}</td>
                            <td>{activity.user?.name ?? "System"}</td>
                            <td>
                                <span className="badge bg-primary">
                                    {activity.module}
                                </span>
                            </td>
                            <td>
                                <span className={`badge ${
                                        activity.action === "Create"
                                            ? "bg-success"
                                            : activity.action === "Update"
                                            ? "bg-warning text-dark"
                                            : activity.action === "Delete"
                                            ? "bg-danger"
                                            : activity.action === "Restore"
                                            ? "bg-info text-dark"
                                            : "bg-secondary"
                                    }`}
                                >
                                    {activity.action}
                                </span>
                            </td>
                            <td>{activity.description}</td>
                            <td>{activity.created_at}</td>
                            <td>
                                <button className="btn btn-danger btn-sm"
                                    onClick={() => removeActivity(activity.id)} >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Pagination pagination={meta || {}} onPageChange={reload} />

        </>
    );

}
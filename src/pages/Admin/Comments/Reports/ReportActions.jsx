import { useState } from "react";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

import { deleteReport, updateReportStatus } from "../../../../services/commentReportService";

import ReportViewModal from "./ReportViewModal";

export default function ReportActions({report, reload}) {

    const [showModal, setShowModal] = useState(false);

    const changeStatus = async (status) => {
        try {
            const res = await updateReportStatus(report.id, {
                status,
                admin_notes: report.admin_notes ?? ""
            });
            toast.success(res.data.message);
            reload();
        } catch (err) {
            toast.error(
                err.response?.data?.message ?? "Status update failed."
            );
        }
    };

    const removeReport = async () => {
        const result = await Swal.fire({
            title: "Delete Report?",
            text: "This action cannot be undone.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Delete",
            confirmButtonColor: "#dc3545"
        });

        if (!result.isConfirmed) return;

        try {
            const res = await deleteReport(report.id);
            toast.success(res.data.message);
            reload();
        } catch (err) {
            toast.error(
                err.response?.data?.message ?? "Delete failed."
            );
        }
    };

    return (
        <>

            <div className="dropdown">
                <button className="btn btn-outline-secondary btn-sm dropdown-toggle"
                    data-bs-toggle="dropdown" >
                    Actions
                </button>

                <ul className="dropdown-menu dropdown-menu-end">
                    <li>
                        <button className="dropdown-item" onClick={() => setShowModal(true)} >
                            👁 View Report
                        </button>
                    </li>
                    <li>
                        <button className="dropdown-item" onClick={() => changeStatus("Reviewed")} >
                            📝 Mark Reviewed
                        </button>
                    </li>
                    <li>
                        <button className="dropdown-item" onClick={() => changeStatus("Actioned")} >
                            ✅ Mark Actioned
                        </button>
                    </li>
                    <li>
                        <hr className="dropdown-divider" />
                    </li>
                    <li>
                        <button className="dropdown-item text-danger" onClick={removeReport} >
                            🗑 Delete Report
                        </button>
                    </li>
                </ul>
            </div>

            <ReportViewModal
                show={showModal}
                onClose={() => setShowModal(false)}
                reportId={report.id}
                reload={reload}
            />

        </>
    );

}
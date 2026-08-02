import { useState } from "react";
import { updateReportStatus } from "../../../../services/commentReportService";

export default function ReportViewModal({report,show,onClose,reload}) {

    const [status, setStatus] = useState(report?.status || "Pending");
    const [notes, setNotes] = useState(report?.admin_notes || "");
    const [loading, setLoading] = useState(false);

    if (!show || !report) return null;

    const handleSave = async () => {
        try {
            setLoading(true);
            await updateReportStatus(report.id, {
                status,
                admin_notes: notes,
            });
            reload();
            onClose();
        } catch (err) {
            console.error(err);
            alert("Failed to update report.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="modal fade show d-block">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">

                        <div className="modal-header">
                            <h5 className="modal-title">Report Details</h5>
                            <button className="btn-close" onClick={onClose} />
                        </div>

                        <div className="modal-body">
                            <div className="mb-3">
                                <strong>Comment</strong>
                                <div className="border rounded p-2 mt-1">
                                    {report.comment?.comment}
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-6">
                                    <strong>Reporter</strong>
                                    <div>
                                        {report.reporter?.name ?? "Guest"}
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <strong>Reason</strong>
                                    <div>
                                        {report.reason}
                                    </div>
                                </div>
                            </div>

                            <hr />

                            <div className="mb-3">
                                <label className="form-label">Status</label>
                                <select className="form-select" value={status}
                                    onChange={(e) => setStatus(e.target.value)} >
                                    <option value="Pending">Pending</option>
                                    <option value="Reviewed">Reviewed</option>
                                    <option value="Actioned">Actioned</option>
                                </select>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Admin Notes</label>
                                <textarea rows={4} className="form-control" value={notes}
                                    onChange={(e) => setNotes(e.target.value)} />
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={onClose} >
                                Close
                            </button>
                            <button className="btn btn-primary" disabled={loading}
                                onClick={handleSave} >
                                {loading ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="modal-backdrop fade show"></div>
        </>
    );
}
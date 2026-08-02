import ReportRow from "./ReportRow";
import Pagination from "../../../../components/common/Pagination";

export default function ReportTable({reports, meta, reload, onPageChange, }) {
    
    return (
        <>
            <table className="table table-bordered table-hover align-middle">
                <thead className="table-dark">
                    <tr>
                        <th width="60">#</th>
                        <th>Comment</th>
                        <th>Reporter</th>
                        <th>Reason</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th width="120">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {reports.length === 0 ? (
                        <tr>
                            <td colSpan="7" className="text-center">No Reports Found</td>
                        </tr>
                    ) : (
                        reports.map((report, index) => (
                            <ReportRow key={report.id} report={report} index={index}
                                meta={meta} reload={reload} />
                        ))
                    )}
                </tbody>
            </table>

            <Pagination pagination={meta} onPageChange={onPageChange} />
        </>
    );
}
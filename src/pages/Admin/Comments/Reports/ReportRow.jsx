// import Badge from "../../../components/common/Badge";
import ReportActions from "./ReportActions";

export default function ReportRow({report, index, meta, reload}) {

    const badgeClass = (status) => {
        switch (status) {
            case "Pending":
                return "warning";

            case "Reviewed":
                return "info";

            case "Actioned":
                return "success";

            default:
                return "secondary";
        }
    };

    return (

        <tr>
            <td>{(meta.from || 1) + index}</td>
            <td style={{maxWidth:"350px"}}>
                <div className="fw-semibold">{report.comment?.comment}</div>
            </td>
            <td>
                {report.reporter?.name ?? "Guest"}
            </td>
            <td>
                <span className="badge bg-danger">{report.reason}</span>
            </td>
            <td>
                <span className={`badge bg-${badgeClass(report.status)}`}>
                    {report.status}
                </span>
            </td>
            <td>
                {report.created_at}
            </td>
            <td>
                <ReportActions report={report} reload={reload} />
            </td>
        </tr>

    );

}
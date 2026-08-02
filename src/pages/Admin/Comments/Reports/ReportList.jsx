import { useEffect, useState } from "react";

import ReportTable from "./ReportTable";

import Loader from "../../../../components/common/Loader";

import { getReports } from "../../../../services/commentReportService";

export default function ReportList() {

    const [reports, setReports] = useState([]);
    const [meta, setMeta] = useState({});

    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadReports();
    }, [page, search]);

    const loadReports = async () => {
        try {
            const res = await getReports({page,search});
            setReports(res.data.data);
            setMeta(res.data.meta);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
            return <Loader />;
        }

    return (

        <div className="card shadow">
            <div className="card-header">
                <h4>Reported Comments</h4>
            </div>

            <div className="card-body">
                <div className="mb-3">
                    <input className="form-control" placeholder="Search..." value={search}
                        onChange={(e) => {setSearch(e.target.value); setPage(1); }} />
                </div>

                <ReportTable 
                    reports={reports}
                    meta={meta}
                    reload={loadReports}
                    onPageChange={setPage}
                />
            </div>
        </div>

    );
}
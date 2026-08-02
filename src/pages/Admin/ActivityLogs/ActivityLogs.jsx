import { useEffect, useState } from "react";

import { getActivities } from "../../../services/activityLogService";
import ActivityTable from "./ActivityLogTable";

export default function ActivityLogs() {

    const [activities,setActivities]=useState([]);
    const [meta,setMeta]=useState({});
    const [loading,setLoading]=useState(false);

    const [search,setSearch]=useState("");
    const [module,setModule]=useState("");
    const [action,setAction]=useState("");
    const [sort,setSort]=useState("");

    const loadActivities=async(page=1)=>{
        try{
            setLoading(true);
            const res = await getActivities({
                page,
                search,
                module,
                action,
                sort,
            });

            console.log(res.data.data);
            setActivities(res.data.data);
            setMeta(res.data.meta);
        }catch(err){
            console.log(err);
        }finally{
            setLoading(false);
        }
    }

    useEffect(()=>{
        const timer=setTimeout(()=>{
            loadActivities(1);
        },500);
        return ()=>clearTimeout(timer);
    },[search,module,action,sort]);

    useEffect(()=>{
        loadActivities();
    },[]);

    return(

        <div className="container-fluid">
            <div className="card">
                <div className="card-header">
                    <h4>Activity Logs</h4>
                </div>

                <div className="card-body">
                    <div className="row mb-3">
                        <div className="col-md-3">
                            <input className="form-control" placeholder="Search..." value={search}
                                onChange={(e)=>setSearch(e.target.value)} />
                        </div>

                        <div className="col-md-3">
                            <input className="form-control" placeholder="Module" value={module}
                                onChange={(e)=>setModule(e.target.value)} />
                        </div>

                        <div className="col-md-3">
                            <input className="form-control" placeholder="Action" value={action}
                                onChange={(e)=>setAction(e.target.value)} />
                        </div>

                        <div className="col-md-3">
                            <select className="form-select" value={sort} onChange={(e)=>setSort(e.target.value)} >
                                <option value="">Newest</option>
                                <option value="oldest">Oldest</option>
                            </select>
                        </div>
                    </div>

                    <ActivityTable activities={activities} meta={meta} loading={loading} reload={loadActivities} />
                </div>
            </div>
        </div>
    )
}
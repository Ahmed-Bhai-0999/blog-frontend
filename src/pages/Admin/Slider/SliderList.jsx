import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Swal from "sweetalert2";
import { toast } from "react-toastify";

import { getSliders } from "../../../services/sliderService";
import SliderTable from "./components/SliderTable";

export default function SliderList() {

    const [sliders, setSliders] = useState([]);
    const [meta, setMeta] = useState({});
    const [loading, setLoading] = useState(false);

    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");

    const loadSliders = async (page = 1) => {
        try {
            setLoading(true);
            const res = await getSliders({page,search,status,});
            setSliders(res.data);
            setMeta(res.meta);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            loadSliders(1);
        }, 500);

        return () => clearTimeout(timer);
    }, [search, status]);

    useEffect(() => {
        loadSliders();
    }, []);

    return (

        <div className="container-fluid">
            <div className="card">
                <div className="card-header d-flex justify-content-between">
                    <h4>Slider List</h4>
                    <div>
                        <Link to="/admin/sliders/create" className="btn btn-primary btn-sm" >
                            Add Slider
                        </Link>

                        <Link to="/admin/sliders/trash" className="btn btn-danger btn-sm ms-2" >
                            Trash
                        </Link>
                    </div>
                </div>

                <div className="card-body">
                    <div className="row mb-3">
                        <div className="col-md-4">
                            <input type="text" className="form-control" placeholder="Search..."
                                value={search} onChange={(e) => setSearch(e.target.value)} />
                        </div>

                        <div className="col-md-6"></div>

                        <div className="col-md-2">
                            <select className="form-select" value={status}
                                onChange={(e) => setStatus(e.target.value)} >

                                <option value="">All Status</option>
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                        </div>
                    </div>

                    <SliderTable sliders={sliders} meta={meta} loading={loading} reload={loadSliders} />
                </div>
            </div>
        </div>

    );

}
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getSettings } from "../../../services/settingService";
import Loader from "../../../components/common/Loader";

export default function SettingIndex() {

    const [setting, setSetting] = useState(null);
    const [loading, setLoading] = useState(true);

   const loadSetting = async () => {
    try {
        const res = await getSettings();

        console.log("API Response:", res);
        console.log("Data:", res.data);

        setSetting(res.data);
    } catch (err) {
        console.log(err);
    } finally {
        setLoading(false);
    }
};

    useEffect(() => {
        loadSetting();
    }, []);

    if (loading) {
        return <Loader />
    }

    return (
        <div className="container-fluid">

            <div className="card shadow-sm">
                <div className="card-header d-flex justify-content-between align-items-center">
                    <h4 className="mb-0">Website Settings</h4>
                    {setting ? (
                        <Link to={`/admin/settings/edit/${setting.id}`} className="btn btn-primary" >
                            Edit Settings
                        </Link>
                    ) : (
                        <Link to="/admin/settings/create" className="btn btn-success" >
                            Create Settings
                        </Link>
                    )}
                </div>

                <div className="card-body">

                    {!setting ? (
                        <div className="alert alert-warning mb-0">
                            Website settings have not been created yet.
                        </div>
                    ) : (

                        <div className="row">
                            <div className="col-md-6">
                                <table className="table table-bordered">
                                    <tbody>
                                        <tr>
                                            <th width="200">Site Name</th>
                                            <td>{setting.site_name}</td>
                                        </tr>
                                        <tr>
                                            <th>Tagline</th>
                                            <td>{setting.site_tagline}</td>
                                        </tr>
                                        <tr>
                                            <th>Email</th>
                                            <td>{setting.site_email}</td>
                                        </tr>
                                        <tr>
                                            <th>Phone</th>
                                            <td>{setting.site_phone}</td>
                                        </tr>
                                        <tr>
                                            <th>Timezone</th>
                                            <td>{setting.timezone}</td>
                                        </tr>
                                        <tr>
                                            <th>Language</th>
                                            <td>{setting.language}</td>
                                        </tr>
                                        <tr>
                                            <th>Posts Per Page</th>
                                            <td>{setting.posts_per_page}</td>
                                        </tr>
                                        <tr>
                                            <th>Default Status</th>
                                            <td>{setting.default_post_status}</td>
                                        </tr>
                                        <tr>
                                            <th>Maintenance</th>
                                            <td>
                                                <span className={`badge bg-${setting.maintenance_mode ? "danger" : "success"}`}>
                                                    {setting.maintenance_mode ? "ON" : "OFF"}
                                                </span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>Allow Comments</th>
                                            <td>
                                                <span className={`badge bg-${setting.allow_comments ? "success" : "secondary"}`}>
                                                    {setting.allow_comments ? "Yes" : "No"}
                                                </span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="col-md-6">

                                <div className="mb-4">
                                    <label className="fw-bold d-block mb-2">Site Logo</label>
                                    {setting.site_logo ? (
                                        <img src={setting.site_logo} className="img-thumbnail"
                                            width="200" alt="" />
                                    ) : (
                                        <p>No Logo</p>
                                    )}
                                </div>
                                <div>
                                    <label className="fw-bold d-block mb-2">Site Favicon</label>
                                    {setting.site_favicon ? (
                                        <img src={setting.site_favicon} className="img-thumbnail"
                                            width="70" alt="" />
                                    ) : (
                                        <p>No Favicon</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
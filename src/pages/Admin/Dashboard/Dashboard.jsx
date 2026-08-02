import { useEffect, useState } from "react";
import { getDashboardStats } from "../../../services/dashboardService";

import StatCard from "../../../components/admin/StatCard";
import RecentPosts from "../../../components/admin/RecentPosts";
import RecentComments from "../../../components/admin/RecentComments";
import RecentContacts from "../../../components/admin/RecentContacts";

export default function Dashboard() {

    const [dashboard, setDashboard] = useState(null);

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {
        try {
            const data = await getDashboardStats();
            console.log(data);
            setDashboard(data);
        } catch (error) {
            console.log(error);
        }
    };

    if (!dashboard) {
        return <h3>Loading...</h3>;
    }

    return (
        <div className="container-fluid">

            <h2 className="mb-4">Dashboard</h2>
            <div className="row">
                <StatCard title="Posts" value={dashboard.stats.posts.total}
                    icon="bi-file-earmark-text" color="primary" />

                <StatCard title="Categories" value={dashboard.stats.categories}
                    icon="bi-folder" color="success" />

                <StatCard title="Tags" value={dashboard.stats.tags}
                    icon="bi-tags" color="warning" />

                <StatCard title="Users" value={dashboard.stats.users}
                    icon="bi-people" color="danger" />
            </div>

            <div className="row mt-3">
                <StatCard title="Comments" value={dashboard.stats.comments.total}
                    icon="bi-chat" color="info" />

                <StatCard title="Views" value={dashboard.stats.posts.views}
                    icon="bi-eye" color="secondary" />

                <StatCard title="Contacts" value={dashboard.stats.contacts.total}
                    icon="bi-envelope" color="dark" className="text-white" />

                <StatCard title="Pending Comments" value={dashboard.stats.comments.pending}
                    icon="bi-clock" color="warning" />
            </div>

            <div className="row mt-5">
                <div className="col-lg-6">
                    <RecentPosts posts={dashboard.recent_posts} />
                </div>
                <div className="col-lg-6">
                    <RecentComments comments={dashboard.recent_comments} />
                </div>
            </div>

            <div className="row mt-4">
                <div className="col-lg-12">
                    <RecentContacts contacts={dashboard.recent_contacts} />
                </div>
            </div>

        </div>
    );
}


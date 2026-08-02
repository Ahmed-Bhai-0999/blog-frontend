import WelcomeCard from "../../../components/admin/WelcomeCard";
import DashboardCards from "../../../components/admin/DashboardCards";
import AnalyticsChart from "../../../components/admin/AnalyticsChart";
import RecentPosts from "../../../components/admin/RecentPosts";
import RecentContacts from "../../../components/admin/RecentContacts";
import RecentComments from "../../../components/admin/RecentComments";
import QuickActions from "../../../components/admin/QuickActions";

export default function Dashboard(){

    return(
        <>
            <WelcomeCard/>
            <DashboardCards/>
            <div className="row mt-4">
                <div className="col-lg-8"> 
                    <AnalyticsChart/> 
                </div>
                <div className="col-lg-4">
                    <QuickActions/>
                </div>
            </div>

            <div className="row mt-4">
                <div className="col-lg-8">
                    <RecentPosts/>
                </div>
                <div className="col-lg-4">
                    <RecentContacts/>
                </div>
            </div>

            <div className="row mt-4">
                <div className="col-lg-12">
                    <RecentComments/>
                </div>
            </div>
        </>

    );
}
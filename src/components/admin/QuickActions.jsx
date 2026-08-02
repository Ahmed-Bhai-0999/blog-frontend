import { Link } from "react-router-dom";

export default function QuickActions(){

    return(

        <div className="card shadow">

            <div className="card-header">Quick Actions </div>

            <div className="card-body d-grid gap-2">
                <Link className="btn btn-primary" to="/admin/posts/create">
                    + New Post
                </Link>

                <Link className="btn btn-success" to="/admin/categories/create">
                    + Category
                </Link>

                <Link className="btn btn-warning" to="/admin/pages/create">
                    + Page
                </Link>

                <Link className="btn btn-dark" to="/admin/users/create">
                    + User
                </Link>
            </div>

        </div>

    );

}
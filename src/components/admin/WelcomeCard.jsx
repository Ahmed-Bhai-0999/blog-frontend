import { useAuth } from "../../context/AuthContext";

export default function WelcomeCard(){

    const {user}=useAuth();

    return(

        <div className="card shadow-sm border-0 mb-4">
            <div className="card-body">
                <h3>Welcome Back 👋 {user?.name} </h3>

                <p className="text-muted">Manage your blog from one place. </p>
            </div>
        </div>

    );

}
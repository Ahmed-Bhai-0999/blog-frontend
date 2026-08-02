import { Link } from "react-router-dom";

export default function NotFound(){

    return(
        <div className="container py-5 text-center">

            <h1 className="display-2">404</h1>
            <h3>Page Not Found</h3>
            <p>The page you are looking for does not exist.</p>
            <Link to="/" className="btn btn-primary" >Go Home</Link>

        </div>
    )
}
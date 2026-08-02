
import { Outlet } from "react-router-dom"; 
import Sidebar from "../components/admin/Sidebar"; 
import Navbar from "../components/admin/Navbar"; 

export default function AdminLayout() { 
    return ( 
        <div className="d-flex"> 
            <Sidebar /> 
            <div className="flex-grow-1"> 
                <Navbar /> 
                <div className="container-fluid p-4"> 
                    <Outlet /> 
                </div> 
            </div> 
        </div> 
    ); 
}
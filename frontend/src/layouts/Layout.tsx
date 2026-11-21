import Sidebar from "../components/Sidebar"
import Navbar from "../components/Navbar"
import { Outlet } from "react-router-dom"
import type { Theme } from "../App";

type LayoutProps = {
    theme: Theme;
    toggleTheme: () => void;
};

export default function Layout({ theme, toggleTheme }: LayoutProps){
    
    return(
        <div className="dashboard-layout" >
            <Sidebar />
            <div className="main-content">
                <Navbar theme={theme} toggleTheme={toggleTheme} />
                <Outlet />
            </div>
        </div>
    )
}
import { NavLink } from "react-router-dom"
import logo from '../assets/logo.png';
import {LayoutDashboard,GitPullRequest,Layers,Settings} from 'lucide-react';

export default function Sidebar(){
    return(
        <aside>
            <div className="branding">
                <img src={logo} alt="PRism Logo" />
            </div>
            <div className="navigations">
                <NavLink to="/" end> {<LayoutDashboard />} Dashboard</NavLink>
                <NavLink to="/reviews"> {<GitPullRequest />} Reviews</NavLink>
                <NavLink to="/repositories"> {<Layers />} Repositories</NavLink>
                <NavLink to="/settings"> {<Settings />} Settings</NavLink>
            </div>
            <div className="sidebar-footer">
                <span>v1.0</span>
                <p>PRism Code Review</p>
            </div>
        </aside>
    )
}
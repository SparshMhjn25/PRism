import { useLocation } from "react-router-dom"
import { Bell, ChevronDown, Sun, Moon } from "lucide-react"
import profile from '../assets/profile.png';
import type { Theme } from "../App";

type NavbarProps = {
    theme: Theme;
    toggleTheme: () => void;
};

export default function Navbar({ theme, toggleTheme }: NavbarProps){
    const {pathname} = useLocation();
    const pageTitle = (() => {
        switch (pathname) {
            case "/":
                return "Dashboard";
            case "/reviews":
                return "Reviews";
            case "/repositories":
                return "Repositories";
            case "/settings":
                return "Settings";
            default:
                return "PRism";
        }
    })();
    return(
        <header>
            <div className="navbar-left">
                <h3>{pageTitle}</h3>
            </div>
            <div className="navbar-right">
                <Bell className="notification-icon" />
                <button
                    className="theme-toggle"
                    onClick={toggleTheme}
                    aria-label="Toggle theme"
                    title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
                >{theme === "light" ? <Moon size={19} /> : <Sun size={19} />}
                </button>
                <img src={profile} alt="profile pic" className="profile-pic"/>
                <ChevronDown />
            </div>
        </header>
    )
}
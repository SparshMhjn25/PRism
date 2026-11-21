import WelcomeBanner from "../components/WelcomeBanner";
import StatCard from "../components/StatCard";
import {GitPullRequest,CheckCircle,AlertCircle,FolderGit} from "lucide-react";

export default function Dashboard() {
    const cards = [
    {
        title: "Total Reviews",
        value: 24,
        description: "Reviews processed",
        icon: GitPullRequest,
        iconBackground: "#EDE9FE",
        cardBackground: "#DCCBFF"
    },
    {
        title: "Completed",
        value: 20,
        description: "Successfully completed reviews",
        icon: CheckCircle,
        iconBackground: "#DCFCE7",
        cardBackground: "#C9EBD6"
    },
    {
        title: "Failed",
        value: 4,
        description: "Reviews that encountered errors",
        icon: AlertCircle,
        iconBackground: "#FEE2E2",
        cardBackground: "#F4D0D0"
    },
    {
        title: "Repositories",
        value: 3,
        description: "Connected GitHub repositories",
        icon: FolderGit,
        iconBackground: "#DBEAFE",
        cardBackground: "#CADCF5"
    }
];
    return (
        <div className="dashboard-content">
            <WelcomeBanner />
            <div className="stats-grid">
                {
                    cards.map(card => (
                        <StatCard key={card.title} title={card.title} value={card.value} description={card.description} icon={card.icon} iconBackground={card.iconBackground} cardBackground={card.cardBackground}/>
                    ))
                }
            </div>
        </div>
    );
}
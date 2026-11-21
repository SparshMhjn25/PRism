import type { LucideIcon } from "lucide-react";

export type Card = {
    title: string;
    value: number;
    description: string;
    icon: LucideIcon;
    iconBackground: string;
    cardBackground: string;
}

export default function StatCard(props: Card){
    const { title, value, description, icon: Icon, cardBackground } = props;
    return(
        <div className="stat-card" style={{ backgroundColor: `var(--stat-card-bg, ${cardBackground})` }}>
            <div className="stat-card-header" >
                <h3>{title}</h3>
                <div className="stat-card-icon">
                    <Icon size={22} className="stat-card-lucide-icon"/>
                </div>
            </div>
            <h2>{value}</h2>
            <p>{description}</p>
        </div>
    )
}
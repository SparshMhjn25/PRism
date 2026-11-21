import welcomebanner from '../assets/welcome-banner.png';

export default function WelcomeBanner(){
    return(
        <section>
            <img src={welcomebanner} alt="Welcome to PRism" className="welcome-banner-image" />
        </section>
    )
}
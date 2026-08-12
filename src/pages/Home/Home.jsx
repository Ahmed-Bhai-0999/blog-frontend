import HeroSlider from "../../components/home/HeroSlider";
import FeaturedPosts from "../../components/home/FeaturedPosts";
import LatestPosts from "../../components/home/LatestPosts";
import CategoriesSection from "../../components/home/CategoriesSection";
import Sidebar from "../../components/sidebar/Sidebar";
import NewsletterWidget from "../../components/sidebar/NewsletterWidget";

export default function Home() {
    return (
        <>
            <HeroSlider />

            <FeaturedPosts />

            <section className="home-content-section py-5">
                <div className="container">
                    <div className="row g-5">
                        <div className="col-lg-8">
                            <LatestPosts />
                        </div>
                        <div className="col-lg-4">
                            <Sidebar />
                        </div>
                    </div>
                </div>
            </section>

            <CategoriesSection />

            <NewsletterWidget variant="full" />
        </>
    );
}
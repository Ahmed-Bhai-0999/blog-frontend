import SearchWidget from "./SearchWidget";
import RecentPostsWidget from "./RecentPostsWidget";
import PopularPostsWidget from "./PopularPostsWidget";
import CategoriesWidget from "./CategoriesWidget";
import TagsWidget from "./TagsWidget";
import NewsletterWidget from "./NewsletterWidget";

export default function Sidebar() {
    return (
        <aside className="blog-sidebar" aria-label="Blog sidebar">
            <SearchWidget />
            <RecentPostsWidget limit={5} />
            <PopularPostsWidget limit={5} />
            <CategoriesWidget limit={10} />
            <TagsWidget limit={15} />
            <NewsletterWidget variant="sidebar" />
        </aside>
    );
}

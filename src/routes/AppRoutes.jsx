import { BrowserRouter, Routes, Route } from "react-router-dom";

// Layouts
import MainLayout from "../layouts/MainLayout";
import AdminLayout from "../layouts/AdminLayout";

// Front Pages
import Home from "../pages/Home/Home";
import Blog from "../pages/Blog/Blog";
import SinglePost from "../pages/Post/SinglePost";
import CategoryPosts from "../pages/Category/CategoryPosts";
import TagPosts from "../pages/Tag/TagPosts";
import AuthorPosts from "../pages/Author/AuthorPosts";
import Search from "../pages/Search/Search";
import About from "../pages/About/About";
import Contact from "../pages/Contact/Contact";
import Page from "../pages/Static/Page";
import NotFound from "../pages/Error404/NotFound";
import Posts from "../pages/Admin/Posts/Posts";
import CreatePost from "../pages/Admin/Posts/CreatePost";
import EditPost from "../pages/Admin/Posts/EditPost";

// Admin
import Login from "../pages/Admin/Login/Login";
import Dashboard from "../pages/Admin/Dashboard/Dashboard";
import ProtectedRoute from "./ProtectedRoute";
import TrashPosts from "../pages/Admin/Posts/TrashPosts";

import Categories from "../pages/Admin/Categories/Categories";
import CreateCategory from "../pages/Admin/Categories/CreateCategory";
import EditCategory from "../pages/Admin/Categories/EditCategory";
import TrashCategories from "../pages/Admin/Categories/TrashCategories";

import Tags from "../pages/Admin/Tags/Tags";
import CreateTag from "../pages/Admin/Tags/CreateTag";
import EditTag from "../pages/Admin/Tags/EditTag";
import TrashTags from "../pages/Admin/Tags/TrashTags";

import Users from "../pages/Admin/Users/Users";
import CreateUser from "../pages/Admin/Users/CreateUser";
import EditUser from "../pages/Admin/Users/EditUser";
import TrashUsers from "../pages/Admin/Users/TrashUsers";

import Comments from "../pages/Admin/Comments/Comments";
import EditComment from "../pages/Admin/Comments/EditComment";
import TrashComments from "../pages/Admin/Comments/TrashComments";

import SliderList from "../pages/Admin/Slider/SliderList";
import SliderForm from "../pages/Admin/Slider/SliderForm";
import SliderTrash from "../pages/Admin/Slider/SliderTrash";

import ReportList from "../pages/Admin/Comments/Reports/ReportList";
import ActivityList from "../pages/Admin/ActivityLogs/ActivityLogs";

import Settings from "../pages/Admin/Settings/Settings";
import CreateSetting from "../pages/Admin/Settings/CreateSetting";
import EditSetting from "../pages/Admin/Settings/EditSetting";

import Pages from "../pages/Admin/Pages/Pages";
import CreatePage from "../pages/Admin/Pages/CreatePage";
import EditPage from "../pages/Admin/Pages/EditPage";

import ContactMessages from "../pages/Admin/Contacts/ContactMessages";
import ViewContactMessage from "../pages/Admin/Contacts/ViewContactMessage";

import Menus from "../pages/Admin/Menus/Menus";
import CreateMenu from "../pages/Admin/Menus/CreateMenu";
import EditMenu from "../pages/Admin/Menus/EditMenu";
import TrashMenus from "../pages/Admin/Menus/TrashMenus";

import Notifications from "../pages/Admin/Notifications/Notifications";
import NotificationBell from "../pages/Admin/Notifications/NotificationBell";
import ViewNotification from "../pages/Admin/Notifications/ViewNotification";
import NotificationDropdown from "../pages/Admin/Notifications/NotificationDropdown";

import SeoSetting from "../pages/Admin/Seo/SeoSetting";
import CreateSeoSetting from "../pages/Admin/Seo/CreateSeoSetting";
import EditSeoSetting from "../pages/Admin/Seo/EditSeoSetting";

import NewsletterList from "../pages/Admin/NewsLetter/NewsletterList";
import EditNewsletter from "../pages/Admin/NewsLetter/EditNewsletter";
import CreateNewsletter from "../pages/Admin/NewsLetter/CreateNewsletter";
import TrashNewsletter from "../pages/Admin/NewsLetter/TrashNewsletter";

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                {/* ================= FRONTEND ================= */}
                <Route element={<MainLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/post/:slug" element={<SinglePost />} />
                    <Route path="/category/:slug" element={<CategoryPosts />} />
                    <Route path="/tag/:slug" element={<TagPosts />} />
                    <Route path="/author/:id" element={<AuthorPosts />} />
                    <Route path="/search" element={<Search />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/page/:slug" element={<Page />} />
                </Route>


                {/* ================= LOGIN ================= */}
                <Route path="/admin/login" element={<Login />} />


                {/* ================= ADMIN ================= */}
                <Route path="/admin" element={
                                        <ProtectedRoute>
                                            <AdminLayout />
                                        </ProtectedRoute>
                                    }
                >

                    <Route path="dashboard" element={<Dashboard />} />
                                    
                                    {/* Users Route */}
                    <Route path="users" element={<Users />} />
                    <Route path="users/create" element={<CreateUser />} />
                    <Route path="users/edit/:id" element={<EditUser />} />
                    <Route path="users/trash" element={<TrashUsers />} />                    

                                    {/* Post Route */}
                    <Route path="posts" element={<Posts />} />
                    <Route path="posts/create" element={<CreatePost />} />
                    <Route path="posts/edit/:id" element={<EditPost />} />
                    <Route path="/admin/posts/trash" element={<TrashPosts />} />

                                    {/* Category Route */}
                    <Route path="categories" element={<Categories />} />
                    <Route path="categories/create" element={<CreateCategory />} />
                    <Route path="categories/edit/:id" element={<EditCategory />} />
                    <Route path="categories/trash" element={<TrashCategories />} />

                                    {/* Tags Route */}
                    <Route path="tags" element={<Tags />} />
                    <Route path="tags/create" element={<CreateTag />} />
                    <Route path="tags/edit/:id" element={<EditTag />} />
                    <Route path="tags/trash" element={<TrashTags />} />

                                    {/* Comments Route */}
                    <Route path="comments" element={<Comments />} />
                    <Route path="comments/edit/:id" element={<EditComment />} />
                    <Route path="comments/trash" element={<TrashComments />} />

                                    {/* Slider Routes */}
                    <Route path="sliders" element={<SliderList />} />
                    <Route path="sliders/create" element={<SliderForm />} />
                    <Route path="sliders/edit/:id" element={<SliderForm isEdit={true} />} />
                    <Route path="sliders/trash" element={<SliderTrash />} />

                                    {/* Activity Log Route */}
                    <Route path="activity-logs" element={<ActivityList />} />

                                    {/* Setting Route */}
                    <Route path="/admin/settings" element={<Settings />} />
                    <Route path="/admin/settings/create" element={<CreateSetting />} />
                    <Route path="/admin/settings/edit/:id" element={<EditSetting />} />

                                    {/* Pages Route */}
                    <Route path="/admin/pages" element={<Pages/>}/>
                    <Route path="/admin/pages/create" element={<CreatePage/>}/>
                    <Route path="/admin/pages/edit/:id" element={<EditPage/>}/>

                                    {/* Contact Messages Route */}
                    <Route path="contacts" element={<ContactMessages />}/>
                    <Route path="contacts/view/:id" element={<ViewContactMessage />}/>

                                    {/* Menu Management Route */}
                    <Route path="menus" element={<Menus />} />
                    <Route path="menus/create" element={<CreateMenu />} />
                    <Route path="menus/edit/:id" element={<EditMenu />} />
                    <Route path="menus/trash" element={<TrashMenus />} />

                                    {/* Notification Route */}
                    <Route path="notifications" element={<Notifications />} />
                    <Route path="notifications/bell" element={<NotificationBell />} />
                    <Route path="notifications/view/:id" element={<ViewNotification />} />
                    <Route path="notifications/dropdown" element={<NotificationDropdown />} />

                                    {/* SEO Setting Route */}
                    <Route path="seo-settings" element={<SeoSetting />} />
                    <Route path="seo-settings/create" element={<CreateSeoSetting />} />
                    <Route path="seo-settings/edit/:id" element={<EditSeoSetting />} />

                                    {/* NewsLetter Route */}
                    <Route path="newsletters" element={<NewsletterList />} />
                    <Route path="newsletters/create" element={<CreateNewsletter />} />
                    <Route path="newsletters/edit/:id" element={<EditNewsletter />} />
                    <Route path="newsletters/trash" element={<TrashNewsletter />} />

                                    {/* Comment Report Route */}
                    <Route path="/admin/comments/reports" element={<ReportList />} />


                </Route>

                <Route path="*" element={<NotFound />} />

            </Routes>

        </BrowserRouter>
    );
}
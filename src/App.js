import React, { useState, useCallback, Suspense } from "react";
import Layout from "./core/Layout";
import { Switch, Route, Redirect } from "react-router-dom";
import { AuthContext } from "./helpers/context/auth-context";
// import Feeds from "./core/Feeds";
// import UserFeeds from "./user/pages/Feeds";
// import NotFound from "./core/NotFound";
// import Auth from "./auth/pages/Auth";
// import CreateBlog from "./blogs/pages/CreateBlog";
// import UpdateBlog from "./blogs/pages/updateBlog";
// import Blog from "./blogs/pages/Blog";
// import Tag from "./blogs/pages/tag";
// import Contact from "./core/contact";
// import PublicProfile from "./user/pages/PublicProfile";
// import Profile from "./user/pages/Profile";

const Blog = React.lazy(() => import("./blogs/pages/Blog"));
const Tag = React.lazy(() => import("./blogs/pages/tag"));
const Contact = React.lazy(() => import("./core/contact"));
const Auth = React.lazy(() => import("./auth/pages/Auth"));
const NotFound = React.lazy(() => import("./core/NotFound"));
const CreateBlog = React.lazy(() => import("./blogs/pages/CreateBlog"));
const UpdateBlog = React.lazy(() => import("./blogs/pages/updateBlog"));
const PublicProfile = React.lazy(() => import("./user/pages/PublicProfile"));
const Profile = React.lazy(() => import("./user/pages/Profile"));
const UserFeeds = React.lazy(() => import("./user/pages/Feeds"));
const Feeds = React.lazy(() => import("./core/Feeds"));

function App() {
  const [token, setToken] = useState(null);
  const [username, setUsername] = useState(null);
  const [userId, setUserId] = useState(null);

  const login = useCallback((username, token, uid) => {
    setUsername(username);
    setUserId(uid);
    setToken(token);
  }, []);
  const logout = useCallback(() => {
    setUsername(null);
    setUserId(null);
    setToken(null);
  }, []);

  let routes;

  if (token) {
    routes = (
      <Switch>
        <Route path="/feeds/me" component={UserFeeds} />
        <Route path="/feeds" component={Feeds} />
        <Route path="/Blogs/create" component={CreateBlog} />
        <Route path="/Blogs/update/:id" component={UpdateBlog} />
        <Route path="/Blogs/:id" component={Blog} />
        <Route path="/contact" component={Contact} />
        <Route path="/profile/me" component={Profile} />
        <Route
          path={`/profile/${username}`}
          render={() => <Redirect to="/profile/me" />}
        />
        <Route path="/profile/:username" component={PublicProfile} />
        <Route path="/tags/:name" component={Tag} />
        <Route path="/notfound" component={NotFound} />
        <Redirect from="/" exact to="/feeds" />
        <Redirect from="/signIn" exact to="/feeds" />
        <Redirect from="/signUp" exact to="/feeds" />
        <Redirect to="/notfound" />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path="/signIn" component={Auth} />
        <Route path="/signUp" component={Auth} />
        <Route path="/contact" component={Contact} />
        <Route path="/tags/:name" component={Tag} />
        <Route path="/Blogs/:id" component={Blog} />
        <Route path="/feeds" exact component={Feeds} />
        <Redirect from="/" exact to="/feeds" />
        <Redirect to="/signUp" />
      </Switch>
    );
  }

  return (
    <AuthContext.Provider
      value={{ isLoggedIn: !!token, login, logout, username, token, userId }}
    >
      <Layout>
        <Suspense
          fallback={
            <div className="d-flex justify-content-center mt-4">
              <div className="spinner-border" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          }
        >
          {routes}
        </Suspense>
      </Layout>
    </AuthContext.Provider>
  );
}

export default App;

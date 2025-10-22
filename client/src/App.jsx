import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Button } from "./components/ui/button"
import { RouteAddBlog, RouteAddCategory, RouteConfirmVerification, RouteDashBoardBlog, RouteDashBoardCategory, RouteEditCategory, RouteForgotPassword, RouteIndex, RouteOtpVerification, RouteResetPassword, RouteSignIn, RouteSignUp, RouteUpdateUserProfile, RouteVerification } from "./helper/RouteName"
import Index from "./Layout/Index"
import Layout from "./Layout/Layout"
import SignUp from "./pages-Auth/SignUp"
import SignIn from "./pages-Auth/SignIn"
import ForgotPassword from "./pages-Auth/ForgotPassword"
import ResetPassword from "./pages-Auth/ResetPassword"
import OtpVerification from "./pages-Auth/OtpVerification"
import Verification from "./pages-Auth/Verification"
import ConfirmVerification from "./pages-Auth/confirmVerification"
import Profile from "./pages-user/UpdateProfile"
import UpdateProfile from "./pages-user/UpdateProfile"
import ShowProfile from "./pages-user/ShowProfile"
import AddCategory from "./pages-category/AddCategory"
import EditCatigory from './pages-category/EditCatigory';
import DashbardCatigory from './pages-category/DashbardCatigory';
import ProtectedRoute from "./components/ProtectedRoute"
import AddBlog from "./pages-blog/AddBlog"
import UpdateBlog from "./pages-blog/UpdateBlog"
import DashBoardBlog from "./pages-blog/DashBoardBlog"


function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>

          <Route path={RouteIndex} element={<Layout />} >

            <Route index element={<Index />} />

            {/* User */}
            <Route path="showuser/:id" element={<ProtectedRoute> <ShowProfile />  </ProtectedRoute>} />
            <Route path="updateuser/:id" element={<ProtectedRoute> <UpdateProfile /> </ProtectedRoute>} />

            {/* Categories */}
            <Route path={RouteAddCategory} element={<ProtectedRoute> <AddCategory /> </ProtectedRoute>} />
            <Route path="/category/update/:id" element={<ProtectedRoute> <EditCatigory /> </ProtectedRoute>} />
            <Route path={RouteDashBoardCategory} element={<ProtectedRoute> <DashbardCatigory /> </ProtectedRoute>} />

            {/* Blogs */}
            <Route path={RouteAddBlog} element={<ProtectedRoute> <AddBlog /> </ProtectedRoute>} />
            <Route path="/blog/update/:id" element={<ProtectedRoute> <UpdateBlog /> </ProtectedRoute>} />
            <Route path={RouteDashBoardBlog} element={<ProtectedRoute> <DashBoardBlog /> </ProtectedRoute>} />

          </Route>

          <Route path={RouteSignIn} element={<SignIn />} />
          <Route path={RouteSignUp} element={<SignUp />} />
          <Route path={RouteForgotPassword} element={<ForgotPassword />} />
          <Route path={RouteResetPassword} element={<ResetPassword />} />
          <Route path={RouteOtpVerification} element={<OtpVerification />} />
          <Route path={RouteVerification} element={<Verification />} />
          <Route path={RouteConfirmVerification} element={<ConfirmVerification />} />

        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App

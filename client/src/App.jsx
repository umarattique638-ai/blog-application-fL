import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Button } from "./components/ui/button"
import { RouteAddCategory, RouteConfirmVerification, RouteDashBoardCategory, RouteEditCategory, RouteForgotPassword, RouteIndex, RouteOtpVerification, RouteResetPassword, RouteSignIn, RouteSignUp, RouteUpdateUserProfile, RouteVerification } from "./helper/RouteName"
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


function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>

          <Route path={RouteIndex} element={<Layout />} >

            <Route index element={<Index />} />
            <Route path="showuser/:id" element={<ShowProfile />} />
            <Route path="updateuser/:id" element={<UpdateProfile />} />
            <Route path={RouteAddCategory} element={<AddCategory />} />
            <Route path={RouteEditCategory()} element={<EditCatigory />} />
            <Route path={RouteDashBoardCategory} element={<DashbardCatigory />} />

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

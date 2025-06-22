import './App.css'
import { Route, Router, Routes } from 'react-router-dom'
import GHSMSCenter from './Component/Page/GHSMSCenter'
import IntroductionPage from './Component/Page/IntroductionPage'
import DNCM from './Component/Page/DNCM'
import NewsPage from './Component/Page/NewsPage'
import Login from './Component/Page/Login'
import ForgotPassword from './Component/Page/ForgotPassword'
import SignUp from './Component/Page/SignUp'
import DatLichKham from './Component/Page/DatLichKham'
import ReproductiveManage from './Component/Page/ReproductiveManage'
import STDsPage from './Component/Page/STDsPage'
import FamilyPlan from './Component/Page/FamilyPlan'
import TestBookingPage from './Component/Page/TestBookingPage'
import { Search } from 'lucide-react'
import SearchPage from './Component/Page/SearchPage'
import { AuthProvider } from './Component/Auth/AuthContext'
import Consulation from './Component/Page/Consulation'
import ProtectedRoute from './Component/ProtectedRoute/ProtectedRoute'
import { Toast } from 'bootstrap'
import { ToastProvider } from './Component/Toast/ToastProvider'
import NewsDetails from './Component/Page/NewsDetails'
import UserProfile from './Component/Page/UserProfile'
import AdminProfile from './Component/Page/AdminProfile'
import UserAppointments from './Component/Page/UserAppointments'
import SucKhoeGioiTinh from './Component/Page/SucKhoeGioiTinh'
import TuVanTienHonNhan from './Component/Page/TuVanTienHonNhan'
import SucKhoeTamLy from './Component/Page/SucKhoeTamLy'
import Blog from './Component/Page/Blog'
import AdminProtectedRoute from './Component/Page/AdminProtectRoute'
import {
  NewsComponent1,
  NewsComponent2,
  NewsComponent3,
  NewsComponent4,
  NewsComponent5,
  NewsComponent6,
} from './Component/Page/ArticlePage';
import ConsultantDashboard from './Component/Page/ConsultantDashboard'
import BlogsPanel from './Component/Page/ConsultantDashboard/BlogsPanel'
function App() {


  return (
    <>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            <Route path="/" element={<GHSMSCenter />} />
            <Route path="/about" element={<IntroductionPage />} />
            <Route path="/dncm" element={<DNCM />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/appointment" element={<DatLichKham />} />
            <Route path="/benh-lay-truyen" element={<STDsPage />} />
            <Route path="/family-plan" element={<FamilyPlan />} />
            <Route path="/news/:slug" element={<NewsDetails />} />
            <Route path="/news/kham-suc-khoe-dinh-ky-phu-nu" element={<NewsComponent3 />} />
            <Route path="/news/cham-soc-suc-khoe-phu-nu" element={<NewsComponent1 />} />
            <Route path="/news/tu-van-suc-khoe-nam-gioi" element={<NewsComponent2 />} />
            <Route path="/news/suc-khoe-tam-ly-gioi-tinh" element={<NewsComponent4 />} />
            <Route path="/news/dinh-duong-suc-khoe-sinh-san" element={<NewsComponent5 />} />
            <Route path="/news/phuong-phap-tranh-thai" element={<NewsComponent6 />} />
            <Route path="/reproductive-manage" element={<ReproductiveManage />} />
            <Route path="/login" element={<Login />} />
            <Route path="forgotpassword" element={<ForgotPassword />} />
            <Route path="signup" element={<SignUp />} />
            <Route path="/test" element={<TestBookingPage />} />
            <Route path="/consultation" element={<Consulation />} />
            <Route path='/profile' element={<UserProfile />} />
            <Route path="/appointments" element={<UserAppointments />} />
            <Route path="/suc-khoe-gioi-tinh" element={<SucKhoeGioiTinh />} />
            <Route path="/tu-van-tien-hon-nhan" element={<TuVanTienHonNhan />} />
            <Route path="/suc-khoe-tam-ly" element={<SucKhoeTamLy />} />
            <Route path="/blog" element={<Blog />} />
            <Route element={<AdminProtectedRoute />}>
              <Route path="/admin-profile" element={<AdminProfile />} />
            </Route>
            <Route element={<ProtectedRoute requiredRole="consultant" />}>
              <Route path="/consultantblog" element={<BlogsPanel />} />
            </Route>
          </Routes>

          <Route
          path="/consultantdashboard"
          element={
            <ProtectedRoute requiredRole="consultant">
              <ConsultantDashboard />
            </ProtectedRoute>
          }
        />
        </ToastProvider>
      </AuthProvider>
    </>
  )
}

export default App

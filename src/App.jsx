
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
import NewsComponent1 from './Component/Page/NewsComponent1'
function App() {

  return (
    <>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<GHSMSCenter />} />
          <Route path="/about" element={<IntroductionPage />} />
          <Route path="/dncm" element={<DNCM />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/appointment" element={<DatLichKham />} />
          <Route path="/sti-management" element={<STDsPage />} />
          <Route path="/family-plan" element={<FamilyPlan />} />
          <Route path="/news/:slug" element={<NewsComponent1 />} />
          <Route path="/reproductive-manage" element={<ReproductiveManage />} />
          <Route path="/login" element={<Login />} />
          <Route path="forgotpassword" element={<ForgotPassword />} />
          <Route path="signup" element={<SignUp />} />
          <Route path="/test" element={<TestBookingPage />} />
          <Route path="/consultation" element={<Consulation />} />
        </Routes>
      </AuthProvider>
    </>
  )
}

export default App

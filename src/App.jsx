import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Route, Router, Routes } from 'react-router-dom'
import GHSMSCenter from './Component/Page/GHSMSCenter'
import IntroductionPage from './Component/Page/IntroductionPage'
import DNCM from './Component/Page/DNCM'
import NewsPage from './Component/Page/NewsPage'
import Login from './Component/Page/Login'
import ForgotPassword from './Component/Page/ForgotPassword'
import SignUp from './Component/Page/SignUp'
function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<GHSMSCenter/>}/>
        <Route path="/about" element={<IntroductionPage/>}/>
        <Route path="/dncm" element={<DNCM/>}/>
        <Route path="/news" element={<NewsPage/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="forgotpassword" element={<ForgotPassword/>}/>
        <Route path="signup" element={<SignUp/>}/>
      </Routes>
    </>
  )
}

export default App

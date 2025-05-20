import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Route, Router, Routes } from 'react-router-dom'
import GHSMSCenter from './Component/Page/GHSMSCenter'
import IntroductionPage from './Component/Page/IntroductionPage'
function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<GHSMSCenter/>}/>
        <Route path="/about" element={<IntroductionPage/>}/>
      </Routes>
    </>
  )
}

export default App

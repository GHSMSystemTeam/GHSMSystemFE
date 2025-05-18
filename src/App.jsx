import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Route, Router, Routes } from 'react-router-dom'
import GHSMSCenter from './Component/Page/GHSMSCenter'

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<GHSMSCenter/>}/>
      </Routes>
    </>
  )
}

export default App

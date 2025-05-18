import React from 'react'


export default function LogoGHSMS() {
    return (
        <div className="flex items-center">
            <div className="w-16 h-12 relative">
                <div className="absolute inset-0">
                    <svg viewBox="0 0 60 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M30 0C13.4 0 0 10.7 0 24s13.4 24 30 24 30-10.7 30-24S46.6 0 30 0z" fill="#f0f4ff" />
                        <path d="M39 12c-5.5 0-10 4.5-10 10s4.5 10 10 10 10-4.5 10-10-4.5-10-10-10zm0 15c-2.8 0-5-2.2-5-5s2.2-5 5-5 5 2.2 5 5-2.2 5-5 5z" fill="#818cf8" />
                        <path d="M21 12c-5.5 0-10 4.5-10 10s4.5 10 10 10 10-4.5 10-10-4.5-10-10-10zm0 15c-2.8 0-5-2.2-5-5s2.2-5 5-5 5 2.2 5 5-2.2 5-5 5z" fill="#c084fc" />
                    </svg>
                </div>
            </div>
            <span className="text-lg font-semibold text-blue-800">GHSMS</span>
        </div>
    )
}

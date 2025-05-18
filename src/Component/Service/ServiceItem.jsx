import React from 'react'

export default function ServiceItem({ icon, text }) {
    return (
        <div className="flex items-center bg-white bg-opacity-80 rounded-full shadow-sm px-4 py-3">
            <div className="mr-3 text-blue-600">
                {icon}
            </div>
            <p className="font-medium text-blue-800">{text}</p>
        </div>
    )
}

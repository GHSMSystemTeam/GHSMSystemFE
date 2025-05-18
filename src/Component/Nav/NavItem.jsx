import React from 'react'

export default function NavItem({ label, active = false, icon = null, onClick = () => { } }) {
    return (
        <button
            className={`flex items-center px-4 py-4 transition-colors duration-200
                ${active 
                    ? 'text-blue-600 border-b-2 border-blue-600 font-semibold' 
                    : 'text-gray-700 hover:text-blue-600'}`}
            onClick={onClick}
        >
            <span>{label}</span>
            {icon && <span className="ml-1.5">{icon}</span>}
        </button>
    )
}

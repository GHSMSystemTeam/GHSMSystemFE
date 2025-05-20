import React from 'react'

export default function NavItem({ label, active = false, icon = null, onClick = () => { } }) {
    return (
        <div className="group">
            <button
                className={`flex items-center px-4 py-4 transition-all duration-300
                ${active
                        ? 'text-blue-600 border-b-2 border-blue-600 font-semibold'
                        : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md'}`}
                onClick={onClick}
            >
                <span>{label}</span>
                {icon && <span className="ml-1.5 transition-transform duration-300 group-hover:rotate-180">{icon}</span>}
            </button>
        </div>
    )
}

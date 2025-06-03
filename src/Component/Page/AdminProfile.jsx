import { useAuth } from "../Auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Bell, User, LogOut, FileText, Users, BarChart2, Settings, HelpCircle, Star } from "lucide-react";

export default function AdminProfile() {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [profileMenu, setProfileMenu] = useState(false);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-purple-100 to-blue-50 flex flex-col">
            {/* Top Navbar */}
            <nav className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3 flex items-center justify-between shadow">
                <div className="flex items-center gap-3">
                    <img src="https://adminlte.io/themes/v3/dist/img/user2-160x160.jpg" alt="Admin" className="w-10 h-10 rounded-full border-2 border-white" />
                    <span className="text-white font-semibold text-lg">Admin User</span>
                    <div className="relative">
                        <button onClick={() => setProfileMenu(v => !v)} className="focus:outline-none">
                            <User className="text-white" />
                        </button>
                        {profileMenu && (
                            <div className="absolute left-0 mt-2 w-56 bg-white rounded-xl shadow-lg z-10 py-2">
                                <button className="flex items-center w-full px-4 py-2 hover:bg-gray-100 text-gray-700"><User className="mr-2" size={18}/>My details</button>
                                <button className="flex items-center w-full px-4 py-2 hover:bg-gray-100 text-gray-700"><FileText className="mr-2" size={18}/>My calendar</button>
                                <button className="flex items-center w-full px-4 py-2 hover:bg-gray-100 text-gray-700"><BarChart2 className="mr-2" size={18}/>Vacations</button>
                                <button className="flex items-center w-full px-4 py-2 hover:bg-gray-100 text-gray-700"><Users className="mr-2" size={18}/>Corporate CV</button>
                                <button className="flex items-center w-full px-4 py-2 hover:bg-gray-100 text-gray-700"><Settings className="mr-2" size={18}/>Performance review</button>
                                <button onClick={handleLogout} className="flex items-center w-full px-4 py-2 hover:bg-gray-100 text-red-600"><LogOut className="mr-2" size={18}/>Đăng xuất</button>
                            </div>
                        )}
                    </div>
                </div>
                <input type="text" placeholder="Quick search" className="rounded-lg px-4 py-2 w-72 focus:ring-2 focus:ring-blue-300" />
                <button className="relative">
                    <Bell className="text-white" size={22} />
                    <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
                </button>
            </nav>

            {/* Main layout */}
            <div className="flex flex-1">
                {/* Sidebar */}
                <aside className="w-64 bg-white shadow-lg pt-8 px-4 hidden md:block">
                    <nav className="flex flex-col gap-1">
                        <button className="flex items-center gap-3 px-4 py-2 rounded-xl font-semibold text-blue-700 bg-blue-100">
                            <BarChart2 size={18} />
                            <span>Dashboard</span>
                        </button>
                        <button className="flex items-center gap-3 px-4 py-2 rounded-xl border-2 border-blue-300 bg-white font-medium text-blue-700 my-1">
                            <Users size={18} />
                            <span>Account Management</span>
                        </button>
                        <button className="flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-blue-50">
                            <User size={18} />
                            <span>Doctors</span>
                        </button>
                        <button className="flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-blue-50">
                            <User size={18} />
                            <span>Medical Staff</span>
                        </button>
                        <button className="flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-blue-50">
                            <User size={18} />
                            <span>Users</span>
                        </button>
                        <button className="flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-blue-50">
                            <FileText size={18} />
                            <span>Reports</span>
                        </button>
                        <button className="flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-blue-50">
                        <Star size={18} /> {/* Changed from Settings to Star */}
                        <span>Feedback</span>
                        </button>
                        <button className="flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-blue-50">
                            <HelpCircle size={18} />
                            <span>Help</span>
                        </button>
                    </nav>
                </aside>

                {/* Dashboard Content */}
                <main className="flex-1 p-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {/* Example widgets */}
                        <div className="bg-white rounded-xl shadow p-6">
                            <div className="text-gray-500">Total Accounts</div>
                            <div className="text-2xl font-bold text-blue-700">1,234</div>
                        </div>
                        <div className="bg-white rounded-xl shadow p-6">
                            <div className="text-gray-500">Doctors</div>
                            <div className="text-2xl font-bold text-blue-700">120</div>
                        </div>
                        <div className="bg-white rounded-xl shadow p-6">
                            <div className="text-gray-500">Feedback</div>
                            <div className="text-2xl font-bold text-blue-700">87</div>
                        </div>
                    </div>
                    {/* Example chart area */}
                    <div className="bg-white rounded-xl shadow p-6 mb-8">
                        <div className="font-semibold mb-2">Gender Distribution</div>
                        {/* Replace with your chart component */}
                        <div className="h-40 flex items-center justify-center text-gray-400">[Chart Here]</div>
                    </div>
                    {/* Example table for account management */}
                    <div className="bg-white rounded-xl shadow p-6">
                        <div className="flex justify-between items-center mb-4">
                            <div className="font-semibold">Account Management</div>
                            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Add Account</button>
                        </div>
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-gray-600 border-b">
                                    <th className="py-2">Email</th>
                                    <th>Username</th>
                                    <th>Phone</th>
                                    <th>Gender</th>
                                    <th>Role</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* Example row */}
                                <tr className="border-b">
                                    <td className="py-2">doctor1@hospital.com</td>
                                    <td>Dr. Smith</td>
                                    <td>0901234567</td>
                                    <td>Male</td>
                                    <td>Doctor</td>
                                    <td>
                                        <button className="text-blue-600 hover:underline mr-2">Edit</button>
                                        <button className="text-red-600 hover:underline">Delete</button>
                                    </td>
                                </tr>
                                {/* More rows... */}
                            </tbody>
                        </table>
                    </div>
                </main>
            </div>
        </div>
    );
}
import { useAuth } from "../Auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Bell, User, LogOut, FileText, Users, BarChart2, Settings, HelpCircle, Star, Briefcase, CalendarDays, ClipboardCheck, Newspaper } from "lucide-react";
import { Search, Users as PeopleIcon } from "lucide-react";

// Placeholder Components
const ServiceManagementComponent = () => {
    return (
        <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold">Service Management</h2>
            <p>Manage services here...</p>
        </div>
    );
};

const BookingManagementComponent = () => {
    return (
        <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold">Booking Management</h2>
            <p>Manage bookings here...</p>
        </div>
    );
};

const PostManagementComponent = () => {
    return (
        <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold">Post Management</h2>
            <p>Manage posts here...</p>
        </div>
    );
};

const TestResultManagementComponent = () => {
    return (
        <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold">Test Result Management</h2>
            <p>Manage test results here...</p>
        </div>
    );
};

const FeedbackManagementComponent = () => {
    return (
        <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold">Feedback Management</h2>
            <p>Manage feedback here...</p>
        </div>
    );
};

const ReportManagementComponent = () => {
    return (
        <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold">Report Management</h2>
            <p>View and generate reports here...</p>
        </div>
    );
};
// New component for the Filter Interface
const FilterInterface = ({ title }) => {
    const [activeTab, setActiveTab] = useState('find'); // 'find' or 'all'

    return (
        <div className="bg-white rounded-xl shadow p-6">
            <div className="flex mb-6 border-b">
                <button
                    onClick={() => setActiveTab('find')}
                    className={`flex items-center gap-2 px-6 py-3 text-sm font-medium rounded-t-lg focus:outline-none ${
                        activeTab === 'find' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                >
                    <Search size={18} />
                    Find {title}
                </button>
                <button
                    onClick={() => setActiveTab('all')}
                    className={`flex items-center gap-2 px-6 py-3 text-sm font-medium rounded-t-lg focus:outline-none ${
                        activeTab === 'all' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                >
                    <PeopleIcon size={18} />
                    All {title}s
                </button>
            </div>

            {activeTab === 'find' && (
                <div>
                    <h2 className="text-xl font-semibold mb-4 text-gray-700">Filter</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                        {/* Left Column */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                            <input type="text" className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" placeholder="Type a name here" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
                            <input type="email" className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" placeholder="example@mail.com" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">ID</label>
                            <input type="text" className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" placeholder="Id" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">User type</label>
                            <select className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
                                <option>Any</option>
                                <option value="consultant">Consultant</option>
                                <option value="customer">Customer</option>
                            </select>                     
                        </div>
                    </div>
                </div>
            )}
             {activeTab === 'all' && (
                <div>
                    <h2 className="text-xl font-semibold mb-4 text-gray-700">All {title}s List</h2>
                    {/* Placeholder for list of all doctors/customers */}
                    <p className="text-gray-500">List of all {title}s will be displayed here.</p>
                        <table className="w-full text-left mt-4">
                            <thead>
                                <tr className="text-gray-600 border-b">
                                    <th className="py-2">Name</th>
                                    <th>Email</th>
                                    <th>Type</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b">
                                    <td className="py-2">Dr. Smith (Example)</td>
                                    <td>consultant1@example.com</td>
                                    <td>Consultant</td>
                                    <td>
                                        <button className="text-blue-600 hover:underline mr-2">View</button>
                                        <button className="text-red-600 hover:underline">Disable</button>
                                    </td>
                                </tr>
                                <tr className="border-b">
                                    <td className="py-2">Nguyen Van A (Example)</td>
                                    <td>customer1@example.com</td>
                                    <td>Customer</td>
                                    <td>
                                        <button className="text-blue-600 hover:underline mr-2">Edit</button>
                                        <button className="text-red-600 hover:underline">Delete</button>
                                    </td>
                                </tr>
                            </tbody> 
                        </table>  
                </div>
            )}
        </div>
    );
};


export default function AdminProfile() {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [profileMenu, setProfileMenu] = useState(false);
    const [activeView, setActiveView] = useState('dashboard');

    const handleLogout = () => {
        logout();
        navigate("/login");
    };
    const renderMainContent = () => {
        switch (activeView) {
            case 'dashboard':
                return (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="bg-white rounded-xl shadow p-6">
                                <div className="text-gray-500">Total Accounts</div>
                                <div className="text-2xl font-bold text-blue-700">1,234</div>
                            </div>
                            <div className="bg-white rounded-xl shadow p-6">
                                <div className="text-gray-500">Consultant</div>
                                <div className="text-2xl font-bold text-blue-700">120</div>
                            </div>
                            <div className="bg-white rounded-xl shadow p-6">
                                <div className="text-gray-500">Feedback</div>
                                <div className="text-2xl font-bold text-blue-700">87</div>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl shadow p-6 mb-8">
                            <div className="font-semibold mb-2">Gender Distribution</div>
                            <div className="h-40 flex items-center justify-center text-gray-400">[Chart Here]</div>
                        </div>
                    </>
                );
                case 'accounts': // Added this case
                return <FilterInterface title="Account" />;
                case 'consultantAccounts':
                    return (
                        <div className="bg-white rounded-xl shadow p-6">
                            <div className="flex justify-between items-center mb-4">
                                <div className="font-semibold">Consultant Management</div>
                                <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Add Consultant</button>
                            </div>
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="text-gray-600 border-b">
                                        <th className="py-2">Email</th>
                                        <th>Name</th>
                                        <th>Phone</th>
                                        <th>Gender</th>
                                        <th>Specialty</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* Example row */}
                                    <tr className="border-b">
                                        <td className="py-2">consultant1@hospital.com</td>
                                        <td>Dr. Smith</td>
                                        <td>0901234567</td>
                                        <td>Male</td>
                                        <td>Psychology</td>
                                        <td>
                                            <button className="text-blue-600 hover:underline mr-2">Edit</button>
                                            <button className="text-red-600 hover:underline">Delete</button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    );
                case 'customerAccounts':
                    return (
                        <div className="bg-white rounded-xl shadow p-6">
                            <div className="flex justify-between items-center mb-4">
                                <div className="font-semibold">Customer Management</div>
                                <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Add Customer</button>
                            </div>
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="text-gray-600 border-b">
                                        <th className="py-2">Email</th>
                                        <th>Name</th>
                                        <th>Phone</th>
                                        <th>Gender</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* Example row */}
                                    <tr className="border-b">
                                        <td className="py-2">customer1@gmail.com</td>
                                        <td>Nguyen Van A</td>
                                        <td>0912345678</td>
                                        <td>Female</td>
                                        <td>
                                            <button className="text-blue-600 hover:underline mr-2">Edit</button>
                                            <button className="text-red-600 hover:underline">Delete</button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    );
            case 'services':
                return <ServiceManagementComponent />;
            case 'bookings':
                return <BookingManagementComponent />;
            case 'posts':
                return <PostManagementComponent />;
            case 'testResults':
                return <TestResultManagementComponent />;
            case 'feedback':
                return <FeedbackManagementComponent />;
            case 'reports':
                return <ReportManagementComponent />;
            case 'help':
                return <div className="bg-white rounded-xl shadow p-6"><h2 className="text-xl font-semibold">Help</h2><p>Help content goes here.</p></div>;
            default:
                return null;
        }
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
                        <button onClick={() => setActiveView('dashboard')}
                         className={`flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-blue-50 ${
                            activeView === 'dashboard' ? 'font-semibold text-blue-700 bg-blue-100' : ''
                            }`}>
                            <BarChart2 size={18} />
                            <span>Dashboard</span>
                        </button>
                        <button onClick={() => setActiveView('accounts')} 
                        className={`flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-blue-50 ${
                            activeView === 'accounts' ? 'font-semibold text-blue-700 bg-blue-100' : ''
                            }`}>
                            <Users size={18} />
                            <span>Accounts</span>
                        </button>
                        <button onClick={() => setActiveView('consultantAccounts')} 
                        className={`flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-blue-50 ${
                            activeView === 'consultantAccounts' ? 'font-semibold text-blue-700 bg-blue-100' : ''
                            }`}>
                            <User size={18} />
                            <span>Consultant</span>
                        </button>
                        <button onClick={() => setActiveView('customerAccounts')} 
                        className={`flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-blue-50 ${
                            activeView === 'customerAccounts' ? 'font-semibold text-blue-700 bg-blue-100' : ''
                            }`}>
                            <User size={18} />
                            <span>Customers</span>
                        </button>
                        <button onClick={() => setActiveView('services')} 
                        className={`flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-blue-50 ${
                            activeView === 'services' ? 'font-semibold text-blue-700 bg-blue-100' : ''
                            }`}>
                            <Briefcase size={18} />
                            <span>Services</span>
                        </button>
                        <button onClick={() => setActiveView('bookings')} 
                        className={`flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-blue-50 ${
                            activeView === 'bookings' ? 'font-semibold text-blue-700 bg-blue-100' : ''
                            }`}>
                            <CalendarDays size={18} />
                            <span>Bookings</span>
                        </button>
                        <button onClick={() => setActiveView('testResults')} 
                        className={`flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-blue-50 ${
                            activeView === 'testResults' ? 'font-semibold text-blue-700 bg-blue-100' : ''
                            }`}>
                            <ClipboardCheck size={18} />
                            <span>Test Results</span>
                        </button>
                        <button onClick={() => setActiveView('posts')} 
                        className={`flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-blue-50 ${
                            activeView === 'posts' ? 'font-semibold text-blue-700 bg-blue-100' : ''
                            }`}>
                            <Newspaper size={18} />
                            <span>Posts</span>
                        </button>
                        <button onClick={() => setActiveView('reports')} 
                        className={`flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-blue-50 ${
                            activeView === 'reports' ? 'font-semibold text-blue-700 bg-blue-100' : ''
                            }`}>
                            <FileText size={18} />
                            <span>Reports</span>
                        </button>
                        <button onClick={() => setActiveView('feedback')} 
                        className={`flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-blue-50${
                            activeView === 'feedback' ? 'font-semibold text-blue-700 bg-blue-100' : ''
                            }`}>
                        <Star size={18} /> 
                        <span>Feedback</span>
                        </button>
                        <button onClick={() => setActiveView('help')} 
                        className={`flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-blue-50${
                            activeView === 'help' ? 'font-semibold text-blue-700 bg-blue-100' : ''
                            }`}>
                            <HelpCircle size={18} />
                            <span>Help</span>
                        </button>
                    </nav>
                </aside>

                {/* Dashboard Content */}
                <main className="flex-1 p-8">
                    {renderMainContent()}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {/* Example widgets */}
                        <div className="bg-white rounded-xl shadow p-6">
                            <div className="text-gray-500">Total Accounts</div>
                            <div className="text-2xl font-bold text-blue-700">1,234</div>
                        </div>
                        <div className="bg-white rounded-xl shadow p-6">
                            <div className="text-gray-500">Consultant</div>
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
                </main>
            </div>
        </div>
    );
}
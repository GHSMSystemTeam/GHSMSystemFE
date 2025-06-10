import { useAuth } from "../Auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Bell, User, LogOut, FileText, Users, BarChart2, Settings, HelpCircle, Star, Briefcase, CalendarDays, ClipboardCheck, Newspaper } from "lucide-react";
import { Search, Users as PeopleIcon } from "lucide-react";

   const sampleBookings = [
        {
            id: 'bk001',
            date: '2025-06-10', // YYYY-MM-DD format for easier comparison
            time: '10:00',
            type: 'Consultation', // 'Consultation' or 'Test'
            patientName: 'Nguyen Van X',
            consultantId: 'c1', // Link to consultantsData
            serviceName: 'Sexual Health Consultation',
            status: 'Scheduled', // e.g., Scheduled, Completed, Cancelled
            notes: 'Follow-up discussion required.'
        },
        {
            id: 'bk002',
            date: '2025-06-10',
            time: '14:00',
            type: 'Test',
            patientName: 'Tran Thi Y',
            consultantId: null, // Tests might not always have a specific consultant assigned initially
            serviceName: 'STD Panel Basic',
            status: 'Scheduled',
            notes: 'Patient requested discretion.'
        },
        {
            id: 'bk003',
            date: '2025-06-18',
            time: '11:30',
            type: 'Consultation',
            patientName: 'Le Van Z',
            consultantId: 'c2',
            serviceName: 'Pre-test Counseling',
            status: 'Completed',
        },
        {
            id: 'bk004',
            date: '2025-07-05', // A booking in the next month
            time: '09:00',
            type: 'Test',
            patientName: 'Pham Thi Q',
            serviceName: 'Advanced Hormone Test',
            status: 'Scheduled',
        }
    ];
const updatedSampleBookings = [
    ...sampleBookings, 
    {
        id: 'bk_test_005',
        date: '2025-06-20',
        time: '09:30',
        type: 'Test',
        patientName: 'Hoang Van E',
        consultantId: null,
        serviceName: 'Basic Blood Panel',
        status: 'Completed',
        notes: 'Routine check-up.'
    },
    {
        id: 'bk_test_006',
        date: '2025-06-22',
        time: '11:00',
        type: 'Test',
        patientName: 'Dang Thi F',
        consultantId: null,
        serviceName: 'Urinalysis',
        status: 'Scheduled', // A test that might not have results yet
        notes: ''
    }
];

const sampleTestResults = [
    {
        id: 'res001',
        serviceAppointmentOrderId: 'bk002', // Links to an existing 'Test' in sampleBookings
        content: 'All markers within normal limits. No abnormalities detected.',
        isActive: true, // True = result is published/active
        resultDate: '2025-06-12',
        recordedBy: 'Dr. Smith (Lab)', // Optional: who recorded the result
    },
    {
        id: 'res002',
        serviceAppointmentOrderId: 'bk_test_005', // Links to the new test booking
        content: 'Slightly elevated cholesterol. Lifestyle adjustment recommended.',
        isActive: true,
        resultDate: '2025-06-22',
        recordedBy: 'LabTech Unit 2',
    },
    {
        id: 'res003',
        serviceAppointmentOrderId: 'bk004', // Links to another existing 'Test'
        content: 'Hormone panel results pending further analysis for specific markers.',
        isActive: false, // False = result is pending or draft
        resultDate: null, // No result date yet if pending
        recordedBy: null,
    }
];



// Sample Dashboard Overview Data
const dashboardOverviewData = {
        totalAccounts: 1234,
        totalConsultants: 120, 
        totalCustomers: 1114,
        totalBookingsThisMonth: 45,
        monthlyRevenue: 78515000, 
        averageServiceRating: 4.5, 
        totalFeedback: 87,
        totalActiveUsers: 1234,
        pendingTestResults: 15, 
        newFeedbackToday: 5,  
    };
    const bookingTrendsData = { // For a bar chart or line chart
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], // Last 7 days
        consultationBookings: [18, 22, 20, 25, 30, 15, 10],
        testBookings: [10, 12, 8, 15, 12, 20, 18],
    };

    const genderDistributionData = { // For a pie chart
        labels: ['Male', 'Female', 'Other'],
        counts: [650, 720, 34], // Number of customers or all users
    };

    const topPerformingConsultants = [
        { id: 'c1', name: "NGUYEN ANH TU", specialty: "Y học Giới tính & Nam học", appointmentsThisMonth: 25, rating: 4.8 },
        { id: 'c2', name: "PHAM MINH NGOC", specialty: "Y học Giới tính & Nam học", appointmentsThisMonth: 22, rating: 4.7 },
        { id: 'c5', name: "NGUYEN QUOC LINH", specialty: "Tư vấn tâm lý", appointmentsThisMonth: 18, rating: 4.9 },
        // ... more consultants
    ];

    const popularServicesData = [
        { id: 'serv001', name: "Comprehensive Sexual Health Check-up", bookingsThisMonth: 55, revenue: 15000000 },
        { id: 'serv002', name: "Relationship Counseling Session", bookingsThisMonth: 40, revenue: 8000000 },
        { id: 'serv003', name: "Advanced STD Panel", bookingsThisMonth: 35, revenue: 10500000 },
        // ... more services
    ];
    // Sample Booking Data    
 
// --- Sample Data for Feedback ---
const sampleFeedback = [
    {
        id: 'fb001',
        customerId: 'cust1', // Links to customersData
        serviceAppointmentOrderId: 'bk001', // Links to a completed/relevant booking in updatedSampleBookings
        title: 'Great Consultation Experience',
        content: 'The consultation with Dr. Tu was very insightful and helpful. He addressed all my concerns with patience and professionalism. The booking process was also very smooth. Highly recommend!',
        createDate: '2025-06-11',
        isPublic: true, // Admin can toggle this
        isActive: true, // Admin can toggle this (e.g., to hide inappropriate feedback)
    },
    {
        id: 'fb002',
        customerId: 'cust2',
        serviceAppointmentOrderId: 'bk003', // Link to another booking
        title: 'Follow-up on Test Results',
        content: 'The pre-test counseling was good, but I am still awaiting a detailed explanation of my test results. The online portal shows them as available but I would appreciate a call.',
        createDate: '2025-06-19',
        isPublic: false,
        isActive: true,
    },
    {
        id: 'fb003',
        customerId: 'cust3',
        serviceAppointmentOrderId: 'bk004', // Link to a test booking
        title: 'Suggestion for Improvement',
        content: 'The clinic environment is very clean and welcoming. However, the waiting time for my scheduled test was a bit longer than expected. Perhaps scheduling could be optimized.',
        createDate: '2025-07-06',
        isPublic: true,
        isActive: true,
    },
    {
        id: 'fb004',
        customerId: 'cust1',
        serviceAppointmentOrderId: 'bk_test_005',
        title: 'Quick and Efficient Testing',
        content: 'The blood panel test was done very quickly and the staff were very professional. Results were also delivered promptly online. Good service.',
        createDate: '2025-06-21',
        isPublic: false, // Example of feedback admin might keep private
        isActive: true,
    }
];
// Sample Consultant Data
const consultantsData = [
    {
        id: 'c1',
        name: "NGUYEN ANH TU",
        email: "nguyen.anh.tu@example.com",
        phone: "0901111111", // Placeholder
        gender: "Nam", // Assuming Male
        specialty: "Y học Giới tính & Nam học",
    },
    {
        id: 'c2',
        name: "PHAM MINH NGOC",
        email: "pham.minh.ngoc@example.com",
        phone: "0902222222", // Placeholder
        gender: "Nữ", // Assuming Female
        specialty: "Y học Giới tính & Nam học",
    },
    {
        id: 'c3',
        name: "HO HUU PHUC",
        email: "ho.huu.phuc@example.com",
        phone: "0903333333", // Placeholder
        gender: "Nam", // Assuming Male
        specialty: "Y học Giới tính & Nam học",
    },
    {
        id: 'c4',
        name: "NGUYEN TRONG HOANG HIEP",
        email: "nguyen.hoang.hiep@example.com",
        phone: "0904444444", // Placeholder
        gender: "Nam", // Assuming Male
        specialty: "Y học Giới tính & Nam học",
    },
    {
        id: 'c5',
        name: "NGUYEN QUOC LINH",
        email: "nguyen.quoc.linh@example.com",
        phone: "0905555555", // Placeholder
        gender: "Nam", // Assuming Male
        specialty: "Tư vấn tâm lý", // Based on description "lĩnh vực tư vấn tâm lý"
    }
];

// Sample Customer Data
const customersData = [
    {
        id: 'cust1',
        name: "Nguyen Van A",
        email: "customer1@example.com",
        phone: "0912345678",
        gender: "Nam",
    },
    {
        id: 'cust2',
        name: "Tran Thi B",
        email: "customer2@example.com",
        phone: "0987654321",
        gender: "Nữ",
    },
    {
        id: 'cust3',
        name: "Le Van C",
        email: "customer3@example.com",
        phone: "0911223344",
        gender: "Nam",
    }
];
// Placeholder Components
const ServiceManagementComponent = () => {
    return (
        <div className="bg-white rounded-xl shadow p-6 mb-8">
            <h2 className="text-xl font-semibold">Service Management</h2>
            <p>Manage services here...</p>
        </div>
    );
};

const BookingManagementComponent = () => {
    const [bookings, setBookings] = useState(sampleBookings); // Use sampleBookings directly or fetch from API
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    // Functions to handle modal operations
    const openAddBookingModal = () => {
        setSelectedBooking(null); // Clear any previously selected booking
        setShowBookingModal(true);
    };

    const openEditBookingModal = (booking) => {
        setSelectedBooking(booking);
        setShowBookingModal(true);
    };
    // Placeholder for saving/updating a booking
    const handleSaveBooking = (bookingData) => {
        if (selectedBooking) {
            // Update existing booking
            setBookings(bookings.map(b => b.id === selectedBooking.id ? { ...b, ...bookingData } : b));
        } else {
            // Add new booking
            const newBooking = { ...bookingData, id: `bk${Date.now()}` }; // Simple ID generation
            setBookings([...bookings, newBooking]);
        }
        setShowBookingModal(false);
    }
    // Placeholder for cancelling/deleting a booking
    const handleCancelBooking = (bookingId) => {
        // Add confirmation logic here if needed
        setBookings(bookings.filter(b => b.id !== bookingId));
    };

    // Helper to format date for display
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
    };

    return (
        <div className="bg-white rounded-xl shadow p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">Booking Management</h2>
                <button
                    onClick={openAddBookingModal}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                    Add New Booking
                </button>
            </div>

            {/* Bookings List Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">Date</th>
                            <th scope="col" className="px-6 py-3">Time</th>
                            <th scope="col" className="px-6 py-3">Patient</th>
                            <th scope="col" className="px-6 py-3">Service</th>
                            <th scope="col" className="px-6 py-3">Type</th>
                            <th scope="col" className="px-6 py-3">Consultant</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                            <th scope="col" className="px-6 py-3">Notes</th>
                            <th scope="col" className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.length > 0 ? bookings.sort((a, b) => new Date(a.date) - new Date(b.date) || a.time.localeCompare(b.time)).map(booking => ( // Sort by date then time
                            <tr key={booking.id} className="bg-white border-b hover:bg-gray-50">
                                <td className="px-6 py-4">{formatDate(booking.date)}</td>
                                <td className="px-6 py-4">{booking.time}</td>
                                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{booking.patientName}</td>
                                <td className="px-6 py-4">{booking.serviceName}</td>
                                <td className="px-6 py-4">{booking.type}</td>
                                <td className="px-6 py-4">{booking.consultantId ? consultantsData.find(c => c.id === booking.consultantId)?.name || 'N/A' : 'N/A'}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                                        booking.status === 'Scheduled' ? 'bg-yellow-200 text-yellow-800' :
                                        booking.status === 'Completed' ? 'bg-green-200 text-green-800' :
                                        'bg-red-200 text-red-800' // Assuming 'Cancelled' or other
                                    }`}>{booking.status}</span>
                                </td>
                                <td className="px-6 py-4 max-w-xs truncate" title={booking.notes}>{booking.notes || '-'}</td>
                                <td className="px-6 py-4 flex items-center gap-2">
                                    <button onClick={() => openEditBookingModal(booking)} className="text-sm text-blue-600 hover:underline">Edit</button>
                                    <button onClick={() => handleCancelBooking(booking.id)} className="text-sm text-red-600 hover:underline">Cancel</button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="9" className="px-6 py-4 text-center text-gray-500">No bookings found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Booking Modal (Add/Edit) */}
            {showBookingModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <h3 className="text-xl font-semibold mb-4">{selectedBooking ? 'Edit Booking' : 'Add New Booking'}</h3>
                        
                        {/* Basic Form Structure - Needs to be built out with state and handlers */}
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            // Collect form data and call handleSaveBooking
                            const formData = { // Example: replace with actual form field values
                                date: e.target.date.value,
                                time: e.target.time.value,
                                patientName: e.target.patientName.value,
                                serviceName: e.target.serviceName.value,
                                type: e.target.type.value,
                                consultantId: e.target.consultantId.value || null,
                                status: e.target.status.value,
                                notes: e.target.notes.value,
                            };
                            handleSaveBooking(formData);
                        }}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                    <input type="date" name="date" id="date" defaultValue={selectedBooking?.date || new Date().toISOString().split('T')[0]} className="border p-2 rounded w-full" required />
                                </div>
                                <div>
                                    <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                                    <input type="time" name="time" id="time" defaultValue={selectedBooking?.time} className="border p-2 rounded w-full" required />
                                </div>
                            </div>
                            <div className="mb-4">
                                <label htmlFor="patientName" className="block text-sm font-medium text-gray-700 mb-1">Patient Name</label>
                                <input type="text" name="patientName" id="patientName" defaultValue={selectedBooking?.patientName} placeholder="Patient Name" className="border p-2 rounded w-full" required />
                            </div>
                             <div className="mb-4">
                                <label htmlFor="serviceName" className="block text-sm font-medium text-gray-700 mb-1">Service Name</label>
                                <input type="text" name="serviceName" id="serviceName" defaultValue={selectedBooking?.serviceName} placeholder="e.g., STD Panel, Consultation" className="border p-2 rounded w-full" required />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                               <div>
                                    <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                    <select name="type" id="type" defaultValue={selectedBooking?.type || 'Consultation'} className="border p-2 rounded w-full">
                                        <option value="Consultation">Consultation</option>
                                        <option value="Test">Test</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="consultantId" className="block text-sm font-medium text-gray-700 mb-1">Consultant</label>
                                    <select name="consultantId" id="consultantId" defaultValue={selectedBooking?.consultantId || ""} className="border p-2 rounded w-full">
                                        <option value="">N/A</option>
                                        {consultantsData.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                </div>
                            </div>
                             <div className="mb-4">
                                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                <select name="status" id="status" defaultValue={selectedBooking?.status || 'Scheduled'} className="border p-2 rounded w-full">
                                    <option value="Scheduled">Scheduled</option>
                                    <option value="Completed">Completed</option>
                                    <option value="Cancelled">Cancelled</option>
                                </select>
                            </div>
                            <div className="mb-4">
                                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                                <textarea name="notes" id="notes" rows="3" defaultValue={selectedBooking?.notes} placeholder="Optional notes" className="border p-2 rounded w-full"></textarea>
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <button type="button" onClick={() => setShowBookingModal(false)} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Save Booking</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

const PostManagementComponent = () => {
    return (
        <div className="bg-white rounded-xl shadow p-6 mb-8">
            <h2 className="text-xl font-semibold">Post Management</h2>
            <p>Manage posts here...</p>
        </div>
    );
};

const TestResultManagementComponent = () => {
    const [testResults, setTestResults] = useState(sampleTestResults);
    const [showResultModal, setShowResultModal] = useState(false);
    const [selectedResult, setSelectedResult] = useState(null);
    const [currentFormData, setCurrentFormData] = useState({});

    // Helper to format date (can be moved to a utility file)
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
    };

    const getBookingDetails = (orderId) => {
        // Use updatedSampleBookings which includes all bookings
        return updatedSampleBookings.find(b => b.id === orderId);
    };

    const openAddResultModal = () => {
        setSelectedResult(null);
        setCurrentFormData({
            serviceAppointmentOrderId: '',
            content: '',
            isActive: true,
            resultDate: new Date().toISOString().split('T')[0],
            recordedBy: 'Admin', // Default recorder
        });
        setShowResultModal(true);
    };

    const openEditResultModal = (result) => {
        setSelectedResult(result);
        setCurrentFormData({ ...result, resultDate: result.resultDate || new Date().toISOString().split('T')[0] });
        setShowResultModal(true);
    };

    const handleFormChange = (e) => {
        const { name, value, type, checked } = e.target;
        setCurrentFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSaveResult = (e) => {
        e.preventDefault();
        if (selectedResult) {
            // Update existing result
            setTestResults(testResults.map(r => r.id === selectedResult.id ? { ...selectedResult, ...currentFormData } : r));
        } else {
            // Add new result
            const newResult = { ...currentFormData, id: `res${Date.now()}` };
            setTestResults([...testResults, newResult]);
        }
        setShowResultModal(false);
    };

    const handleDeleteResult = (resultId) => {
        // Add confirmation logic here
        if (window.confirm('Are you sure you want to delete this test result?')) {
            setTestResults(testResults.filter(r => r.id !== resultId));
        }
    };
    
    // Filter bookings that are of type 'Test' for the dropdown
    const testAppointments = updatedSampleBookings.filter(b => b.type === 'Test');

    return (
        <div className="bg-white rounded-xl shadow p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">Test Result Management</h2>
                <button
                    onClick={openAddResultModal}
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                >
                    Add New Result
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">Patient Name</th>
                            <th scope="col" className="px-6 py-3">Service Name</th>
                            <th scope="col" className="px-6 py-3">Appt. Date</th>
                            <th scope="col" className="px-6 py-3">Result Date</th>
                            <th scope="col" className="px-6 py-3">Content Summary</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                            <th scope="col" className="px-6 py-3">Recorded By</th>
                            <th scope="col" className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {testResults.length > 0 ? testResults.map(result => {
                            const booking = getBookingDetails(result.serviceAppointmentOrderId);
                            return (
                                <tr key={result.id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                        {booking ? booking.patientName : 'N/A'}
                                    </td>
                                    <td className="px-6 py-4">{booking ? booking.serviceName : 'N/A'}</td>
                                    <td className="px-6 py-4">{booking ? formatDate(booking.date) : 'N/A'}</td>
                                    <td className="px-6 py-4">{formatDate(result.resultDate)}</td>
                                    <td className="px-6 py-4 max-w-xs truncate" title={result.content}>
                                        {result.content ? `${result.content.substring(0, 50)}...` : 'Pending'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-0.5 rounded-full text-xs ${
                                            result.isActive ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'
                                        }`}>
                                            {result.isActive ? 'Available' : 'Pending/Draft'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">{result.recordedBy || 'N/A'}</td>
                                    <td className="px-6 py-4 flex items-center gap-2">
                                        <button onClick={() => openEditResultModal(result)} className="text-sm text-blue-600 hover:underline">Edit</button>
                                        <button onClick={() => handleDeleteResult(result.id)} className="text-sm text-red-600 hover:underline">Delete</button>
                                    </td>
                                </tr>
                            );
                        }) : (
                            <tr>
                                <td colSpan="8" className="px-6 py-4 text-center text-gray-500">No test results found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {showResultModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <h3 className="text-xl font-semibold mb-4">{selectedResult ? 'Edit Test Result' : 'Add New Test Result'}</h3>
                        <form onSubmit={handleSaveResult}>
                            <div className="mb-4">
                                <label htmlFor="serviceAppointmentOrderId" className="block text-sm font-medium text-gray-700 mb-1">Test Appointment</label>
                                <select
                                    name="serviceAppointmentOrderId"
                                    id="serviceAppointmentOrderId"
                                    value={currentFormData.serviceAppointmentOrderId}
                                    onChange={handleFormChange}
                                    className="border p-2 rounded w-full"
                                    required
                                >
                                    <option value="">Select Test Appointment</option>
                                    {testAppointments.map(appt => {
                                        // Check if a result already exists for this appointment to avoid duplicates if needed
                                        // const resultExists = testResults.some(r => r.serviceAppointmentOrderId === appt.id && (!selectedResult || r.id !== selectedResult.id));
                                        // if (resultExists && !selectedResult) return null; // Don't show if adding new and result exists

                                        return (
                                            <option key={appt.id} value={appt.id}>
                                                {appt.patientName} - {appt.serviceName} ({formatDate(appt.date)})
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>
                            <div className="mb-4">
                                <label htmlFor="resultDate" className="block text-sm font-medium text-gray-700 mb-1">Result Date</label>
                                <input
                                    type="date"
                                    name="resultDate"
                                    id="resultDate"
                                    value={currentFormData.resultDate || ''}
                                    onChange={handleFormChange}
                                    className="border p-2 rounded w-full"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">Result Content</label>
                                <textarea
                                    name="content"
                                    id="content"
                                    rows="5"
                                    value={currentFormData.content}
                                    onChange={handleFormChange}
                                    placeholder="Enter full test result details here..."
                                    className="border p-2 rounded w-full"
                                    required={currentFormData.isActive} // Content required if result is active
                                ></textarea>
                            </div>
                             <div className="mb-4">
                                <label htmlFor="recordedBy" className="block text-sm font-medium text-gray-700 mb-1">Recorded By</label>
                                <input
                                    type="text"
                                    name="recordedBy"
                                    id="recordedBy"
                                    value={currentFormData.recordedBy}
                                    onChange={handleFormChange}
                                    placeholder="Name or ID of recorder"
                                    className="border p-2 rounded w-full"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="isActive" className="flex items-center text-sm font-medium text-gray-700">
                                    <input
                                        type="checkbox"
                                        name="isActive"
                                        id="isActive"
                                        checked={currentFormData.isActive}
                                        onChange={handleFormChange}
                                        className="mr-2 h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                                    />
                                    Result is Active/Published
                                </label>
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button type="button" onClick={() => setShowResultModal(false)} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                                    {selectedResult ? 'Save Changes' : 'Add Result'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

const FeedbackManagementComponent = () => {
    const [feedbackItems, setFeedbackItems] = useState(sampleFeedback);
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);
    const [selectedFeedback, setSelectedFeedback] = useState(null);

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    };

    const getCustomerName = (customerId) => {
        const customer = customersData.find(c => c.id === customerId);
        return customer ? customer.name : 'Unknown Customer';
    };

    const getAppointmentService = (orderId) => {
        const booking = updatedSampleBookings.find(b => b.id === orderId);
        return booking ? `${booking.serviceName} (${booking.type})` : 'N/A';
    };

    const openViewFeedbackModal = (feedback) => {
        setSelectedFeedback(feedback);
        setShowFeedbackModal(true);
    };

    const toggleFeedbackStatus = (feedbackId, field) => {
        setFeedbackItems(prevItems =>
            prevItems.map(item =>
                item.id === feedbackId ? { ...item, [field]: !item[field] } : item
            )
        );
    };

    return (
        <div className="bg-white rounded-xl shadow p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">Feedback Management</h2>
                {/* Add button for "Add New Feedback" if admin can create feedback, otherwise remove */}
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">Date</th>
                            <th scope="col" className="px-6 py-3">Customer</th>
                            <th scope="col" className="px-6 py-3">Appointment/Service</th>
                            <th scope="col" className="px-6 py-3">Title</th>
                            <th scope="col" className="px-6 py-3">Public</th>
                            <th scope="col" className="px-6 py-3">Active</th>
                            <th scope="col" className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {feedbackItems.length > 0 ? feedbackItems.sort((a,b) => new Date(b.createDate) - new Date(a.createDate)).map(fb => (
                            <tr key={fb.id} className="bg-white border-b hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">{formatDate(fb.createDate)}</td>
                                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                    {getCustomerName(fb.customerId)}
                                </td>
                                <td className="px-6 py-4">{getAppointmentService(fb.serviceAppointmentOrderId)}</td>
                                <td className="px-6 py-4">{fb.title}</td>
                                <td className="px-6 py-4">
                                    <button
                                        onClick={() => toggleFeedbackStatus(fb.id, 'isPublic')}
                                        className={`px-2 py-1 text-xs rounded-full ${
                                            fb.isPublic ? 'bg-blue-200 text-blue-800 hover:bg-blue-300' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                                        }`}
                                    >
                                        {fb.isPublic ? 'Yes' : 'No'}
                                    </button>
                                </td>
                                <td className="px-6 py-4">
                                    <button
                                        onClick={() => toggleFeedbackStatus(fb.id, 'isActive')}
                                        className={`px-2 py-1 text-xs rounded-full ${
                                            fb.isActive ? 'bg-green-200 text-green-800 hover:bg-green-300' : 'bg-red-200 text-red-800 hover:bg-red-300'
                                        }`}
                                    >
                                        {fb.isActive ? 'Active' : 'Inactive'}
                                    </button>
                                </td>
                                <td className="px-6 py-4">
                                    <button
                                        onClick={() => openViewFeedbackModal(fb)}
                                        className="text-sm text-indigo-600 hover:underline"
                                    >
                                        View Details
                                    </button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="7" className="px-6 py-4 text-center text-gray-500">No feedback found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {showFeedbackModal && selectedFeedback && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold">{selectedFeedback.title}</h3>
                            <button onClick={() => setShowFeedbackModal(false)} className="text-gray-500 hover:text-gray-700">&times;</button>
                        </div>
                        <div className="space-y-3 text-sm">
                            <p><strong>Customer:</strong> {getCustomerName(selectedFeedback.customerId)}</p>
                            <p><strong>Appointment:</strong> {getAppointmentService(selectedFeedback.serviceAppointmentOrderId)}</p>
                            <p><strong>Date:</strong> {formatDate(selectedFeedback.createDate)}</p>
                            <p><strong>Public:</strong> {selectedFeedback.isPublic ? 'Yes' : 'No'}</p>
                            <p><strong>Active:</strong> {selectedFeedback.isActive ? 'Yes' : 'No'}</p>
                            <div className="mt-2 pt-2 border-t">
                                <p className="font-semibold">Content:</p>
                                <p className="whitespace-pre-wrap">{selectedFeedback.content}</p>
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => {
                                    toggleFeedbackStatus(selectedFeedback.id, 'isPublic');
                                    // Optionally update selectedFeedback state if modal stays open
                                    setSelectedFeedback(prev => ({...prev, isPublic: !prev.isPublic}));
                                }}
                                className={`px-4 py-2 rounded ${selectedFeedback.isPublic ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
                            >
                                {selectedFeedback.isPublic ? 'Make Private' : 'Make Public'}
                            </button>
                            <button
                                onClick={() => {
                                    toggleFeedbackStatus(selectedFeedback.id, 'isActive');
                                    setSelectedFeedback(prev => ({...prev, isActive: !prev.isActive}));
                                }}
                                className={`px-4 py-2 rounded ${selectedFeedback.isActive ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} text-white`}
                            >
                                {selectedFeedback.isActive ? 'Deactivate' : 'Activate'}
                            </button>
                            <button type="button" onClick={() => setShowFeedbackModal(false)} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const ReportManagementComponent = () => {
    return (
        <div className="bg-white rounded-xl shadow p-6 mb-8">
            <h2 className="text-xl font-semibold">Report Management</h2>
            <p>View and generate reports here...</p>
        </div>
    );
};
// New component for the Filter Interface
const FilterInterface = ({ title }) => {
    const [activeTab, setActiveTab] = useState('find'); // 'find' or 'all'
   // Combine consultant and customer data for the "All Accounts" view
    const allAccountsData = [ // Defined here with lowercase 'a'
        ...consultantsData.map(c => ({ ...c, type: 'Consultant' })),
        ...customersData.map(cust => ({ ...cust, type: 'Customer' }))
    ];
    return (
        <div className="bg-white rounded-xl shadow p-6 mb-8">
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
                                    <th>Gender</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                            {allAccountsData.map((consultant) => (
                                    <tr key={consultant.id} className="border-b">
                                        <td className="py-2">{consultant.email}</td>
                                        <td>{consultant.name}</td>
                                        <td>{consultant.type}</td>
                                        <td>{consultant.gender}</td>
                                        
                                        <td>
                                            <button className="text-blue-600 hover:underline mr-2">Edit</button>
                                            <button className="text-red-600 hover:underline">Delete</button>
                                        </td>
                                    </tr>
                                ))}
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
                        {/* Row 1: Key Metric Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition-shadow">
                                <div className="flex items-center justify-between">
                                    <div className="text-gray-500">Total Active Users</div>
                                    <Users size={24} className="text-blue-500" />
                                </div>
                                <div className="text-3xl font-bold text-blue-700 mt-2">{dashboardOverviewData.totalActiveUsers.toLocaleString()}</div>
                                <div className="text-sm text-green-500 mt-1">+2.5% vs last month</div>
                            </div>
                            <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition-shadow">
                                <div className="flex items-center justify-between">
                                    <div className="text-gray-500">Bookings (This Month)</div>
                                    <CalendarDays size={24} className="text-purple-500" />
                                </div>
                                <div className="text-3xl font-bold text-purple-700 mt-2">{dashboardOverviewData.totalBookingsThisMonth.toLocaleString()}</div>
                                <div className="text-sm text-green-500 mt-1">+5% vs last month</div>
                            </div>
                            <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition-shadow">
                                <div className="flex items-center justify-between">
                                    <div className="text-gray-500">Revenue (This Month)</div>
                                    <BarChart2 size={24} className="text-green-500" />
                                </div>
                                <div className="text-3xl font-bold text-green-700 mt-2">{dashboardOverviewData.monthlyRevenue.toLocaleString()} VND</div>
                                <div className="text-sm text-red-500 mt-1">-1.2% vs last month</div>
                            </div>
                            <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition-shadow">
                                <div className="flex items-center justify-between">
                                    <div className="text-gray-500">Avg. Service Rating</div>
                                    <Star size={24} className="text-yellow-500" />
                                </div>
                                <div className="text-3xl font-bold text-yellow-700 mt-2">{dashboardOverviewData.averageServiceRating}/5</div>
                                <div className="text-sm text-gray-500 mt-1">Based on all services</div>
                            </div>
                        </div>

                        {/* Row 2: Charts */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                            {/* Booking Trends Chart */}
                            <div className="lg:col-span-2 bg-white rounded-xl shadow p-6 hover:shadow-lg transition-shadow">
                                <h3 className="text-lg font-semibold text-gray-700 mb-4">Booking Trends (Last 7 Days)</h3>
                                <div className="h-64 flex items-center justify-center text-gray-400">
                                    {/* Placeholder for Bar Chart (e.g., using Recharts or Chart.js) */}
                                    [Bar Chart: Consultation vs Test Bookings per Day]
                                    <p className="text-sm">(Data: Mon C:{bookingTrendsData.consultationBookings[0]} T:{bookingTrendsData.testBookings[0]}, ...)</p>
                                </div>
                            </div>
                            {/* Gender Distribution Chart */}
                            <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition-shadow">
                                <h3 className="text-lg font-semibold text-gray-700 mb-4">User Gender Distribution</h3>
                                <div className="h-64 flex flex-col items-center justify-center text-gray-400">
                                    {/* Placeholder for Pie Chart */}
                                    [Pie Chart Here]
                                    <ul className="text-sm mt-2">
                                        <li>Male: {genderDistributionData.counts[0]}</li>
                                        <li>Female: {genderDistributionData.counts[1]}</li>
                                        <li>Other: {genderDistributionData.counts[2]}</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Row 3: Tables/Lists - Top Consultants & Popular Services */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                            <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition-shadow">
                                <h3 className="text-lg font-semibold text-gray-700 mb-4">Top Performing Consultants</h3>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left">
                                        <thead className="text-xs text-gray-500 uppercase">
                                            <tr>
                                                <th className="py-2 px-1">Name</th>
                                                <th className="py-2 px-1">Appointments</th>
                                                <th className="py-2 px-1">Rating</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {topPerformingConsultants.slice(0, 3).map(c => ( // Show top 3-5
                                                <tr key={c.id} className="border-b border-gray-200 hover:bg-gray-50">
                                                    <td className="py-2 px-1 font-medium text-gray-800">{c.name}</td>
                                                    <td className="py-2 px-1 text-gray-600">{c.appointmentsThisMonth}</td>
                                                    <td className="py-2 px-1 text-yellow-600 flex items-center"><Star size={14} className="mr-1 fill-current"/>{c.rating}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition-shadow">
                                <h3 className="text-lg font-semibold text-gray-700 mb-4">Most Popular Services</h3>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left">
                                        <thead className="text-xs text-gray-500 uppercase">
                                            <tr>
                                                <th className="py-2 px-1">Service Name</th>
                                                <th className="py-2 px-1">Bookings</th>
                                                <th className="py-2 px-1">Revenue</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {popularServicesData.slice(0, 3).map(s => (
                                                <tr key={s.id} className="border-b border-gray-200 hover:bg-gray-50">
                                                    <td className="py-2 px-1 font-medium text-gray-800">{s.name}</td>
                                                    <td className="py-2 px-1 text-gray-600">{s.bookingsThisMonth}</td>
                                                    <td className="py-2 px-1 text-green-600">{s.revenue.toLocaleString()} VND</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                         {/* Optional: Quick Stats/Alerts */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                             <div className="bg-white rounded-xl shadow p-4 hover:shadow-lg transition-shadow">
                                <div className="flex items-center">
                                    <ClipboardCheck size={20} className="text-orange-500 mr-3"/>
                                    <div>
                                        <div className="text-gray-500 text-sm">Pending Test Results</div>
                                        <div className="text-xl font-semibold text-orange-700">{dashboardOverviewData.pendingTestResults}</div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl shadow p-4 hover:shadow-lg transition-shadow">
                                <div className="flex items-center">
                                    <Bell size={20} className="text-red-500 mr-3"/>
                                    <div>
                                        <div className="text-gray-500 text-sm">New Feedback Today</div>
                                        <div className="text-xl font-semibold text-red-700">{dashboardOverviewData.newFeedbackToday}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                );
                case 'accounts': // Added this case
                return <FilterInterface title="Account" />;
                case 'consultantAccounts':
                    return (
                        <div className="bg-white rounded-xl shadow p-6 mb-8">
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
                                    {consultantsData.map((consultant) => (
                                        <tr key={consultant.id} className="border-b">
                                            <td className="py-2">{consultant.email}</td>
                                            <td>{consultant.name}</td>
                                            <td>{consultant.phone}</td>
                                            <td>{consultant.gender}</td>
                                            <td>{consultant.specialty}</td>
                                            <td>
                                                <button className="text-blue-600 hover:underline mr-2">Edit</button>
                                                <button className="text-red-600 hover:underline">Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    );
                case 'customerAccounts':
                    return (
                        <div className="bg-white rounded-xl shadow p-6 mb-8">
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
                                    {customersData.map((customer) => ( // Map over customersData here
                                        <tr key={customer.id} className="border-b">
                                            <td className="py-2">{customer.email}</td>
                                            <td>{customer.name}</td>
                                            <td>{customer.phone}</td>
                                            <td>{customer.gender}</td>
                                            <td>
                                                <button className="text-blue-600 hover:underline mr-2">Edit</button>
                                                <button className="text-red-600 hover:underline">Delete</button>
                                            </td>
                                        </tr>
                                    ))}
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
                return <div className="bg-white rounded-xl shadow p-6 mb-8"><h2 className="text-xl font-semibold">Help</h2><p>Help content goes here.</p></div>;
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
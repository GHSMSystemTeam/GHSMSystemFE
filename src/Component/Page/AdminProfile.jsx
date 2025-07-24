import { useAuth } from "../Auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Bell, User, LogOut, FileText, Users, BarChart2, Settings, HelpCircle, Star, Briefcase, CalendarDays, ClipboardCheck, Newspaper, HomeIcon, XCircle, CheckCircle2, Video, CreditCard } from "lucide-react";
import { Search, Users as PeopleIcon } from "lucide-react";
import api from '../config/axios';
import { 
    Plus, 
    Edit, 
    Trash2, 
    Eye, 
    Calendar,
    Tag,
    X
} from 'lucide-react';
import { useToast } from '../Toast/ToastProvider';

// Create a new, dedicated component for Consultant Management
const ConsultantManagementComponent = () => {
    const [consultants, setConsultants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingConsultant, setEditingConsultant] = useState(null);
    const [editFormData, setEditFormData] = useState({ phone: '', specialization: '' });
    const SPECIALTIES = {
        "Sexology_Andrology": "Y học Giới tính & Nam học",
        "Psychology": "Tư vấn tâm lý", 
        "Gynecology": "Phụ khoa",
        "Endocrinology": "Nội tiết",
        "Dermatology": "Da liễu",
        "Obstetrics": "Sản khoa",
        "Urology": "Tiết niệu"
    };
    // Function to get Vietnamese display name
    const getVietnameseSpecialization = (englishValue) => {
        return SPECIALTIES[englishValue] || englishValue || 'N/A';
    };
    // Function to get English value from Vietnamese - THÊM FUNCTION NÀY
    const getEnglishSpecialization = (vietnameseValue) => {
        const entry = Object.entries(SPECIALTIES).find(([key, value]) => value === vietnameseValue);
        return entry ? entry[0] : vietnameseValue;
    };
    const toast = useToast();
    const handleToggleActive = async (consultant) => {
        const id = consultant.id;
        const willActivate = !consultant.active;
        try {
            // Optimistic UI update (optional)
            setConsultants(prev =>
                prev.map(c =>
                    c.id === id ? { ...c, active: willActivate } : c
                )
            );

            // Call the correct API
            if (willActivate) {
                await api.put(`/api/active/${id}`);
            } else {
                await api.put(`/api/deactive/${id}`);
            }
            toast.showToast(`Consultant ${consultant.active ? 'deactivated' : 'activated'} successfully!`, 'success');
            // Optionally refetch or confirm update
            // await fetchConsultants();
        } catch (error) {
            // Rollback optimistic update on error
            setConsultants(prev =>
                prev.map(c =>
                    c.id === id ? { ...c, active: !willActivate } : c
                )
            );
            toast.showToast('Failed to update consultant status.', 'error');
        }
    };
    const fetchConsultants = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get('/api/consultants');
            setConsultants(response.data || []);
        } catch (err) {
            setError('Failed to load consultants.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchConsultants();
    }, []);

    const handleOpenEditModal = (consultant) => {
        setEditingConsultant(consultant);
        setEditFormData({
            name: consultant.name || '',
            gender: consultant.gender || 0,
            phone: consultant.phone || '',
            specialization: getVietnameseSpecialization(consultant.specialization) || SPECIALTIES[0]
        });
        setShowEditModal(true);
    };

    const handleUpdateConsultant = async (e) => {
        e.preventDefault();
        if (!editingConsultant) return;
        // Validation
        if (!editFormData.name || editFormData.name.trim() === "") {
            setError("Name is required.");
            return;
        }
        if (!editFormData.specialization || editFormData.specialization.trim() === "") {
        setError("Specialization is required.");
        return;
    }
         const fullPayload = {
            id:              editingConsultant.id,
            name:            editFormData.name.trim(),
            role:            editingConsultant.role,
            admin:           editingConsultant.admin,
            managedUser:     editingConsultant.managedUser,
            email:           editingConsultant.email,
            password:        editingConsultant.password,      
            gender:          parseInt(editFormData.gender),
            phone:           editFormData.phone.trim(),
            createDate:      editingConsultant.createDate,
            birthDate:       editingConsultant.birthDate,
            profilePicture:  editingConsultant.profilePicture,
            bookingHistory:  editingConsultant.bookingHistory,
            totalSpending:   editingConsultant.totalSpending,
            // Convert Vietnamese specialization back to English for storage
            specialization:  getEnglishSpecialization(editFormData.specialization),
            licenseDetails:  editingConsultant.licenseDetails,
            expYear:         editingConsultant.expYear || 0,
            avgRating:       editingConsultant.avgRating || 0,
            description:     editingConsultant.description,
            active:          editingConsultant.active
        };
        try {
            console.log('Sending full payload:', fullPayload);
            await api.put(`/api/user/${editingConsultant.email}`, fullPayload);
            toast.showToast('Consultant updated successfully!', 'success');
            setShowEditModal(false);
            await fetchConsultants(); // Refresh data
        } catch (err) {
            setError('Failed to update consultant. Please try again.');
            console.error('Update error:', err.response || err);
        }
    };    
    const createConsultant = async (consultantData) => {
        try {
            const response = await api.post('/api/createconsultant', consultantData);
            return response.data;
        } catch (error) {
            console.error('Error creating consultant:', error);
            throw error;
        }
    };
    const [showAddModal, setShowAddModal] = useState(false);    
    const [newConsultant, setNewConsultant] = useState({
        name: '',
        email: '',
        password: '',
        gender: 0,
        phone: '',
        specialization: '',
        expYear: ''
    });
    
    const handleAddConsultant = async (e) => {
        e.preventDefault();
        try {
            const consultantData = {
                ...newConsultant,
                specialization: getEnglishSpecialization(newConsultant.specialization)
            };
            const result = await createConsultant(consultantData);
            toast.showToast('Consultant created successfully!', 'success');
            setShowAddModal(false);            
            setNewConsultant({
                name: '',
                email: '',
                password: '',
                gender: 0,
                phone: '',
                specialization: '',
                expYear: ''
            });
            fetchConsultants();
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to create consultant.';
            toast.showToast(errorMessage, 'error');
        }
    }; 
    // Add these state variables to ConsultantManagementComponent
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passwordFormData, setPasswordFormData] = useState({
        email: '',
        newpass: ''
    });

    // Add the password update API function
    const updateUserPassword = async (email, newPassword) => {
        try {
            // Use query parameters instead of request body
            const response = await api.put(`/api/user/changepassword?email=${encodeURIComponent(email)}&newpass=${encodeURIComponent(newPassword)}`);
            return response.data;
        } catch (error) {
            console.error('Error updating password:', error);
            throw error;
        }
    };

    // Add the password update handler
    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        try {
            await updateUserPassword(passwordFormData.email, passwordFormData.newpass);
            toast.showToast('Password updated successfully!', 'success');
            setShowPasswordModal(false);
            setPasswordFormData({ email: '', newpass: '' });
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to update password.';
            toast.showToast(errorMessage, 'error');
        }
    };

    // Add the function to open password modal
    const handleOpenPasswordModal = (consultant) => {
        setPasswordFormData({
            email: consultant.email,
            newpass: ''
        });
        setShowPasswordModal(true);
    };    
    
    return (
        <div className="bg-white rounded-xl shadow p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">Consultant Account Management</h2>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                    </svg>
                    Add Consultant
                </button>
            </div>
            {error && <p className="text-red-500 bg-red-50 p-3 rounded-md mb-4">{error}</p>}
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th className="px-6 py-3">Name</th>
                            <th className="px-6 py-3">Email</th>
                            <th className="px-6 py-3">Phone</th>
                            <th className="px-6 py-3">Gender</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3">Specialization</th>
                            <th className="px-6 py-3 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="5" className="text-center py-4">Loading...</td></tr>
                        ) : consultants.map(consultant => {
                            console.log('Consultant row:', consultant);
                            console.log('Specialization:', consultant.specialization);
                        return (
                            <tr key={consultant.id} className="bg-white border-b hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900">{consultant.name}</td>
                                <td className="px-6 py-4">{consultant.email}</td>
                                <td className="px-6 py-4">{consultant.phone || 'N/A'}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                        consultant.gender === 0 ? 'bg-blue-100 text-blue-800' : 
                                        consultant.gender === 1 ? 'bg-purple-100 text-purple-800' : 
                                        'bg-pink-100 text-pink-800'
                                    }`}>
                                        {consultant.gender === 0 ? 'Male' : 
                                         consultant.gender === 1 ? 'Other' : 'Female'}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs font-semibold
                                            ${consultant.active
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-red-100 text-red-700'}`}
                                    >
                                        {consultant.active ? 'Active' : 'Inactive'}
                                    </span>
                                    <button
                                        onClick={() => handleToggleActive(consultant)}
                                        className={`px-3 py-1 rounded transition-colors duration-200 ml-2
                                            ${consultant.active 
                                                ? ' text-white bg-red-600' 
                                                : ' text-white bg-green-500'}`}
                                    >
                                        {consultant.active ? 'Deactivate' : 'Activate'}
                                    </button>
                                </td>
                                <td className="px-6 py-4">
                                    {/* Display Vietnamese specialization */}
                                    {getVietnameseSpecialization(consultant.specialization)}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex gap-3 items-center">
                                        <button onClick={() => handleOpenEditModal(consultant)} className="text-blue-600 hover:underline">
                                            Edit
                                        </button>
                                        <button 
                                            onClick={() => handleOpenPasswordModal(consultant)} 
                                            className="text-purple-600 hover:underline text-sm"
                                        >
                                            Change Password
                                        </button>  
                                    </div>                                  
                                </td>
                            </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {showEditModal && editingConsultant && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
                        <h3 className="text-xl font-semibold mb-4">Edit Consultant: {editingConsultant.name}</h3>
                        <form onSubmit={handleUpdateConsultant}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                                <input
                                    type="text"
                                    value={editFormData.name}
                                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    placeholder="Enter full name"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                <input
                                    type="tel"
                                    value={editFormData.phone}
                                    onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
                                <select
                                    value={editFormData.gender}
                                    onChange={(e) => setEditFormData({ ...editFormData, gender: parseInt(e.target.value) })}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    required
                                >
                                    <option value={0}>Male</option>
                                    <option value={2}>Female</option>
                                    <option value={1}>Other</option>
                                </select>
                            </div>
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
                                <select
                                    value={editFormData.specialization}
                                    onChange={(e) => setEditFormData({ ...editFormData, specialization: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    required
                                >
                                    <option value="" disabled>Select a specialty</option>
                                    {/* Show Vietnamese options */}
                                    {Object.values(SPECIALTIES).map(vietnameseSpec => (
                                        <option key={vietnameseSpec} value={vietnameseSpec}>
                                            {vietnameseSpec}
                                        </option>
                                    ))}
                                </select>
                            </div>                           
                            <div className="flex justify-end gap-4">
                                <button type="button" onClick={() => setShowEditModal(false)} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {/* Password Update Modal */}
            {showPasswordModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
                        <h3 className="text-xl font-semibold mb-4">Change Password</h3>
                        <form onSubmit={handlePasswordUpdate}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    value={passwordFormData.email}
                                    className="w-full p-2 border border-gray-300 rounded-md bg-gray-100"
                                    disabled
                                />
                            </div>
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-1">New Password *</label>
                                <input
                                    type="password"
                                    value={passwordFormData.newpass}
                                    onChange={(e) => setPasswordFormData({ ...passwordFormData, newpass: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    placeholder="Enter new password"
                                    required
                                    minLength="6"
                                />
                            </div>
                            <div className="flex justify-end gap-4">
                                <button 
                                    type="button" 
                                    onClick={() => setShowPasswordModal(false)} 
                                    className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                                >
                                    Update Password
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
                        <h3 className="text-xl font-semibold mb-4">Add New Consultant</h3>
                        <form onSubmit={handleAddConsultant}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                                <input
                                    type="text"
                                    value={newConsultant.name}
                                    onChange={(e) => setNewConsultant({ ...newConsultant, name: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                                <input
                                    type="email"
                                    value={newConsultant.email}
                                    onChange={(e) => setNewConsultant({ ...newConsultant, email: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                                <input
                                    type="password"
                                    value={newConsultant.password}
                                    onChange={(e) => setNewConsultant({ ...newConsultant, password: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
                                <select
                                    value={newConsultant.gender}
                                    onChange={(e) => setNewConsultant({ ...newConsultant, gender: parseInt(e.target.value) })}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    required
                                >
                                    <option value={0}>Female</option>
                                    <option value={1}>Male</option>
                                    <option value={2}>Other</option>
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                                <input
                                    type="tel"
                                    value={newConsultant.phone}
                                    onChange={(e) => setNewConsultant({ ...newConsultant, phone: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Specialization *</label>
                                <select
                                    value={newConsultant.specialization}
                                    onChange={(e) => setNewConsultant({ ...newConsultant, specialization: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    required
                                >
                                    <option value="" disabled>Select a specialty</option>
                                    {/* Show Vietnamese options */}
                                    {Object.values(SPECIALTIES).map(vietnameseSpec => (
                                        <option key={vietnameseSpec} value={vietnameseSpec}>
                                            {vietnameseSpec}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Experience Years *</label>
                                <input
                                    type="number"
                                    value={newConsultant.expYear}
                                    onChange={(e) => setNewConsultant({ ...newConsultant, expYear: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    min="0"
                                    required
                                />
                            </div>
                            <div className="flex justify-end gap-4">
                                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Create Consultant</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
const CustomerManagementComponent = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const toast = useToast();
  const fetchCustomers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/api/customers");
      setCustomers(response.data || []);
    } catch (err) {
      setError("Failed to load customers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleToggleActive = async (customer) => {
    try {
      const url = customer.active
        ? `/api/deactive/${customer.id}`
        : `/api/active/${customer.id}`;
      await api.put(url);
      toast.showToast(`Customer ${customer.active ? 'deactivated' : 'activated'} successfully!`, 'success');
      fetchCustomers();
    } catch (err) {
      toast.showToast('Failed to update customer status.', 'error');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-6 mb-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Customer Account Management
      </h2>
      {error && (
        <p className="text-red-500 bg-red-50 p-3 rounded-md mb-4">{error}</p>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Phone</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="text-center py-4">
                  Loading...
                </td>
              </tr>
            ) : (
              customers.map((customer) => (
                <tr key={customer.id} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{customer.name}</td>
                  <td className="px-6 py-4">{customer.email}</td>
                  <td className="px-6 py-4">{customer.phone || "N/A"}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${customer.active ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600"}`}>
                      {customer.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleToggleActive(customer)}
                                        className={`px-3 py-1 rounded transition-colors duration-200 ml-2
                                            ${customer.active 
                                                ? ' text-white bg-red-600' 
                                                : ' text-white bg-green-500'}`}
                                    >
                                        {customer.active ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
const StaffManagementComponent = () => {
    const [staffList, setStaffList] = useState([]);
    const [loading, setLoading] = useState(false);
    const createStaff = async (staffData) => {
        try {
            const response = await api.post('/api/createStaff', staffData);
            return response.data;
        } catch (error) {
            throw error;
        }
    };
    const fetchStaffList = async () => {
        setLoading(true);
        try {
            const res = await api.get('/api/user/staff'); // Đổi endpoint đúng với backend của bạn
            setStaffList(res.data || []);
        } catch (err) {
            setStaffList([]);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchStaffList();
    }, []);
    // Thêm modal và form tạo staff mới
    const [showAddStaffModal, setShowAddStaffModal] = useState(false);
    const [newStaff, setNewStaff] = useState({
        name: '',
        email: '',
        password: '',
        gender: 0,
        phone: '',
        specialization: '',
        expYear: ''
    });
    const [addStaffError, setAddStaffError] = useState('');
    const { showToast } = useToast();

    const handleAddStaff = async (e) => {
        e.preventDefault();
        setAddStaffError('');
        // Validation
        if (!newStaff.name || !newStaff.email || !newStaff.password) {
            setAddStaffError('Vui lòng nhập đầy đủ thông tin bắt buộc.');
            return;
        }
        try {
            await createStaff(newStaff);
            showToast('Tạo tài khoản staff thành công!', 'success');
            setShowAddStaffModal(false);
            setNewStaff({
                name: '',
                email: '',
                password: '',
                gender: 0,
                phone: '',
                specialization: null,
                expYear: 0
            });
            // Gọi lại fetch staff list nếu có
            fetchStaffList();
        } catch (err) {
            const msg = err.response?.data?.message || 'Tạo tài khoản staff thất bại!';
            setAddStaffError(msg);
            showToast(msg, 'error');
        }
    };
    return (
        <div className="bg-white rounded-xl shadow p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">Staff Account Management</h2>
                <button
                    onClick={() => setShowAddStaffModal(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                    Thêm Staff
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th className="px-6 py-3">Name</th>
                            <th className="px-6 py-3">Email</th>
                            <th className="px-6 py-3">Phone</th>
                            <th className="px-6 py-3">Gender</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="6" className="text-center py-4">Loading...</td>
                            </tr>
                        ) : staffList.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="text-center py-4">No staff found.</td>
                            </tr>
                        ) : (
                            staffList.map(staff => (
                                <tr key={staff.id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4">{staff.name}</td>
                                    <td className="px-6 py-4">{staff.email}</td>
                                    <td className="px-6 py-4">{staff.phone}</td>
                                    <td className="px-6 py-4">{staff.gender === 0 ? 'Nam' : staff.gender === 2 ? 'Nữ' : 'Khác'}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {showAddStaffModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
                        <h3 className="text-xl font-semibold mb-4">Tạo tài khoản Staff mới</h3>
                        <form onSubmit={handleAddStaff}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Tên *</label>
                                <input
                                    type="text"
                                    value={newStaff.name}
                                    onChange={e => setNewStaff({ ...newStaff, name: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Email *</label>
                                <input
                                    type="email"
                                    value={newStaff.email}
                                    onChange={e => setNewStaff({ ...newStaff, email: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Mật khẩu *</label>
                                <input
                                    type="password"
                                    value={newStaff.password}
                                    onChange={e => setNewStaff({ ...newStaff, password: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Giới tính</label>
                                <select
                                    value={newStaff.gender}
                                    onChange={e => setNewStaff({ ...newStaff, gender: parseInt(e.target.value) })}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                >
                                    <option value={0}>Nam</option>
                                    <option value={2}>Nữ</option>
                                    <option value={1}>Khác</option>
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Số điện thoại</label>
                                <input
                                    type="tel"
                                    value={newStaff.phone}
                                    onChange={e => setNewStaff({ ...newStaff, phone: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded-md"
                                />
                            </div>
                            {addStaffError && <div className="text-red-600 mb-2">{addStaffError}</div>}
                            <div className="flex justify-end gap-4">
                                <button type="button" onClick={() => setShowAddStaffModal(false)} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">Hủy</button>
                                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Tạo Staff</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
    </div>
    );
};
// Get all service types
export const getServiceTypes = async () => {
    const response = await api.get('/api/servicetypes');
    return response.data;
};

// Add a new service type
export const addServiceType = async (serviceType) => {
    const response = await api.post('/api/servicetypes', serviceType);
    return response.data;
};
// Update an existing service type
export const updateServiceType = async (id, serviceType) => {
    const response = await api.put(`/api/servicetypes/id/${id}`, serviceType);
    return response.data;
};

const ServiceManagementComponent = () => {
    const [serviceTypes, setServiceTypes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({
        name: '',
        description: '',
        price: '',
        active: true,
        type: 'Consulting',
    });
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { showToast } = useToast();
    const [success, setSuccess] = useState('');
    // Fetch service types on mount
    useEffect(() => {
        fetchServiceTypes();
    }, []);

    const fetchServiceTypes = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await getServiceTypes();
            setServiceTypes(data);
        } catch (err) {
            setError('Failed to load service types');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenAddModal = () => {
        setForm({
            id: null,
            name: '',
            description: '',
            price: '',
            active: true,
            type: 'Consulting',
        });
        setShowModal(true);
    };

    const handleOpenEditModal = (service) => {
        console.log('Service data:', service);
        setForm({
            id: service.id,
            name: service.name,
            description: service.description,
            price: service.price,
            active: service.active,
            type: service.typeCode === 0 ? 'Consulting' : 'Testing',
        });
        setShowModal(true);
    };

    const handleSaveService = async (e) => {
        e.preventDefault();
        if (isSubmitting) {
            return;
        }
        if (!form.name || !form.description || !form.price) {
            showToast('Vui lòng điền đầy đủ các trường bắt buộc.', 'error');
            return;
        }

        const payload = {
            id: form.id,
            name: form.name,
            description: form.description,
            price: Number(form.price),
            active: form.active,
            typeCode: form.type === 'Consulting' ? 0 : 1,
        };
        // Chỉ thêm id nếu đang update
        if (form.id) {
            payload.id = form.id;
        }
        console.log('Payload being sent:', payload); // Debug log

        setIsSubmitting(true);
        setLoading(true);
        try {
            if (form.id) {
                await updateServiceType(form.id, payload);
                showToast('Cập nhật dịch vụ thành công!', 'success');
            } else {
                const { id, ...addPayload } = payload;
                await addServiceType(addPayload);
                showToast('Thêm dịch vụ mới thành công!', 'success');
            }
            setShowModal(false);
            fetchServiceTypes();
        } catch (err) {
            console.error('Error saving service type:', err);
            const errorMessage = err.response?.data?.title || 'Lưu dịch vụ thất bại.';
            showToast(errorMessage, 'error');
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="bg-white rounded-xl shadow p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Service Type Management</h2>
                <button
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    onClick={handleOpenAddModal}
                >
                    Add Service Type
                </button>
            </div>
            {error && <div className="text-red-600 mb-2">{error}</div>}
            {success && <div className="text-green-600 mb-2">{success}</div>}
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="text-gray-600 border-b">
                            <th className="py-2">Name</th>
                            <th>Description</th>
                            <th>Price</th>
                            <th>Active</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={4} className="py-4 text-center">Loading...</td>
                            </tr>
                        ) : serviceTypes.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="py-4 text-center text-gray-400">No service types found.</td>
                            </tr>
                        ) : (
                            serviceTypes.map((type, idx) => (
                                <tr key={idx} className="border-b">
                                    <td className="py-2">{type.name}</td>
                                    <td>{type.description}</td>
                                    <td>{type.price}</td>
                                    <td>
                                        <span className={`px-2 py-1 rounded-full text-xs ${type.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {type.active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="py-2">
                                        <button
                                            onClick={() => handleOpenEditModal(type)}
                                            className="text-blue-600 hover:underline font-medium"
                                        >
                                            Edit
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Add / edit Service Type Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                    <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
                        <button
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl"
                            onClick={() => setShowModal(false)}
                            aria-label="Close"
                        >
                            &times;
                        </button>
                        <h3 className="text-lg font-semibold mb-6">Cập nhật loại dịch vụ</h3>
                        <form onSubmit={handleSaveService} className="space-y-4">
                            <div>
                                <label className="block mb-1 font-medium">Loại dịch vụ *</label>
                                    <select
                                        name="type"
                                        value={form.type}
                                        onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                        required
                                    >
                                        <option value="Consulting">Tư vấn</option>
                                        <option value="Testing">Xét nghiệm</option>
                                    </select>
                                </div>
                            <div>
                                <label className="block mb-1 font-medium">Tên dịch vụ *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={form.name || ''}
                                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                    className="border rounded px-3 py-2 w-full"
                                    placeholder="Ví dụ: Tư vấn tâm lý chuyên sâu, Xét nghiệm STI..."
                                    required
                                />
                            </div>
                            <div>
                                <label className="block mb-1 font-medium">Mô tả *</label>
                                <input
                                    type="text"
                                    className="border rounded px-3 py-2 w-full"
                                    value={form.description}
                                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block mb-1 font-medium">Giá *</label>
                                <input
                                    type="number"
                                    className="border rounded px-3 py-2 w-full"
                                    value={form.price}
                                    onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                                    required
                                    min={0}
                                />
                            </div>
                            <div>
                                <label className="block mb-1 font-medium">Trạng thái</label>
                                <select
                                    className="border rounded px-3 py-2 w-full"
                                    value={form.active ? 'true' : 'false'}
                                    onChange={e => setForm(f => ({ ...f, active: e.target.value === 'true' }))}
                                >
                                    <option value="true">Hoạt động</option>
                                    <option value="false">Không hoạt động</option>
                                </select>
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 mr-2"
                                    onClick={() => setShowModal(false)}
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium transition-colors"
                                >
                                    {form.id ? 'Cập nhật' : 'Thêm'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

const BookingManagementComponent = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { showToast } = useToast();
    
    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const response = await api.get('/api/servicebookings');
            setBookings(response.data || []);
        } catch (err) {
            setBookings([]);
        } finally {
            setLoading(false);
        }
    };
    const getSlotTimeRange = (slot) => {
        switch (slot) {
            case 1: return "07:00 - 09:00";
            case 2: return "09:00 - 11:00";
            case 3: return "11:00 - 13:00";
            case 4: return "13:00 - 15:00";
            case 5: return "15:00 - 17:00";
            default: return "N/A";
        }
    };
    const slotOptions = [
        { value: 1, label: "07:00 - 09:00" },
        { value: 2, label: "09:00 - 11:00" },
        { value: 3, label: "11:00 - 13:00" },
        { value: 4, label: "13:00 - 15:00" },
        { value: 5, label: "15:00 - 17:00" },
    ];
    const statusOptions = [
        { value: 0, label: "Chờ xác nhận" },
        { value: 1, label: "Xác nhận" },
        { value: 2, label: "Hoàn thành" },
        { value: 3, label: "Hủy" },
    ];

    // Placeholder for saving/updating a booking
    const handleUpdateBooking = async (e) => {
        e.preventDefault();
        if (!selectedBooking) return;

        setIsSubmitting(true);
        try {
            // Gọi API cập nhật slot
            await api.put(`/api/booking/slot/${selectedBooking.id}`, selectedBooking.slot);
            
            // Gọi API cập nhật status
            await api.put(`/api/servicebooking/status/${selectedBooking.id}/${selectedBooking.status}`);
            
            showToast('Cập nhật booking thành công!', 'success');
            setShowBookingModal(false);
            await fetchBookings(); // Tải lại danh sách
        } catch (err) {
            showToast('Cập nhật thất bại. Vui lòng thử lại.', 'error');
            console.error("Update error:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">Booking Management</h2>
            </div>

            {/* Bookings List Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <div className="max-h-[600px] overflow-y-auto">
                        <table className="w-full text-sm text-left text-gray-500">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Date</th>
                                    <th scope="col" className="px-6 py-3">Time Slot</th>
                                    <th scope="col" className="px-6 py-3">Patient</th>
                                    <th scope="col" className="px-6 py-3">Service Type</th>
                                    <th scope="col" className="px-6 py-3">Consultant</th>
                                    <th scope="col" className="px-6 py-3">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan={7} className="py-4 text-center">Loading...</td>
                                    </tr>
                                ) : bookings.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="py-4 text-center text-gray-400">No bookings found.</td>
                                    </tr>
                                ) : (
                                    bookings.map((booking) => (
                                        <tr key={booking.id} className="bg-white border-b hover:bg-gray-50">
                                            <td className="px-6 py-4">{booking.appointmentDate ? new Date(booking.appointmentDate).toLocaleDateString() : ''}</td>
                                            <td className="px-6 py-4">{getSlotTimeRange(booking.slot)}</td>
                                            <td className="px-6 py-4">{booking.customerId?.name || booking.customerId?.email || 'N/A'}</td>
                                            <td className="px-6 py-4">{booking.serviceTypeId?.name || 'N/A'}</td>
                                            <td className="px-6 py-4">{booking.consultantId?.name || 'N/A'}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-0.5 rounded-full text-xs ${
                                                    booking.status === 0 ? 'bg-yellow-200 text-yellow-800' :
                                                    booking.status === 1 ? 'bg-green-200 text-green-800' :
                                                    booking.status === 2 ? 'bg-blue-200 text-blue-800' :
                                                    'bg-red-200 text-red-800'
                                                }`}>
                                                    {booking.status === 0
                                                        ? 'Chờ xác nhận'
                                                        : booking.status === 1
                                                        ? 'Xác nhận'
                                                        : booking.status === 2
                                                        ? 'Hoàn thành'
                                                        : 'Hủy'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/*Edit Booking Modal */}
            {showBookingModal && selectedBooking && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <h3 className="text-xl font-semibold mb-4">Edit Booking</h3>  
                        {/* Basic Form Structure - Needs to be built out with state and handlers */}
                        <form onSubmit={handleUpdateBooking}>
                            {/* Display booking info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Patient</label>
                                    <p className="text-gray-900 font-medium">{selectedBooking.customerId?.name || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Service</label>
                                    <p className="text-gray-900 font-medium">{selectedBooking.serviceTypeId?.name || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                    <p className="text-gray-900 font-medium">{selectedBooking.appointmentDate ? new Date(selectedBooking.appointmentDate).toLocaleDateString() : 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Consultant</label>
                                    <p className="text-gray-900 font-medium">{selectedBooking.consultantId?.name || 'N/A'}</p>
                                </div>
                            </div>

                            {/* Editable fields */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label htmlFor="slot" className="block text-sm font-medium text-gray-700 mb-1">Time Slot *</label>
                                    <select
                                        name="slot"
                                        id="slot"
                                        value={selectedBooking.slot || 1}
                                        onChange={(e) => setSelectedBooking({...selectedBooking, slot: parseInt(e.target.value)})}
                                        className="border p-2 rounded w-full"
                                        required
                                    >
                                        {slotOptions.map(opt => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
                                    <select
                                        name="status"
                                        id="status"
                                        value={selectedBooking.status ?? 0}
                                        onChange={(e) => setSelectedBooking({...selectedBooking, status: parseInt(e.target.value)})}
                                        className="border p-2 rounded w-full"
                                        required
                                    >
                                        {statusOptions.map(opt => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <button 
                                    type="button" 
                                    onClick={() => setShowBookingModal(false)} 
                                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Updating...' : 'Update Booking'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

const PostManagementComponent = () => {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [consultants, setConsultants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [consultantFilter, setConsultantFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const { showToast } = useToast();

  // API functions
  const fetchPosts = async () => {
    setLoading(true);
    try {
      const [postRes, catRes, consRes] = await Promise.all([
        api.get('/api/health-post'),
        api.get('/api/post-category/active'),
        api.get('/api/consultants'),
      ]);
      setPosts(postRes.data || []);
      setCategories(catRes.data || []);
      setConsultants(consRes.data || []);
    } catch {
      setPosts([]);
      setCategories([]);
      setConsultants([]);
    } finally {
      setLoading(false);
    }
  };

    const handleActivate = async (id) => {
        try {
            await api.put(`/api/health-post/activate/id/${id}`);
            showToast("Đã kích hoạt bài viết!", "success");
            // Cập nhật ngay trên UI
            setPosts(prev =>
            prev.map(post =>
                post.id === id ? { ...post, active: true } : post
            )
            );
            fetchPosts(); // Có thể bỏ gọi lại nếu muốn tối ưu tốc độ
        } catch (e) {
            showToast("Kích hoạt bài viết thất bại!", "error");
        }
    };
    const handleDeactivate = async (id) => {
    try {
        await api.put(`/api/health-post/deactivate/id/${id}`);
        showToast("Đã vô hiệu hóa bài viết!", "success");
        // Cập nhật ngay trên UI
        setPosts(prev =>
        prev.map(post =>
            post.id === id ? { ...post, active: false } : post
        )
        );
        fetchPosts(); // Có thể bỏ gọi lại nếu muốn tối ưu tốc độ
    } catch {
        showToast("Vô hiệu hóa bài viết thất bại!", "error");
    }
    };
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa bài viết này?")) return;
    try {
      await api.delete(`/api/health-post/id/${id}`);
      showToast("Đã xóa bài viết!", "success");
      fetchPosts();
    } catch {
      showToast("Xóa bài viết thất bại!", "error");
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Filtered posts
  const filteredPosts = posts.filter(post => {
    const matchesSearch = search === '' || post.title?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !categoryFilter || post.categoryId?.id === categoryFilter;
    const matchesConsultant = !consultantFilter || post.consultantId?.id === consultantFilter;
    const matchesStatus =
      !statusFilter ||
      (statusFilter === "active" && post.active) ||
      (statusFilter === "inactive" && !post.active);
    return matchesSearch && matchesCategory && matchesConsultant && matchesStatus;
  });

  return (
    <div className="bg-white rounded-xl shadow p-6 mb-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-1">Quản lý bài viết</h2>
          <p className="text-gray-500 text-sm">Quản lý tất cả bài viết từ các chuyên gia tư vấn</p>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-2 mb-4">
        <input
          type="text"
          placeholder="Tìm kiếm bài viết..."
          className="border rounded px-3 py-2 w-full md:w-64"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select
          className="border rounded px-3 py-2"
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
        >
          <option value="">Tất cả danh mục</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.id}</option>
          ))}
        </select>
        <select
          className="border rounded px-3 py-2"
          value={consultantFilter}
          onChange={e => setConsultantFilter(e.target.value)}
        >
          <option value="">Tất cả chuyên gia</option>
          {consultants.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <select
          className="border rounded px-3 py-2"
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
        >
          <option value="">Tất cả trạng thái</option>
          <option value="active">Hoạt động</option>
          <option value="inactive">Không hoạt động</option>
        </select>
      </div>
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 font-semibold text-gray-700">BÀI VIẾT</th>
              <th className="font-semibold text-gray-700">DANH MỤC</th>
              <th className="font-semibold text-gray-700">CHUYÊN GIA</th>
              <th className="font-semibold text-gray-700">TRẠNG THÁI</th>
              <th className="font-semibold text-gray-700">THAO TÁC</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="text-center py-6">Đang tải...</td></tr>
            ) : filteredPosts.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-6 text-gray-400">Không có bài viết.</td></tr>
            ) : filteredPosts.map(post => (
              <tr key={post.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="font-semibold text-blue-900">{post.title}</div>
                  <div className="text-xs text-gray-500 line-clamp-2">{post.content?.slice(0, 80)}...</div>
                </td>
                <td>
                  <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                    {post.categoryId?.id}
                  </span>
                </td>
                <td>
                  <span className="font-medium">{post.consultantId?.name || 'N/A'}</span>
                </td>
                <td>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${post.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {post.active ? 'Đang hoạt động' : 'Đã vô hiệu hóa'}
                  </span>
                </td>
                <td>
                  <div className="flex gap-2">
                    <button
                      className="text-blue-600 hover:underline flex items-center gap-1"
                      title="Xem chi tiết"
                    >
                      <Eye size={16} /> Xem
                    </button>
                    {post.active ? (
                      <button
                        className="flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                        onClick={() => handleDeactivate(post.id)}
                        title="Vô hiệu hóa"
                      >
                        <XCircle size={16} /> Vô hiệu hóa
                      </button>
                    ) : (
                      <button
                        className="flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold bg-green-100 text-green-700 hover:bg-green-200"
                        onClick={() => handleActivate(post.id)}
                        title="Kích hoạt"
                      >
                        <CheckCircle2 size={16} /> Kích hoạt
                      </button>
                    )}
                    <button
                      className="flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold bg-red-100 text-red-700 hover:bg-red-200"
                      onClick={() => handleDelete(post.id)}
                      title="Xóa bài viết"
                    >
                      <Trash2 size={16} /> Xóa
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="text-sm text-gray-500 mt-2">
        {filteredPosts.length === 0
          ? 'Không có bài viết phù hợp.'
          : `Hiển thị ${filteredPosts.length} bài viết`}
      </div>
    </div>
  );
};

const TestResultManagementComponent = () => {
    const [allCustomers, setAllCustomers] = useState([]);
    const [testResults, setTestResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCustomerId, setSelectedCustomerId] = useState('');
    const [customers, setCustomers] = useState([]);
    const [showResultModal, setShowResultModal] = useState(false);
    const [selectedResult, setSelectedResult] = useState(null);

    // Lấy danh sách tất cả customer
    useEffect(() => {
        const fetchAllData = async () => {
            setLoading(true);
            try {
                // Lấy tất cả customers
                const customersRes = await api.get('/api/customers');
                const customers = customersRes.data || [];
                setAllCustomers(customers);

                // Lấy tất cả kết quả xét nghiệm cho từng customer
                const allResults = [];
                for (const customer of customers) {
                    try {
                        const resultsRes = await api.get(`/api/result/customer/${customer.id}`);
                        const customerResults = resultsRes.data || [];
                        
                        if (customerResults.length > 0) {
                            // Customer có kết quả
                            allResults.push(...customerResults);
                        } else {
                            // Customer chưa có kết quả - tạo entry giả để hiển thị
                            allResults.push({
                                id: `no-result-${customer.id}`,
                                customerId: customer,
                                serviceBookingId: null,
                                content: null,
                                active: false,
                                hasResult: false // Flag để phân biệt
                            });
                        }
                    } catch {
                        // Nếu lỗi API, coi như customer chưa có kết quả
                        allResults.push({
                            id: `no-result-${customer.id}`,
                            customerId: customer,
                            serviceBookingId: null,
                            content: null,
                            active: false,
                            hasResult: false
                        });
                    }
                }
                setTestResults(allResults);
            } catch {
                setAllCustomers([]);
                setTestResults([]);
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, []);


    // Helper format date
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    };

    return (
        <div className="bg-white rounded-xl shadow p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">Test Result Management</h2>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th className="px-6 py-3">Tên khách hàng</th>
                            <th className="px-6 py-3">Tên dịch vụ</th>
                            <th className="px-6 py-3">Ngày hẹn</th>
                            <th className="px-6 py-3">Nội dung kết quả</th>
                            <th className="px-6 py-3">Trạng thái</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="5" className="text-center py-4">Đang tải...</td>
                            </tr>
                        ) : testResults.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="text-center py-4">Không có kết quả xét nghiệm.</td>
                            </tr>
                        ) : (
                            testResults
                                .sort((a, b) => {
                                    // Ưu tiên hiển thị customer có kết quả trước
                                    if (a.hasResult === false && b.hasResult !== false) return 1;
                                    if (a.hasResult !== false && b.hasResult === false) return -1;
                                    
                                    // Sắp xếp theo ngày hẹn nếu có
                                    const dateA = a.serviceBookingId?.appointmentDate;
                                    const dateB = b.serviceBookingId?.appointmentDate;
                                    if (dateA && dateB) {
                                        return new Date(dateB) - new Date(dateA);
                                    }
                                    
                                    // Sắp xếp theo tên customer
                                    return (a.customerId?.name || '').localeCompare(b.customerId?.name || '');
                                })
                                .map(result => (
                                    <tr key={result.id} className={`border-b hover:bg-gray-50 ${
                                        result.hasResult === false ? 'bg-yellow-50' : 'bg-white'
                                    }`}>
                                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                            {result.customerId?.name || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 text-gray-700">
                                            {result.customerId?.email || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4">
                                            {result.hasResult === false 
                                                ? 'Chưa đặt lịch' 
                                                : result.serviceBookingId?.serviceTypeId?.name || 'N/A'
                                            }
                                        </td>
                                        <td className="px-6 py-4">
                                            {result.hasResult === false 
                                                ? 'N/A'
                                                : formatDate(result.serviceBookingId?.appointmentDate)
                                            }
                                        </td>
                                        <td className="px-6 py-4 max-w-xs truncate" title={result.content}>
                                            {result.hasResult === false 
                                                ? 'Chưa có kết quả' 
                                                : result.content || 'Đang xử lý'
                                            }
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-0.5 rounded-full text-xs ${
                                                result.hasResult === false 
                                                    ? 'bg-gray-200 text-gray-800' 
                                                    : result.active 
                                                        ? 'bg-green-200 text-green-800' 
                                                        : 'bg-yellow-200 text-yellow-800'
                                            }`}>
                                                {result.hasResult === false 
                                                    ? 'Chưa có kết quả' 
                                                    : result.active 
                                                        ? 'Đã có kết quả' 
                                                        : 'Chờ kết quả'
                                                }
                                            </span>
                                        </td>
                                    </tr>
                                ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
const STATUS_LABELS = {
  SUCCESS: { label: "Thành công", color: "bg-green-100 text-green-700" },
  PENDING: { label: "Đang xử lý", color: "bg-yellow-100 text-yellow-700" },
  FAILED:  { label: "Thất bại", color: "bg-red-100 text-red-700" },
};

const PaymentManagementComponent = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");

  const fetchPaymentList = async () => {
    setLoading(true);
    try {
      // Lấy danh sách booking/servicebooking
      const res = await api.get("/api/servicebookings");
      const bookings = res.data || [];
      // Chỉ lấy booking có orderId (đã thanh toán)
      const paymentBookings = bookings.filter(b => b.orderId);

      // Lấy trạng thái từng giao dịch
      const detailedPayments = await Promise.all(
        paymentBookings.map(async (item) => {
          try {
            const statusRes = await api.get(`/payment/vnpay/status/${item.orderId}`);
            return {
              ...statusRes.data,
              customerName: item.customerId?.name || "N/A",
            };
          } catch {
            return {
              orderId: item.orderId,
              customerName: item.customerId?.name || "N/A",
              transactionStatus: "FAILED",
              message: "Không lấy được trạng thái",
            };
          }
        })
      );
      setPayments(detailedPayments);
    } catch {
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentList();
  }, []);

  // Filter payments theo trạng thái
  const filteredPayments = payments.filter((p) => {
    if (filter === "ALL") return true;
    if (filter === "SUCCESS") return p.transactionStatus === "SUCCESS";
    if (filter === "PENDING") return p.transactionStatus === "PENDING";
    if (filter === "FAILED")  return p.transactionStatus === "FAILED";
    return true;
  });

  return (
    <div className="bg-white rounded-xl shadow p-6 mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Quản lý thanh toán</h2>
        <div className="flex gap-2">
          <button
            className={`px-3 py-1 rounded ${filter === "ALL" ? "bg-blue-600 text-white" : "bg-gray-100"}`}
            onClick={() => setFilter("ALL")}
          >Tất cả</button>
          <button
            className={`px-3 py-1 rounded ${filter === "PENDING" ? "bg-yellow-500 text-white" : "bg-gray-100"}`}
            onClick={() => setFilter("PENDING")}
          >Đang xử lý</button>
          <button
            className={`px-3 py-1 rounded ${filter === "SUCCESS" ? "bg-green-600 text-white" : "bg-gray-100"}`}
            onClick={() => setFilter("SUCCESS")}
          >Thành công</button>
          <button
            className={`px-3 py-1 rounded ${filter === "FAILED" ? "bg-red-600 text-white" : "bg-gray-100"}`}
            onClick={() => setFilter("FAILED")}
          >Thất bại</button>
        </div>
      </div>
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 font-semibold text-gray-700">Order ID</th>
              <th className="font-semibold text-gray-700">Khách hàng</th>
              <th className="font-semibold text-gray-700">Số tiền</th>
              <th className="font-semibold text-gray-700">Trạng thái</th>
              <th className="font-semibold text-gray-700">Ngày tạo</th>
              <th className="font-semibold text-gray-700">Mã giao dịch</th>
              <th className="font-semibold text-gray-700">Ghi chú</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="text-center py-6">Đang tải...</td></tr>
            ) : filteredPayments.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-6 text-gray-400">Không có giao dịch.</td></tr>
            ) : (
              filteredPayments.map((p) => (
                <tr key={p.orderId} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">{p.orderId}</td>
                  <td>{p.customerName}</td>
                  <td>{p.amount?.toLocaleString("vi-VN")} VNĐ</td>
                  <td>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${STATUS_LABELS[p.transactionStatus]?.color || "bg-gray-200 text-gray-600"}`}>
                      {STATUS_LABELS[p.transactionStatus]?.label || p.transactionStatus || "Không xác định"}
                    </span>
                  </td>
                  <td>{p.createDate ? new Date(p.createDate).toLocaleString("vi-VN") : "N/A"}</td>
                  <td>{p.transactionId || "N/A"}</td>
                  <td>{p.message || ""}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const FeedbackManagementComponent = () => {
    const [ratings, setRatings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showRatingModal, setShowRatingModal] = useState(false);
    const [selectedRating, setSelectedRating] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterPublic, setFilterPublic] = useState('all');
    const [filterActive, setFilterActive] = useState('all');
    const [filterRating, setFilterRating] = useState('all');
    const { showToast } = useToast();
    useEffect(() => {
        fetchRatings();
    }, []);    

    const fetchRatings = async () => {
        setLoading(true);
        try {
            const response = await api.get('/api/rating');
            setRatings(response.data || []);
        } catch (error) {
            console.error('Error fetching ratings:', error);
            setRatings([]);
            showToast('Failed to load ratings', 'error');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return `${date.toLocaleDateString('vi-VN')} ${date.toLocaleTimeString('vi-VN', { 
            hour: '2-digit', 
            minute: '2-digit' 
        })}`;
    };

    const getCustomerName = (customerObj) => {
        return customerObj?.name || 'Unknown Customer';
    };

    const getConsultantName = (consultantObj) => {
        return consultantObj?.name || 'Unknown Consultant';
    };

    const getServiceInfo = (serviceBookingObj) => {
        if (!serviceBookingObj) return 'N/A';
        const serviceName = serviceBookingObj.serviceTypeId?.name || 'Unknown Service';
        const appointmentDate = serviceBookingObj.appointmentDate 
            ? new Date(serviceBookingObj.appointmentDate).toLocaleDateString('vi-VN')
            : '';
        return `${serviceName}${appointmentDate ? ` - ${appointmentDate}` : ''}`;
    };

    const openViewFeedbackModal = (feedback) => {
        setSelectedFeedback(feedback);
        setShowFeedbackModal(true);
    };

    const toggleRatingStatus = async (ratingId, field, newValue) => {
        try {
            // Update locally first for immediate UI feedback
            setRatings(prevRatings =>
                prevRatings.map(rating =>
                    rating.id === ratingId ? { ...rating, [field]: newValue } : rating
                )
            );

            // Call API to update the rating
            // Note: You may need to implement these API endpoints
            // await api.put(`/api/rating/${ratingId}`, { [field]: newValue });
            
            showToast(`Rating ${field} updated successfully`, 'success');
        } catch (error) {
            console.error(`Error updating rating ${field}:`, error);
            showToast(`Failed to update rating ${field}`, 'error');
            
            // Revert the local change on error
            setRatings(prevRatings =>
                prevRatings.map(rating =>
                    rating.id === ratingId ? { ...rating, [field]: !newValue } : rating
                )
            );
        }
    };
    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;

        for (let i = 1; i <= 5; i++) {
            if (i <= fullStars) {
                stars.push(<Star key={i} size={16} className="fill-current text-yellow-400" />);
            } else if (i === fullStars + 1 && hasHalfStar) {
                stars.push(<Star key={i} size={16} className="fill-current text-yellow-400 opacity-50" />);
            } else {
                stars.push(<Star key={i} size={16} className="text-gray-300" />);
            }
        }
        return stars;
    };

    // Filter ratings based on search and filters
    const filteredRatings = ratings.filter(rating => {
        const customerName = getCustomerName(rating.customerId).toLowerCase();
        const consultantName = getConsultantName(rating.consultantId).toLowerCase();
        const title = (rating.title || '').toLowerCase();
        const content = (rating.content || '').toLowerCase();
        
        const matchesSearch = searchTerm === '' || 
            customerName.includes(searchTerm.toLowerCase()) ||
            consultantName.includes(searchTerm.toLowerCase()) ||
            title.includes(searchTerm.toLowerCase()) ||
            content.includes(searchTerm.toLowerCase());

        const matchesPublic = filterPublic === 'all' || 
            (filterPublic === 'public' && rating.isPublic) ||
            (filterPublic === 'private' && !rating.isPublic);

        const matchesActive = filterActive === 'all' ||
            (filterActive === 'active' && rating.isActive) ||
            (filterActive === 'inactive' && !rating.isActive);

        const matchesRating = filterRating === 'all' ||
            (filterRating === '5' && rating.rating === 5) ||
            (filterRating === '4' && rating.rating === 4) ||
            (filterRating === '3' && rating.rating === 3) ||
            (filterRating === '1-2' && rating.rating <= 2);

        return matchesSearch && matchesPublic && matchesActive && matchesRating;
    });
    return (
        <div className="bg-white rounded-xl shadow p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-semibold text-gray-800">Rating & Feedback Management</h2>
                    <p className="text-gray-600 text-sm mt-1">
                        Manage customer ratings and feedback for consultants
                    </p>
                </div>
                <div className="text-sm text-gray-500">
                    Total Ratings: {ratings.length} | Filtered: {filteredRatings.length}
                </div>
            </div>
            {/* Filters */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    {/* Search */}
                    <div className="lg:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                            <input
                                type="text"
                                placeholder="Search by customer, consultant, title..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            />
                        </div>
                    </div>

                    {/* Public Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Visibility</label>
                        <select
                            value={filterPublic}
                            onChange={(e) => setFilterPublic(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                        >
                            <option value="all">All</option>
                            <option value="public">Public</option>
                            <option value="private">Private</option>
                        </select>
                    </div>

                    {/* Active Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select
                            value={filterActive}
                            onChange={(e) => setFilterActive(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                        >
                            <option value="all">All</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>

                    {/* Rating Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                        <select
                            value={filterRating}
                            onChange={(e) => setFilterRating(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                        >
                            <option value="all">All Ratings</option>
                            <option value="5">5 Stars</option>
                            <option value="4">4 Stars</option>
                            <option value="3">3 Stars</option>
                            <option value="1-2">1-2 Stars</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Ratings Table */}
            <div className="overflow-x-auto">
                <div className="max-h-[600px] overflow-y-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th className="px-6 py-3">Date</th>
                                <th className="px-6 py-3">Customer</th>
                                <th className="px-6 py-3">Consultant</th>
                                <th className="px-6 py-3">Service</th>
                                <th className="px-6 py-3">Rating</th>
                                <th className="px-6 py-3">Title</th>
                                <th className="px-6 py-3">Public</th>
                                <th className="px-6 py-3">Active</th>
                                <th className="px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="9" className="text-center py-8">
                                        <div className="flex justify-center items-center">
                                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                                            <span className="ml-2">Loading ratings...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredRatings.length > 0 ? (
                                filteredRatings
                                    .sort((a, b) => new Date(b.createDate) - new Date(a.createDate))
                                    .map(rating => (
                                        <tr key={rating.id} className="bg-white border-b hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-xs">
                                                {formatDate(rating.createDate)}
                                            </td>
                                            <td className="px-6 py-4 font-medium text-gray-900">
                                                <div>
                                                    <div className="font-medium">{getCustomerName(rating.customerId)}</div>
                                                    <div className="text-xs text-gray-500">{rating.customerId?.email}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div>
                                                    <div className="font-medium text-gray-900">{getConsultantName(rating.consultantId)}</div>
                                                    <div className="text-xs text-gray-500">{rating.consultantId?.specialization}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 max-w-xs truncate" title={getServiceInfo(rating.serviceBookingId)}>
                                                {getServiceInfo(rating.serviceBookingId)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1">
                                                    {renderStars(rating.rating)}
                                                    <span className="ml-1 font-medium text-gray-900">({rating.rating})</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 max-w-xs truncate" title={rating.title}>
                                                {rating.title || 'No title'}
                                            </td>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => toggleRatingStatus(rating.id, 'isPublic', !rating.isPublic)}
                                                    className={`px-3 py-1 text-xs rounded-full font-medium transition-colors ${
                                                        rating.isPublic 
                                                            ? 'bg-blue-100 text-blue-800 hover:bg-blue-200' 
                                                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                                    }`}
                                                >
                                                    {rating.isPublic ? 'Public' : 'Private'}
                                                </button>
                                            </td>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => toggleRatingStatus(rating.id, 'isActive', !rating.isActive)}
                                                    className={`px-3 py-1 text-xs rounded-full font-medium transition-colors ${
                                                        rating.isActive 
                                                            ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                                                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                                                    }`}
                                                >
                                                    {rating.isActive ? 'Active' : 'Inactive'}
                                                </button>
                                            </td>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => openViewRatingModal(rating)}
                                                    className="text-indigo-600 hover:text-indigo-900 font-medium"
                                                >
                                                    View Details
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                            ) : (
                                <tr>
                                    <td colSpan="9" className="px-6 py-8 text-center text-gray-500">
                                        {searchTerm || filterPublic !== 'all' || filterActive !== 'all' || filterRating !== 'all' 
                                            ? 'No ratings found matching your filters.' 
                                            : 'No ratings found.'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Detailed Rating Modal */}
            {showRatingModal && selectedRating && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900">{selectedRating.title || 'Rating Details'}</h3>
                                <p className="text-sm text-gray-500 mt-1">Rating ID: {selectedRating.id}</p>
                            </div>
                            <button 
                                onClick={() => setShowRatingModal(false)} 
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            {/* Rating Score */}
                            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg border border-yellow-200">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-700">Rating Score</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            {renderStars(selectedRating.rating)}
                                            <span className="text-lg font-bold text-gray-900">({selectedRating.rating}/5)</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-gray-500">Submitted on</p>
                                        <p className="text-sm font-medium">{formatDate(selectedRating.createDate)}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Participants */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                    <h4 className="font-medium text-blue-900 mb-2 flex items-center">
                                        <User size={16} className="mr-2" />
                                        Customer
                                    </h4>
                                    <p className="font-medium text-gray-900">{getCustomerName(selectedRating.customerId)}</p>
                                    <p className="text-sm text-gray-600">{selectedRating.customerId?.email}</p>
                                    {selectedRating.customerId?.phone && (
                                        <p className="text-sm text-gray-600">{selectedRating.customerId.phone}</p>
                                    )}
                                </div>

                                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                                    <h4 className="font-medium text-green-900 mb-2 flex items-center">
                                        <Stethoscope size={16} className="mr-2" />
                                        Consultant
                                    </h4>
                                    <p className="font-medium text-gray-900">{getConsultantName(selectedRating.consultantId)}</p>
                                    <p className="text-sm text-gray-600">{selectedRating.consultantId?.specialization}</p>
                                    <p className="text-sm text-gray-600">{selectedRating.consultantId?.email}</p>
                                </div>
                            </div>

                            {/* Service Information */}
                            {selectedRating.serviceBookingId && (
                                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                                    <h4 className="font-medium text-purple-900 mb-2 flex items-center">
                                        <Briefcase size={16} className="mr-2" />
                                        Service Details
                                    </h4>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <p className="text-gray-600">Service:</p>
                                            <p className="font-medium">{selectedRating.serviceBookingId.serviceTypeId?.name || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600">Appointment Date:</p>
                                            <p className="font-medium">
                                                {selectedRating.serviceBookingId.appointmentDate 
                                                    ? new Date(selectedRating.serviceBookingId.appointmentDate).toLocaleDateString('vi-VN')
                                                    : 'N/A'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600">Service Type:</p>
                                            <p className="font-medium">
                                                {selectedRating.serviceBookingId.serviceTypeId?.typeCode === 0 ? 'Consultation' : 'Testing'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600">Price:</p>
                                            <p className="font-medium">
                                                {selectedRating.serviceBookingId.serviceTypeId?.price?.toLocaleString('vi-VN')} VNĐ
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Content */}
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                                    <FileText size={16} className="mr-2" />
                                    Feedback Content
                                </h4>
                                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                                    {selectedRating.content || 'No feedback content provided.'}
                                </p>
                            </div>

                            {/* Status Controls */}
                            <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
                                <button
                                    onClick={() => {
                                        toggleRatingStatus(selectedRating.id, 'isPublic', !selectedRating.isPublic);
                                        setSelectedRating(prev => ({...prev, isPublic: !prev.isPublic}));
                                    }}
                                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                        selectedRating.isPublic 
                                            ? 'bg-yellow-500 hover:bg-yellow-600 text-white' 
                                            : 'bg-blue-500 hover:bg-blue-600 text-white'
                                    }`}
                                >
                                    {selectedRating.isPublic ? 'Make Private' : 'Make Public'}
                                </button>
                                
                                <button
                                    onClick={() => {
                                        toggleRatingStatus(selectedRating.id, 'isActive', !selectedRating.isActive);
                                        setSelectedRating(prev => ({...prev, isActive: !prev.isActive}));
                                    }}
                                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                        selectedRating.isActive 
                                            ? 'bg-red-500 hover:bg-red-600 text-white' 
                                            : 'bg-green-500 hover:bg-green-600 text-white'
                                    }`}
                                >
                                    {selectedRating.isActive ? 'Deactivate' : 'Activate'}
                                </button>

                                <button 
                                    onClick={() => setShowRatingModal(false)} 
                                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-medium transition-colors ml-auto"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
 const formatGender = (genderValue) => {
    if (genderValue === 0) return 'Male'; 
    if (genderValue === 2) return 'Female';
    if (genderValue === 1) return 'Other'; 
    return 'N/A';
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
    const [activeTab, setActiveTab] = useState('find');
    const [searchEmail, setSearchEmail] = useState('');
    const [foundAccount, setFoundAccount] = useState(null);
    const [searchAttempted, setSearchAttempted] = useState(false);

    // Internal state for FilterInterface to manage its own data
    const [internalAccountsData, setInternalAccountsData] = useState([]);
    const [internalIsLoading, setInternalIsLoading] = useState(false);
    const [internalError, setInternalError] = useState(null);

    useEffect(() => {
        // Fetch data when the component mounts or 'all' tab is active and data isn't loaded
        // For simplicity, let's fetch when the component mounts.
        // If you only want to fetch when 'all' tab is clicked, adjust this logic.
        const fetchAccountsForInterface = async () => {
            setInternalIsLoading(true);
            setInternalError(null);
            try {
                // 'api' is available here because FilterInterface is defined in the same
                // module scope as AdminProfile, where 'api' is imported.
                const response = await api.get('/api/user');
                setInternalAccountsData(response.data || []);
            } catch (error) {
                console.error("Error fetching accounts in FilterInterface:", error);
                setInternalError(error.response?.data?.message || error.message || "Failed to load accounts.");
                setInternalAccountsData([]);
            } finally {
                setInternalIsLoading(false);
            }
        };

        fetchAccountsForInterface();
    }, []); // Empty dependency array: fetch once when FilterInterface mounts

    const handleFindAccount = () => {
        setSearchAttempted(true);
        setFoundAccount(null);
        const trimmedEmail = searchEmail.trim().toLowerCase();
        if (!trimmedEmail) return;

        // Use internalAccountsData for searching
        const account = internalAccountsData.find(acc => acc.email && acc.email.toLowerCase() === trimmedEmail);
        setFoundAccount(account);
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setSearchEmail('');
        setFoundAccount(null);
        setSearchAttempted(false);
        // Optionally, you could re-fetch or ensure data is fresh if 'all' tab is selected
    };
    const [roleFilter, setRoleFilter] = useState('');
    const [genderFilter, setGenderFilter] = useState('');
    const [activeFilter, setActiveFilter] = useState('');
    const [searchFilter, setSearchFilter] = useState('');

    // Add these computed values:
    const uniqueRoles = [...new Set(internalAccountsData.map(account => account.role?.name).filter(Boolean))];

    const filteredAccounts = internalAccountsData.filter(account => {
        // Role filter
        if (roleFilter && account.role?.name !== roleFilter) return false;
        
        // Gender filter
        if (genderFilter && account.gender.toString() !== genderFilter) return false;
        
        // Active status filter
        if (activeFilter && account.active.toString() !== activeFilter) return false;
        
        // Search filter
        if (searchFilter) {
            const searchLower = searchFilter.toLowerCase();
            const nameMatch = account.name?.toLowerCase().includes(searchLower);
            const emailMatch = account.email?.toLowerCase().includes(searchLower);
            if (!nameMatch && !emailMatch) return false;
        }
        return true;
    })
    .sort((a, b) => {
        // Sort by filter priority - exact matches appear first
        let scoreA = 0;
        let scoreB = 0;
        
        // Role filter priority
        if (roleFilter) {
            if (a.role?.name === roleFilter) scoreA += 4;
            if (b.role?.name === roleFilter) scoreB += 4;
        }
        
        // Gender filter priority
        if (genderFilter) {
            if (a.gender.toString() === genderFilter) scoreA += 3;
            if (b.gender.toString() === genderFilter) scoreB += 3;
        }
        
        // Active status filter priority
        if (activeFilter) {
            if (a.active.toString() === activeFilter) scoreA += 2;
            if (b.active.toString() === activeFilter) scoreB += 2;
        }
        
        // Search filter priority
        if (searchFilter) {
            const searchLower = searchFilter.toLowerCase();
            const aNameMatch = a.name?.toLowerCase().includes(searchLower);
            const aEmailMatch = a.email?.toLowerCase().includes(searchLower);
            const bNameMatch = b.name?.toLowerCase().includes(searchLower);
            const bEmailMatch = b.email?.toLowerCase().includes(searchLower);
            
            if (aNameMatch || aEmailMatch) scoreA += 1;
            if (bNameMatch || bEmailMatch) scoreB += 1;
        }
        
        // Sort by score (higher scores first), then by name alphabetically
        if (scoreB !== scoreA) {
            return scoreB - scoreA;
        }
        
        // Secondary sort by name if scores are equal
        return (a.name || '').localeCompare(b.name || '');
    });
    return (
        <div className="bg-white rounded-xl shadow p-6">
            <div className="flex mb-6 border-b">
                <button
                    onClick={() => handleTabChange('find')}
                    className={`flex items-center gap-2 px-6 py-3 text-sm font-medium rounded-t-lg focus:outline-none ${
                        activeTab === 'find' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                >
                    <Search size={18} />
                    Find {title} by Email
                </button>
                <button
                    onClick={() => handleTabChange('all')}
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
                    <h2 className="text-xl font-semibold mb-4 text-gray-700">Find Account by Email</h2>
                    {internalIsLoading && <p className="text-gray-500">Loading account data for search...</p>}
                    {internalError && <p className="text-red-500">Error: {internalError}</p>}
                    {!internalIsLoading && !internalError && (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                                <div className="md:col-span-2">
                                    <label htmlFor="searchEmailInput" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                    <input
                                        id="searchEmailInput"
                                        type="email"
                                        value={searchEmail}
                                        onChange={(e) => setSearchEmail(e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter Email Address"
                                    />
                                </div>
                                <div className="md:col-span-2 flex items-end">
                                    <button
                                        onClick={handleFindAccount}
                                        className="w-full md:w-auto bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                        disabled={!searchEmail.trim() || internalIsLoading}
                                    >
                                        Find Account
                                    </button>
                                </div>
                            </div>

                            {searchAttempted && foundAccount && (
                                <div className="mt-6 p-4 bg-gray-50 rounded-lg shadow">
                                    <h3 className="text-lg font-semibold mb-3 text-gray-800">Account Information</h3>
                                    <div className="mb-1"><span className="font-medium">ID:</span> {foundAccount.id}</div>
                                    <div className="mb-1"><span className="font-medium">Name:</span> {foundAccount.name}</div>
                                    <div className="mb-1"><span className="font-medium">Email:</span> {foundAccount.email}</div>
                                    <div className="mb-1"><span className="font-medium">Role:</span> {foundAccount.role?.name || 'N/A'}</div>
                                    <div className="mb-1"><span className="font-medium">Gender:</span> {formatGender(foundAccount.gender)}</div>
                                    <div className="mb-1"><span className="font-medium">Phone:</span> {foundAccount.phone || 'N/A'}</div>
                                    <div className="mb-1"><span className="font-medium">Created:</span> {new Date(foundAccount.createDate).toLocaleDateString()}</div>
                                </div>
                            )}
                            {searchAttempted && !foundAccount && searchEmail.trim() && (
                                <div className="mt-6 p-4 bg-red-50 text-red-700 rounded-lg">
                                    No account found with email "{searchEmail.trim()}".
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}

            {activeTab === 'all' && (
                <div>
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                        <h2 className="text-xl font-semibold mb-4 text-gray-700">All {title}s List</h2>
                        {/* Filter Controls */}
                        <div className="flex flex-wrap gap-4">
                                {/* Role Filter */}
                                <div className="min-w-[150px]" >
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Role</label>
                                    <select
                                        value={roleFilter}
                                        onChange={(e) => setRoleFilter(e.target.value)}
                                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="">All Roles</option>
                                        {uniqueRoles.map(role => (
                                            <option key={role} value={role}>{role}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Gender Filter */}
                                <div className="min-w-[120px]">
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Gender</label>
                                    <select
                                        value={genderFilter}
                                        onChange={(e) => setGenderFilter(e.target.value)}
                                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="">All Genders</option>
                                        <option value="0">Male</option>
                                        <option value="2">Female</option>
                                        <option value="1">Other</option>
                                    </select>
                                </div>

                                {/* Active Status Filter */}
                                <div className="min-w-[120px]">
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
                                    <select
                                        value={activeFilter}
                                        onChange={(e) => setActiveFilter(e.target.value)}
                                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="">All Status</option>
                                        <option value="true">Active</option>
                                        <option value="false">Inactive</option>
                                    </select>
                                </div>
                        </div>
                    </div>
                    {/* Loading and Error States */}
                    {internalIsLoading && <p className="text-center py-4">Loading accounts...</p>}
                    {internalError && <p className="text-center py-4 text-red-500">Error loading accounts: {internalError}</p>}
                    {!internalIsLoading && !internalError && (
                        <>
                            {/* Show "No results" message when filters are applied but no results */}
                            {(roleFilter || genderFilter || activeFilter) && filteredAccounts.length === 0 ? (
                                <div className="p-6 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg text-center">
                                    <div className="flex items-center justify-center mb-2">
                                        <svg className="w-6 h-6 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
                                        </svg>
                                        <h3 className="text-lg font-medium">No Accounts Found</h3>
                                    </div>
                                    <p className="mb-2">No accounts match your current filter selection:</p>
                                    <div className="text-sm space-y-1">
                                        {roleFilter && <p>• Role: <span className="font-medium">{roleFilter}</span></p>}
                                        {genderFilter && <p>• Gender: <span className="font-medium">{genderFilter === '0' ? 'Male' : genderFilter === '2' ? 'Female' : 'Other'}</span></p>}
                                        {activeFilter && <p>• Status: <span className="font-medium">{activeFilter === 'true' ? 'Active' : 'Inactive'}</span></p>}
                                    </div>
                                </div>
                            ) : filteredAccounts.length > 0 ? (
                                /* Show table when there are results */
                                <div className="bg-white rounded-lg shadow overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <div className="max-h-96 overflow-y-auto">
                                            <table className="w-full text-left text-sm">
                                                <thead className="bg-gray-50 sticky top-0 z-10 border-b border-gray-200">
                                                    <tr>
                                                        <th className="px-4 py-3 font-medium text-gray-600 min-w-[100px]">ID</th>
                                                        <th className="px-4 py-3 font-medium text-gray-600 min-w-[100px]">Name</th>
                                                        <th className="px-4 py-3 font-medium text-gray-600 min-w-[100px]">Email</th>
                                                        <th className="px-4 py-3 font-medium text-gray-600 min-w-[100px]">Role</th>
                                                        <th className="px-4 py-3 font-medium text-gray-600 min-w-[100px]">Gender</th>
                                                        <th className="px-4 py-3 font-medium text-gray-600 min-w-[100px]">Phone</th>
                                                        <th className="px-4 py-3 font-medium text-gray-600 min-w-[100px]">Created</th>
                                                        <th className="px-4 py-3 font-medium text-gray-600 min-w-[100px]">Active</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {filteredAccounts.map((account) => (
                                                        <tr key={account.id} className="hover:bg-gray-50">
                                                            <td className="px-4 py-3 text-gray-700 font-mono text-xs break-all">{account.id.substring(0, 8)}...</td>
                                                            <td className="px-4 py-3 text-gray-700 font-medium">{account.name}</td>
                                                            <td className="px-4 py-3 text-gray-700 break-all">{account.email}</td>
                                                            <td className="px-4 py-3">
                                                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                                                    roleFilter && account.role?.name === roleFilter 
                                                                        ? 'bg-blue-200 text-blue-900 ring-2 ring-blue-400' 
                                                                        : 'bg-blue-100 text-blue-800'
                                                                }`}>
                                                                    {account.role?.name || 'N/A'}
                                                                </span>
                                                            </td>
                                                            <td className="px-4 py-3">
                                                                <span className={`${
                                                                    genderFilter && account.gender.toString() === genderFilter 
                                                                        ? 'font-bold text-green-700 bg-green-100 px-2 py-1 rounded-full ring-2 ring-green-400' 
                                                                        : 'text-gray-700'
                                                                }`}>
                                                                    {formatGender(account.gender)}
                                                                </span>
                                                            </td>
                                                            <td className="px-4 py-3 text-gray-700">{account.phone || 'N/A'}</td>
                                                            <td className="px-4 py-3 text-gray-700 text-xs">{new Date(account.createDate).toLocaleDateString()}</td>
                                                            <td className="px-4 py-3">
                                                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                                                    account.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                                } ${
                                                                    activeFilter && account.active.toString() === activeFilter 
                                                                        ? 'ring-2 ring-yellow-400' 
                                                                        : ''
                                                                }`}>
                                                                    {account.active ? 'Yes' : 'No'}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                    {/* Scroll indicator */}
                                    {filteredAccounts.length > 10 && (
                                        <div className="bg-gray-50 px-4 py-2 text-center text-sm text-gray-500 border-t">
                                            Showing {filteredAccounts.length} accounts - Scroll to view more
                                        </div>
                                    )}
                                </div>
                            ) : (
                                /* Show when no accounts exist and no filters applied */
                                <p className="text-center py-4 text-gray-500">No accounts to display.</p>
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    );
};
const ConsultingManagementComponent = () => {
  const [calls, setCalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCall, setSelectedCall] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // Lấy danh sách tất cả video calls
  const fetchCalls = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/video-calls/videcalls");
      setCalls(res.data || []);
    } catch {
      setCalls([]);
    } finally {
      setLoading(false);
    }
  };

  // Lấy chi tiết 1 call
  const fetchCallDetail = async (callId) => {
    setDetailLoading(true);
    try {
      const res = await api.get(`/api/video-calls/${callId}`);
      setSelectedCall(res.data);
    } catch {
      setSelectedCall(null);
    } finally {
      setDetailLoading(false);
    }
  };

  useEffect(() => {
    fetchCalls();
  }, []);

  // Helper format date/time
  const formatDateTime = (dt) => dt ? new Date(dt).toLocaleString() : "N/A";

  // Lọc chỉ hiển thị call có đủ channelName, startedAt và endedAt
  const filteredCalls = calls.filter(
    call => call.channelName && call.startedAt && call.endedAt
  );

  return (
    <div className="bg-white rounded-xl shadow p-6 mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Quản lý cuộc gọi tư vấn video</h2>
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <div className="max-h-[600px] overflow-y-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3 font-semibold text-gray-700">Channel</th>
                <th className="font-semibold text-gray-700">Chuyên gia</th>
                <th className="font-semibold text-gray-700">Khách hàng</th>
                <th className="font-semibold text-gray-700">Trạng thái</th>
                <th className="font-semibold text-gray-700">Bắt đầu</th>
                <th className="font-semibold text-gray-700">Kết thúc</th>
                <th className="font-semibold text-gray-700">Thời lượng (giây)</th>
                <th className="font-semibold text-gray-700">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} className="text-center py-6">Đang tải...</td></tr>
              ) : filteredCalls.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-6 text-gray-400">Không có cuộc gọi hợp lệ.</td></tr>
              ) : (
                filteredCalls.map(call => (
                  <tr key={call.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">{call.channelName}</td>
                    <td>{call.consultantId?.name || "N/A"}</td>
                    <td>{call.customerId?.name || "N/A"}</td>
                    <td>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        call.status === "ACTIVE"
                          ? "bg-green-100 text-green-700"
                          : call.status === "INITIATED"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-200 text-gray-600"
                      }`}>
                        {call.status}
                      </span>
                    </td>
                    <td>{formatDateTime(call.startedAt)}</td>
                    <td>{formatDateTime(call.endedAt)}</td>
                    <td>{call.durationSeconds ?? "N/A"}</td>
                    <td>
                      <button
                        className="text-blue-600 hover:underline flex items-center gap-1"
                        onClick={() => fetchCallDetail(call.id)}
                      >
                        <Eye size={16} /> Xem chi tiết
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal xem chi tiết giữ nguyên */}
      {selectedCall && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow w-full max-w-lg">
            <h3 className="text-lg font-semibold mb-4">Chi tiết cuộc gọi</h3>
            {detailLoading ? (
              <div>Đang tải chi tiết...</div>
            ) : (
              <div className="space-y-2">
                <div><b>Channel:</b> {selectedCall.channelName}</div>
                <div><b>Chuyên gia:</b> {selectedCall.consultantId?.name} ({selectedCall.consultantId?.email})</div>
                <div><b>Khách hàng:</b> {selectedCall.customerId?.name} ({selectedCall.customerId?.email})</div>
                <div><b>Trạng thái:</b> {selectedCall.status}</div>
                <div><b>Bắt đầu:</b> {formatDateTime(selectedCall.startedAt)}</div>
                <div><b>Kết thúc:</b> {formatDateTime(selectedCall.endedAt)}</div>
                <div><b>Thời lượng:</b> {selectedCall.durationSeconds} giây</div>
                <div><b>Ngày tạo:</b> {formatDateTime(selectedCall.createdAt)}</div>
              </div>
            )}
            <div className="flex justify-end mt-6">
              <button
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                onClick={() => setSelectedCall(null)}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default function AdminProfile() {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [profileMenu, setProfileMenu] = useState(false);
    const [activeView, setActiveView] = useState('accounts');
    const [allUsersForOtherViews, setAllUsersForOtherViews] = useState([]);
    const [loadingOtherViewsData, setLoadingOtherViewsData] = useState(false);
    const [otherViewsDataError, setOtherViewsDataError] = useState(null);
    const handleLogout = () => {
        logout();
        navigate("/login");
    };
    useEffect(() => {
        // Fetch all users if needed for consultant/customer specific views
        const fetchUsersForAdminProfile = async () => {
            // Only fetch if one of the views that needs this data is active
            // and data hasn't been fetched yet or needs refresh.
            if (['consultantAccounts', 'customerAccounts'].includes(activeView) && allUsersForOtherViews.length === 0) {
                setLoadingOtherViewsData(true);
                setOtherViewsDataError(null);
                try {
                    const response = await api.get('/api/user');
                    setAllUsersForOtherViews(response.data || []);
                } catch (error) {
                    console.error("Error fetching users for AdminProfile views:", error);
                    setOtherViewsDataError(error.response?.data?.message || error.message || "Failed to load user data.");
                    setAllUsersForOtherViews([]);
                } finally {
                    setLoadingOtherViewsData(false);
                }
            }
        };
        fetchUsersForAdminProfile();
    }, [activeView, allUsersForOtherViews.length]); 

    const renderMainContent = () => {
        switch (activeView) {
            // case 'dashboard':
            //     return (
            //         <>
            //             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            //                 <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition-shadow">
            //                     <div className="flex items-center justify-between">
            //                         <div className="text-gray-500">Total Active Users</div>
            //                         <Users size={24} className="text-blue-500" />
            //                     </div>
            //                     <div className="text-3xl font-bold text-blue-700 mt-2">{dashboardOverviewData.totalActiveUsers.toLocaleString()}</div>
            //                     <div className="text-sm text-green-500 mt-1">+2.5% vs last month</div>
            //                 </div>
            //                 <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition-shadow">
            //                     <div className="flex items-center justify-between">
            //                         <div className="text-gray-500">Bookings (This Month)</div>
            //                         <CalendarDays size={24} className="text-purple-500" />
            //                     </div>
            //                     <div className="text-3xl font-bold text-purple-700 mt-2">{dashboardOverviewData.totalBookingsThisMonth.toLocaleString()}</div>
            //                     <div className="text-sm text-green-500 mt-1">+5% vs last month</div>
            //                 </div>
            //                 <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition-shadow">
            //                     <div className="flex items-center justify-between">
            //                         <div className="text-gray-500">Revenue (This Month)</div>
            //                         <BarChart2 size={24} className="text-green-500" />
            //                     </div>
            //                     <div className="text-3xl font-bold text-green-700 mt-2">{dashboardOverviewData.monthlyRevenue.toLocaleString()} VND</div>
            //                     <div className="text-sm text-red-500 mt-1">-1.2% vs last month</div>
            //                 </div>
            //                 <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition-shadow">
            //                     <div className="flex items-center justify-between">
            //                         <div className="text-gray-500">Avg. Service Rating</div>
            //                         <Star size={24} className="text-yellow-500" />
            //                     </div>
            //                     <div className="text-3xl font-bold text-yellow-700 mt-2">{dashboardOverviewData.averageServiceRating}/5</div>
            //                     <div className="text-sm text-gray-500 mt-1">Based on all services</div>
            //                 </div>
            //             </div>

            //             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

            //                 <div className="lg:col-span-2 bg-white rounded-xl shadow p-6 hover:shadow-lg transition-shadow">
            //                     <h3 className="text-lg font-semibold text-gray-700 mb-4">Booking Trends (Last 7 Days)</h3>
            //                     <div className="h-64 flex items-center justify-center text-gray-400">

            //                         [Bar Chart: Consultation vs Test Bookings per Day]
            //                         <p className="text-sm">(Data: Mon C:{bookingTrendsData.consultationBookings[0]} T:{bookingTrendsData.testBookings[0]}, ...)</p>
            //                     </div>
            //                 </div>

            //                 <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition-shadow">
            //                     <h3 className="text-lg font-semibold text-gray-700 mb-4">User Gender Distribution</h3>
            //                     <div className="h-64 flex flex-col items-center justify-center text-gray-400">

            //                         [Pie Chart Here]
            //                         <ul className="text-sm mt-2">
            //                             <li>Male: {genderDistributionData.counts[0]}</li>
            //                             <li>Female: {genderDistributionData.counts[1]}</li>
            //                             <li>Other: {genderDistributionData.counts[2]}</li>
            //                         </ul>
            //                     </div>
            //                 </div>
            //             </div>


            //             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            //                 <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition-shadow">
            //                     <h3 className="text-lg font-semibold text-gray-700 mb-4">Top Performing Consultants</h3>
            //                     <div className="overflow-x-auto">
            //                         <table className="w-full text-sm text-left">
            //                             <thead className="text-xs text-gray-500 uppercase">
            //                                 <tr>
            //                                     <th className="py-2 px-1">Name</th>
            //                                     <th className="py-2 px-1">Appointments</th>
            //                                     <th className="py-2 px-1">Rating</th>
            //                                 </tr>
            //                             </thead>
            //                             <tbody>
            //                                 {topPerformingConsultants.slice(0, 3).map(c => ( // Show top 3-5
            //                                     <tr key={c.id} className="border-b border-gray-200 hover:bg-gray-50">
            //                                         <td className="py-2 px-1 font-medium text-gray-800">{c.name}</td>
            //                                         <td className="py-2 px-1 text-gray-600">{c.appointmentsThisMonth}</td>
            //                                         <td className="py-2 px-1 text-yellow-600 flex items-center"><Star size={14} className="mr-1 fill-current"/>{c.rating}</td>
            //                                     </tr>
            //                                 ))}
            //                             </tbody>
            //                         </table>
            //                     </div>
            //                 </div>
            //                 <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition-shadow">
            //                     <h3 className="text-lg font-semibold text-gray-700 mb-4">Most Popular Services</h3>
            //                     <div className="overflow-x-auto">
            //                         <table className="w-full text-sm text-left">
            //                             <thead className="text-xs text-gray-500 uppercase">
            //                                 <tr>
            //                                     <th className="py-2 px-1">Service Name</th>
            //                                     <th className="py-2 px-1">Bookings</th>
            //                                     <th className="py-2 px-1">Revenue</th>
            //                                 </tr>
            //                             </thead>
            //                             <tbody>
            //                                 {popularServicesData.slice(0, 3).map(s => (
            //                                     <tr key={s.id} className="border-b border-gray-200 hover:bg-gray-50">
            //                                         <td className="py-2 px-1 font-medium text-gray-800">{s.name}</td>
            //                                         <td className="py-2 px-1 text-gray-600">{s.bookingsThisMonth}</td>
            //                                         <td className="py-2 px-1 text-green-600">{s.revenue.toLocaleString()} VND</td>
            //                                     </tr>
            //                                 ))}
            //                             </tbody>
            //                         </table>
            //                     </div>
            //                 </div>
            //             </div>
            //             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            //                  <div className="bg-white rounded-xl shadow p-4 hover:shadow-lg transition-shadow">
            //                     <div className="flex items-center">
            //                         <ClipboardCheck size={20} className="text-orange-500 mr-3"/>
            //                         <div>
            //                             <div className="text-gray-500 text-sm">Pending Test Results</div>
            //                             <div className="text-xl font-semibold text-orange-700">{dashboardOverviewData.pendingTestResults}</div>
            //                         </div>
            //                     </div>
            //                 </div>
            //                 <div className="bg-white rounded-xl shadow p-4 hover:shadow-lg transition-shadow">
            //                     <div className="flex items-center">
            //                         <Bell size={20} className="text-red-500 mr-3"/>
            //                         <div>
            //                             <div className="text-gray-500 text-sm">New Feedback Today</div>
            //                             <div className="text-xl font-semibold text-red-700">{dashboardOverviewData.newFeedbackToday}</div>
            //                         </div>
            //                     </div>
            //                 </div>
            //             </div>
            //         </>
            //     );
            case 'accounts': 
                return <FilterInterface title="Account" />;
            case 'consultantAccounts':
                return <ConsultantManagementComponent />;
            case 'staffAccounts':
                return <StaffManagementComponent />;
            case 'customerAccounts':
                return <CustomerManagementComponent/>;
            case 'services':
                return <ServiceManagementComponent />;
            case 'bookings':
                return <BookingManagementComponent />;
            case 'posts':
                return <PostManagementComponent />;
            case 'testResults':
                return <TestResultManagementComponent />;
            case 'payments':
                return <PaymentManagementComponent />;
            case 'feedback':
                return <FeedbackManagementComponent />;
            case 'reports':
                return <ReportManagementComponent />;
            case 'consultingManagement':
                return <ConsultingManagementComponent />;
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
                                <button onClick={handleLogout} className="flex items-center w-full px-4 py-2 hover:bg-gray-100 text-red-600"><LogOut className="mr-2" size={18}/>Đăng xuất</button>
                            </div>
                        )}
                    </div>
                </div>
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
                        {/* <button onClick={() => setActiveView('dashboard')}
                         className={`flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-blue-50 ${
                            activeView === 'dashboard' ? 'font-semibold text-blue-700 bg-blue-100' : ''
                            }`}>
                            <BarChart2 size={18} />
                            <span>Dashboard</span>
                        </button> */}
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
                        <button onClick={() => setActiveView('staffAccounts')} 
                        className={`flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-blue-50 ${
                            activeView === 'staffAccounts' ? 'font-semibold text-blue-700 bg-blue-100' : ''
                            }`}>    
                            <User size={18} />
                            <span>Staff</span>
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
                            <span>Test Order</span>
                        </button>
                        <button onClick={() => setActiveView('consultingManagement')} 
                        className={`flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-blue-50 ${
                            activeView === 'consultingManagement' ? 'font-semibold text-blue-700 bg-blue-100 ' : ''
                        }`}>
                        <Video size={18} />
                        <span>Online Consulting</span>
                        </button>
                        <button onClick={() => setActiveView('payments')} 
                        className={`flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-blue-50 ${
                            activeView === 'payments' ? 'font-semibold text-blue-700 bg-blue-100' : ''
                        }`}>
                        <CreditCard size={18} />
                        <span>Payments</span>
                        </button>
                        <button onClick={() => setActiveView('posts')} 
                        className={`flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-blue-50 ${
                            activeView === 'posts' ? 'font-semibold text-blue-700 bg-blue-100' : ''
                            }`}>
                            <Newspaper size={18} />
                            <span>Posts</span>
                        </button>
                        <button onClick={() => setActiveView('feedback')} 
                        className={`flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-blue-50${
                            activeView === 'feedback' ? 'font-semibold text-blue-700 bg-blue-100' : ''
                            }`}>
                        <Star size={18} /> 
                        <span>Rating</span>
                        </button>
                    </nav>
                </aside>

                {/* Dashboard Content */}
                <main className="flex-1 p-8">
                    {renderMainContent()}
                </main>
            </div>
        </div>
    );
}
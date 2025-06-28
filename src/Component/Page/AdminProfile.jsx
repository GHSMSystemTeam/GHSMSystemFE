import { useAuth } from "../Auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Bell, User, LogOut, FileText, Users, BarChart2, Settings, HelpCircle, Star, Briefcase, CalendarDays, ClipboardCheck, Newspaper, HomeIcon } from "lucide-react";
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
                        <h3 className="text-lg font-semibold mb-6">Thêm loại dịch vụ mới</h3>
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
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <div className="max-h-[600px] overflow-y-auto">
                        <table className="w-full text-sm text-left text-gray-500">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Date</th>
                                    <th scope="col" className="px-6 py-3">Time</th>
                                    <th scope="col" className="px-6 py-3">Patient</th>
                                    <th scope="col" className="px-6 py-3">Service Type</th>
                                    <th scope="col" className="px-6 py-3">Consultant</th>
                                    <th scope="col" className="px-6 py-3">Status</th>
                                    <th scope="col" className="px-6 py-3">Notes</th>
                                    <th scope="col" className="px-6 py-3">Actions</th>
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
                                            <td className="px-6 py-4">{booking.appointmentDate ? new Date(booking.appointmentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</td>
                                            <td className="px-6 py-4">{booking.customerId?.name || booking.customerId?.email || 'N/A'}</td>
                                            <td className="px-6 py-4">{booking.serviceTypeId?.name || 'N/A'}</td>
                                            <td className="px-6 py-4">{booking.consultantId?.name || 'N/A'}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-0.5 rounded-full text-xs ${
                                                    booking.status === 0 ? 'bg-yellow-200 text-yellow-800' :
                                                    booking.status === 1 ? 'bg-green-200 text-green-800' :
                                                    'bg-red-200 text-red-800'
                                                }`}>
                                                    {booking.status === 0 ? 'Scheduled' : booking.status === 1 ? 'Completed' : 'Cancelled'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 flex items-center gap-2">
                                                <button onClick={() => setSelectedBooking(booking)} className="text-sm text-blue-600 hover:underline">View</button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
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
    const [posts, setPosts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [consultants, setConsultants] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedConsultant, setSelectedConsultant] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState(''); // 'add', 'edit', 'view'
    const [selectedPost, setSelectedPost] = useState(null);
    const [showFilters, setShowFilters] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        category: '',
        content: '',
        consultantId: '',
        ratings: 0,
        feedback: ''
    });

    // Mock data - replace with actual API calls
    useEffect(() => {
        fetchPosts();
        fetchCategories();
        fetchConsultants();
    }, []);

    const fetchPosts = async () => {
        setLoading(true);
        // Mock data - replace with actual API call
        const mockPosts = [
    {
        id: 1,
        title: "Hướng dẫn chăm sóc sức khỏe tâm lý cho phụ nữ",
        category: "Tâm lý học",
        content: "Phụ nữ thường đối mặt với nhiều thay đổi tâm lý trong các giai đoạn khác nhau của cuộc đời. Bài viết này cung cấp hướng dẫn chi tiết về cách chăm sóc sức khỏe tâm lý, quản lý căng thẳng và duy trì tinh thần tích cực.",
        consultantId: 1,
        consultantName: "Dr. Nguyen Van A",
        ratings: 4.5,
        feedback: "Bài viết rất hữu ích và thực tế",
        createdDate: "2024-01-15",
        isActive: true
    },
    {
        id: 2,
        title: "Dinh dưỡng trong thai kỳ: Những điều cần biết",
        category: "Dinh dưỡng",
        content: "Thai kỳ là giai đoạn quan trọng cần chế độ dinh dưỡng đặc biệt. Hướng dẫn chi tiết về các chất dinh dưỡng cần thiết, thực phẩm nên ăn và tránh trong 9 tháng mang thai.",
        consultantId: 2,
        consultantName: "Dr. Tran Thi B",
        ratings: 4.8,
        feedback: "Thông tin chi tiết và dễ hiểu cho mẹ bầu",
        createdDate: "2024-01-10",
        isActive: true
    },
    {
        id: 3,
        title: "Sức khỏe sinh sản nam giới: Những vấn đề thường gặp",
        category: "Sức khỏe sinh sản",
        content: "Nam giới cũng cần quan tâm đến sức khỏe sinh sản. Bài viết phân tích các vấn đề thường gặp như rối loạn cương dương, vô sinh và cách phòng ngừa, điều trị hiệu quả.",
        consultantId: 3,
        consultantName: "Dr. Le Van C",
        ratings: 4.3,
        feedback: "Bài viết giúp nam giới hiểu rõ hơn về sức khỏe sinh sản",
        createdDate: "2024-01-08",
        isActive: true
    },
    {
        id: 4,
        title: "Mãn kinh: Triệu chứng và cách điều trị tự nhiên",
        category: "Nội tiết tố",
        content: "Mãn kinh là giai đoạn tự nhiên trong đời phụ nữ. Tìm hiểu về các triệu chứng, biến đổi hormone và phương pháp điều trị tự nhiên để vượt qua giai đoạn này một cách dễ dàng.",
        consultantId: 4,
        consultantName: "Dr. Pham Thi D",
        ratings: 4.6,
        feedback: "Rất hữu ích cho phụ nữ trung niên",
        createdDate: "2024-01-05",
        isActive: true
    },
    {
        id: 5,
        title: "Chăm sóc sức khỏe tiền mãn kinh",
        category: "Nội tiết tố",
        content: "Giai đoạn tiền mãn kinh đòi hỏi sự chăm sóc đặc biệt. Hướng dẫn về chế độ ăn uống, tập luyện và theo dõi sức khỏe để chuẩn bị cho giai đoạn mãn kinh.",
        consultantId: 4,
        consultantName: "Dr. Pham Thi D",
        ratings: 4.4,
        feedback: "Thông tin hữu ích cho phụ nữ độ tuổi 40+",
        createdDate: "2024-01-03",
        isActive: true
    },
    {
        id: 6,
        title: "Sức khỏe tình dục an toàn cho teen",
        category: "Giáo dục giới tính",
        content: "Giáo dục giới tính cho thanh thiếu niên về quan hệ tình dục an toàn, phòng tránh thai và các bệnh lây truyền qua đường tình dục. Thông tin khoa học và phù hợp với lứa tuổi.",
        consultantId: 5,
        consultantName: "Dr. Hoang Van E",
        ratings: 4.2,
        feedback: "Cần thiết cho giáo dục giới tính thanh thiếu niên",
        createdDate: "2024-01-01",
        isActive: true
    },
    {
        id: 7,
        title: "Rối loạn kinh nguyệt: Nguyên nhân và điều trị",
        category: "Phụ khoa",
        content: "Rối loạn kinh nguyệt ảnh hưởng đến nhiều phụ nữ. Phân tích các nguyên nhân từ căng thẳng, dinh dưỡng đến bệnh lý nội tiết và đưa ra phương pháp điều trị phù hợp.",
        consultantId: 6,
        consultantName: "Dr. Vo Thi F",
        ratings: 4.7,
        feedback: "Giải thích rõ ràng và dễ hiểu",
        createdDate: "2023-12-28",
        isActive: true
    },
    {
        id: 8,
        title: "Testosterone thấp ở nam giới: Dấu hiệu và điều trị",
        category: "Nội tiết tố",
        content: "Testosterone thấp ảnh hưởng đến sức khỏe nam giới. Nhận biết các dấu hiệu như giảm ham muốn, mệt mỏi, giảm khối lượng cơ và các phương pháp tăng testosterone tự nhiên.",
        consultantId: 7,
        consultantName: "Dr. Bui Van G",
        ratings: 4.5,
        feedback: "Thông tin quan trọng cho nam giới trung niên",
        createdDate: "2023-12-25",
        isActive: true
    },
    {
        id: 9,
        title: "Chăm sóc sức khỏe sau sinh cho mẹ",
        category: "Sản khoa",
        content: "Giai đoạn sau sinh đòi hỏi sự chăm sóc đặc biệt. Hướng dẫn về phục hồi thể chất, tinh thần, chăm sóc vết mổ và điều chỉnh hormone sau sinh.",
        consultantId: 8,
        consultantName: "Dr. Dang Thi H",
        ratings: 4.9,
        feedback: "Rất cần thiết cho các mẹ sau sinh",
        createdDate: "2023-12-22",
        isActive: true
    },
    {
        id: 10,
        title: "Phòng ngừa ung thư cổ tử cung",
        category: "Phòng chống ung thư",
        content: "Ung thư cổ tử cung có thể phòng ngừa được. Hướng dẫn về tầm soát định kỳ, vaccine HPV, các yếu tố nguy cơ và lối sống lành mạnh để phòng ngừa bệnh.",
        consultantId: 9,
        consultantName: "Dr. Luong Van I",
        ratings: 4.8,
        feedback: "Thông tin quan trọng cho phụ nữ",
        createdDate: "2023-12-20",
        isActive: true
    },
    {
        id: 11,
        title: "Hội chứng buồng trứng đa nang (PCOS)",
        category: "Phụ khoa",
        content: "PCOS là rối loạn hormone thường gặp ở phụ nữ. Tìm hiểu về triệu chứng, nguyên nhân, ảnh hưởng đến khả năng sinh sản và phương pháp quản lý bệnh hiệu quả.",
        consultantId: 6,
        consultantName: "Dr. Vo Thi F",
        ratings: 4.6,
        feedback: "Giúp hiểu rõ về PCOS",
        createdDate: "2023-12-18",
        isActive: true
    },
    {
        id: 12,
        title: "Sức khỏe tình dục cho người cao tuổi",
        category: "Geriatrics",
        content: "Sức khỏe tình dục không chỉ quan trọng ở tuổi trẻ. Hướng dẫn duy trì đời sống tình dục lành mạnh ở tuổi cao, xử lý các vấn đề về hormone và tâm lý.",
        consultantId: 10,
        consultantName: "Dr. Tran Van J",
        ratings: 4.1,
        feedback: "Chủ đề ít được quan tâm nhưng rất cần thiết",
        createdDate: "2023-12-15",
        isActive: true
    },
    {
        id: 13,
        title: "Viêm đường tiết niệu ở phụ nữ: Nguyên nhân và phòng ngừa",
        category: "Tiết niệu học",
        content: "Phụ nữ dễ mắc viêm đường tiết niệu hơn nam giới. Phân tích nguyên nhân, triệu chứng và các biện pháp phòng ngừa hiệu quả, bao gồm vệ sinh cá nhân và chế độ ăn uống.",
        consultantId: 11,
        consultantName: "Dr. Mai Thi K",
        ratings: 4.4,
        feedback: "Hướng dẫn thực tế và dễ áp dụng",
        createdDate: "2023-12-12",
        isActive: true
    },
    {
        id: 14,
        title: "Rối loạn cương dương: Nguyên nhân tâm lý và sinh lý",
        category: "Nam khoa",
        content: "Rối loạn cương dương có thể do nhiều nguyên nhân. Phân biệt nguyên nhân tâm lý và sinh lý, đánh giá mức độ nghiêm trọng và đưa ra phương pháp điều trị phù hợp.",
        consultantId: 3,
        consultantName: "Dr. Le Van C",
        ratings: 4.3,
        feedback: "Giúp nam giới hiểu rõ vấn đề của mình",
        createdDate: "2023-12-10",
        isActive: true
    },
    {
        id: 15,
        title: "Kế hoạch hóa gia đình: Các phương pháp tránh thai",
        category: "Kế hoạch hóa gia đình",
        content: "Tổng quan về các phương pháp tránh thai hiện đại, từ thuốc tránh thai, IUD, bao cao su đến các phương pháp tự nhiên. So sánh hiệu quả và tác dụng phụ của từng phương pháp.",
        consultantId: 12,
        consultantName: "Dr. Nguyen Thi L",
        ratings: 4.7,
        feedback: "Thông tin đầy đủ về tránh thai",
        createdDate: "2023-12-08",
        isActive: true
    },
    {
        id: 16,
        title: "Sàng lọc ung thư vú: Hướng dẫn tự khám",
        category: "Phòng chống ung thư",
        content: "Phát hiện sớm ung thư vú rất quan trọng. Hướng dẫn chi tiết cách tự khám vú tại nhà, nhận biết các dấu hiệu bất thường và lịch trình tầm soát định kỳ.",
        consultantId: 13,
        consultantName: "Dr. Phan Van M",
        ratings: 4.8,
        feedback: "Kiến thức quan trọng mọi phụ nữ cần biết",
        createdDate: "2023-12-05",
        isActive: true
    },
    {
        id: 17,
        title: "Chăm sóc sức khỏe trong chu kỳ kinh nguyệt",
        category: "Phụ khoa",
        content: "Mỗi giai đoạn trong chu kỳ kinh nguyệt có những đặc điểm riêng. Hướng dẫn chăm sóc sức khỏe, điều chỉnh hoạt động và chế độ ăn uống phù hợp với từng giai đoạn.",
        consultantId: 6,
        consultantName: "Dr. Vo Thi F",
        ratings: 4.5,
        feedback: "Giúp phụ nữ hiểu rõ hơn về cơ thể mình",
        createdDate: "2023-12-03",
        isActive: true
    },
    {
        id: 18,
        title: "Sức khỏe tâm lý nam giới: Vượt qua áp lực xã hội",
        category: "Tâm lý học",
        content: "Nam giới thường ít thể hiện cảm xúc và áp lực tâm lý. Phân tích các áp lực xã hội đối với nam giới và cách quản lý stress, duy trì sức khỏe tinh thần tích cực.",
        consultantId: 1,
        consultantName: "Dr. Nguyen Van A",
        ratings: 4.2,
        feedback: "Chủ đề ít được quan tâm nhưng rất cần thiết",
        createdDate: "2023-12-01",
        isActive: true
    },
    {
        id: 19,
        title: "Dinh dưỡng cho phụ nữ mãn kinh",
        category: "Dinh dưỡng",
        content: "Phụ nữ mãn kinh cần chế độ dinh dưỡng đặc biệt để duy trì sức khỏe. Hướng dẫn về calcium, vitamin D, phytoestrogen và các chất dinh dưỡng quan trọng khác.",
        consultantId: 2,
        consultantName: "Dr. Tran Thi B",
        ratings: 4.6,
        feedback: "Rất hữu ích cho phụ nữ trung niên",
        createdDate: "2023-11-28",
        isActive: true
    },
    {
        id: 20,
        title: "Vô sinh nam: Nguyên nhân và phương pháp điều trị",
        category: "Sức khỏe sinh sản",
        content: "Vô sinh nam chiếm 40% các trường hợp vô sinh. Phân tích các nguyên nhân từ chất lượng tinh trùng, hormone đến lối sống và các phương pháp hỗ trợ sinh sản hiện đại.",
        consultantId: 3,
        consultantName: "Dr. Le Van C",
        ratings: 4.4,
        feedback: "Thông tin quan trọng cho các cặp vợ chồng hiếm muộn",
        createdDate: "2023-11-25",
        isActive: true
    }
        ];
        setPosts(mockPosts);
        setLoading(false);
    };

    const fetchCategories = async () => {
        // Mock data - replace with actual API call
        const mockCategories = [
            { id: 1, name: "Tâm lý học", isActive: true },
            { id: 2, name: "Dinh dưỡng", isActive: true },
            { id: 3, name: "Sức khỏe", isActive: true }
        ];
        setCategories(mockCategories);
    };

    const fetchConsultants = async () => {
        // Mock data - replace with actual API call
        const mockConsultants = [
            { id: 1, name: "Dr. Nguyen Van A", specialization: "Tâm lý học" },
            { id: 2, name: "Dr. Tran Thi B", specialization: "Dinh dưỡng" },
            { id: 3, name: "Dr. Le Van C", specialization: "Sức khỏe tổng quát" }
        ];
        setConsultants(mockConsultants);
    };

    const handleAddPost = () => {
        setModalType('add');
        setFormData({
            title: '',
            category: '',
            content: '',
            consultantId: '',
            ratings: 0,
            feedback: ''
        });
        setShowModal(true);
    };

    const handleEditPost = (post) => {
        setModalType('edit');
        setSelectedPost(post);
        setFormData({
            title: post.title,
            category: post.category,
            content: post.content,
            consultantId: post.consultantId,
            ratings: post.ratings,
            feedback: post.feedback
        });
        setShowModal(true);
    };

    const handleViewPost = (post) => {
        setModalType('view');
        setSelectedPost(post);
        setShowModal(true);
    };

    const handleDeletePost = async (postId) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa bài viết này?')) {
            // API call to delete post
            setPosts(posts.filter(post => post.id !== postId));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // API call to create/update post
        setShowModal(false);
        fetchPosts(); // Refresh the list
    };

    const filteredPosts = posts.filter(post => {
        const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            post.content.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = !selectedCategory || post.category === selectedCategory;
        const matchesConsultant = !selectedConsultant || post.consultantId.toString() === selectedConsultant;
        
        return matchesSearch && matchesCategory && matchesConsultant;
    });

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Quản lý bài viết</h1>
                    <p className="text-gray-600">Quản lý tất cả bài viết từ các chuyên gia tư vấn</p>
                </div>
                <button
                    onClick={handleAddPost}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
                >
                    <Plus size={20} />
                    Thêm bài viết
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow p-4 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Tìm kiếm bài viết..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    {/* Category Filter */}
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Tất cả danh mục</option>
                        {categories.map(category => (
                            <option key={category.id} value={category.name}>
                                {category.name}
                            </option>
                        ))}
                    </select>

                    {/* Consultant Filter */}
                    <select
                        value={selectedConsultant}
                        onChange={(e) => setSelectedConsultant(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Tất cả chuyên gia</option>
                        {consultants.map(consultant => (
                            <option key={consultant.id} value={consultant.id}>
                                {consultant.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Posts Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 sticky top-0 z-10">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Bài viết
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Danh mục
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Chuyên gia
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Đánh giá
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Ngày tạo
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Trạng thái
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Thao tác
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-4 text-center">
                                        <div className="flex justify-center">
                                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredPosts.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                                        Không có bài viết nào
                                    </td>
                                </tr>
                            ) : (
                                filteredPosts.map((post) => (
                                    <tr key={post.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">
                                                    {post.title}
                                                </div>
                                                <div className="text-sm text-gray-500 truncate max-w-xs">
                                                    {post.content}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                <Tag size={12} className="mr-1" />
                                                {post.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <User size={16} className="mr-2 text-gray-400" />
                                                <span className="text-sm text-gray-900">{post.consultantName}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <Star size={16} className="text-yellow-400 mr-1" />
                                                <span className="text-sm text-gray-900">{post.ratings}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center text-sm text-gray-500">
                                                <Calendar size={16} className="mr-2" />
                                                {post.createdDate}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                post.isActive 
                                                    ? 'bg-green-200 text-green-800' 
                                                    : 'bg-red-200 text-red-800'
                                            }`}>
                                                {post.isActive ? 'Hoạt động' : 'Tạm dừng'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right text-sm font-medium">
                                            <div className="flex items-center justify-end space-x-2">
                                                <button
                                                    onClick={() => handleViewPost(post)}
                                                    className="text-blue-600 hover:text-blue-900"
                                                >
                                                    <Eye size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleEditPost(post)}
                                                    className="text-green-600 hover:text-green-900"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeletePost(post.id)}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                {/* Scroll indicator */}
                {filteredPosts.length > 8 && (
                    <div className="bg-gray-50 px-6 py-2 text-center text-sm text-gray-500">
                        Cuộn xuống để xem thêm bài viết ({filteredPosts.length} tổng cộng)
                    </div>
                )}
            </div>

            {/* Modal for Add/Edit/View Post */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">
                                {modalType === 'add' && 'Thêm bài viết mới'}
                                {modalType === 'edit' && 'Chỉnh sửa bài viết'}
                                {modalType === 'view' && 'Chi tiết bài viết'}
                            </h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {modalType === 'view' ? (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Tiêu đề
                                    </label>
                                    <p className="text-gray-900">{selectedPost?.title}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Danh mục
                                    </label>
                                    <p className="text-gray-900">{selectedPost?.category}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Chuyên gia
                                    </label>
                                    <p className="text-gray-900">{selectedPost?.consultantName}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Nội dung
                                    </label>
                                    <p className="text-gray-900 whitespace-pre-wrap">{selectedPost?.content}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Đánh giá
                                    </label>
                                    <p className="text-gray-900">{selectedPost?.ratings} ⭐</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Phản hồi
                                    </label>
                                    <p className="text-gray-900">{selectedPost?.feedback}</p>
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Tiêu đề *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Danh mục *
                                    </label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        required
                                    >
                                        <option value="">Chọn danh mục</option>
                                        {categories.map(category => (
                                            <option key={category.id} value={category.name}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Chuyên gia *
                                    </label>
                                    <select
                                        value={formData.consultantId}
                                        onChange={(e) => setFormData({...formData, consultantId: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        required
                                    >
                                        <option value="">Chọn chuyên gia</option>
                                        {consultants.map(consultant => (
                                            <option key={consultant.id} value={consultant.id}>
                                                {consultant.name} - {consultant.specialization}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Nội dung *
                                    </label>
                                    <textarea
                                        value={formData.content}
                                        onChange={(e) => setFormData({...formData, content: e.target.value})}
                                        rows={6}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Đánh giá (0-5)
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="5"
                                        step="0.1"
                                        value={formData.ratings}
                                        onChange={(e) => setFormData({...formData, ratings: parseFloat(e.target.value)})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Phản hồi
                                    </label>
                                    <textarea
                                        value={formData.feedback}
                                        onChange={(e) => setFormData({...formData, feedback: e.target.value})}
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div className="flex justify-end space-x-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                    >
                                        {modalType === 'add' ? 'Thêm' : 'Cập nhật'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}
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
                                    required
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
                                <button onClick={() => navigate('/')} className="flex items-center w-full px-4 py-2 hover:bg-gray-100 text-gray-700">
                                    <HomeIcon className="mr-2" size={18}/>View Home Page
                                </button>
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
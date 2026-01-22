import { useEffect, useState } from "react";
import registrationService from "../services/registrationService";
import authService from "../services/authService";
import { useNavigate } from "react-router-dom";

const RegistrationList = () => {
    const [items, setItems] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const user = authService.getCurrentUser();
        if (user?.role === 'admin') setIsAdmin(true);
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await registrationService.getAll();
            setItems(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Hủy đăng ký này?")) {
            try {
                await registrationService.deleteReg(id);
                fetchData();
            } catch (err) {
                alert(err.response?.data?.message || "Lỗi khi xóa");
            }
        }
    };

    const handleStatusChange = async (id, status) => {
        if (window.confirm(`Xác nhận ${status === 'Approved' ? 'DUYỆT' : 'TỪ CHỐI'} đăng ký này?`)) {
            try {
                await registrationService.updateStatus(id, status);
                fetchData();
            } catch (err) {
                alert("Lỗi cập nhật trạng thái");
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold text-gray-900">Đăng ký Sử dụng Phòng / Máy</h2>
                    <button
                        onClick={() => navigate("/registrations/new")}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    >
                        + Tạo Đăng ký mới
                    </button>
                </div>

                <div className="bg-white shadow overflow-hidden rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Người đăng ký</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Loại</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày & Ca</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nội dung / TP</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {items.map((item) => (
                                <tr key={item.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {item.User?.fullName} <br />
                                        <span className="text-xs text-gray-500">{item.User?.unit}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {item.type === 'Room' ? 'Phòng HCM' : 'Máy tính'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {item.date} <br />
                                        <span className="font-medium">{item.shift}</span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        <div className="truncate w-48" title={item.purpose}>{item.purpose}</div>
                                        <div className="text-xs text-gray-400">{item.participants}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 text-xs font-semibold rounded-full 
                      ${item.status === 'Approved' ? 'bg-green-100 text-green-800' :
                                                item.status === 'Rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                        {isAdmin && item.status === 'Pending' && (
                                            <>
                                                <button onClick={() => handleStatusChange(item.id, 'Approved')} className="text-green-600 hover:text-green-900 mr-2 font-bold">Duyệt</button>
                                                <button onClick={() => handleStatusChange(item.id, 'Rejected')} className="text-red-600 hover:text-red-900 mr-2">Từ chối</button>
                                            </>
                                        )}
                                        {(isAdmin || item.status === 'Pending') && (
                                            <button onClick={() => handleDelete(item.id)} className="text-gray-500 hover:text-gray-700">Hủy</button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {items.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="text-center p-4 text-gray-500">Chưa có đăng ký nào.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default RegistrationList;

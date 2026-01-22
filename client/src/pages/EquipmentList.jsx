import { useEffect, useState } from "react";
import equipmentService from "../services/equipmentService";
import authService from "../services/authService";
import { useNavigate } from "react-router-dom";

const EquipmentList = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const user = authService.getCurrentUser();
        if (user?.role === 'admin') setIsAdmin(true);
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await equipmentService.getAll();
            setItems(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Xóa vật chất này?")) {
            try {
                await equipmentService.remove(id);
                fetchData();
            } catch (err) {
                alert("Lỗi khi xóa!");
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold text-gray-900">Quản lý Vật chất</h2>
                    {isAdmin && (
                        <button
                            onClick={() => navigate("/equipment/new")}
                            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                        >
                            + Thêm Vật chất
                        </button>
                    )}
                </div>

                <div className="bg-white shadow overflow-hidden rounded-lg">
                    {loading ? (
                        <p className="p-4 text-center">Đang tải...</p>
                    ) : (
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mã</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tên vật chất</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Số lượng</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tình trạng</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mô tả</th>
                                    {isAdmin && <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Hành động</th>}
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {items.map((item) => (
                                    <tr key={item.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.code}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.quantity}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 text-xs font-semibold rounded-full 
                        ${item.status === 'Good' ? 'bg-green-100 text-green-800' :
                                                    item.status === 'Broken' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.description}</td>
                                        {isAdmin && (
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button onClick={() => navigate(`/equipment/edit/${item.id}`)} className="text-indigo-600 hover:text-indigo-900 mr-4">Sửa</button>
                                                <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-900">Xóa</button>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EquipmentList;

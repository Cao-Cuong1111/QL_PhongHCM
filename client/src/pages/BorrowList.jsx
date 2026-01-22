import { useEffect, useState } from "react";
import borrowReturnService from "../services/borrowReturnService";
import authService from "../services/authService";
import { useNavigate } from "react-router-dom";

const BorrowList = () => {
    const [borrows, setBorrows] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const user = authService.getCurrentUser();
        if (user?.role === 'admin') setIsAdmin(true);
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await borrowReturnService.getAllBorrows();
            setBorrows(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleReturn = async (id) => {
        if (window.confirm("Xác nhận đã trả sách?")) {
            try {
                await borrowReturnService.returnBook(id, { status: "Returned" });
                fetchData();
            } catch (err) {
                alert("Lỗi khi trả sách");
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold text-gray-900">Quản lý Mượn / Trả</h2>
                    {isAdmin && (
                        <button
                            onClick={() => navigate("/borrows/new")}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                        >
                            + Đăng ký Mượn
                        </button>
                    )}
                </div>

                <div className="bg-white shadow overflow-hidden rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Người mượn</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sách</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày mượn</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hạn trả</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                                {isAdmin && <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Hành động</th>}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {borrows.map((item) => (
                                <tr key={item.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {item.User?.fullName} <br />
                                        <span className="text-gray-500 text-xs text-xs">{item.User?.unit}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {item.Book?.title} <br />
                                        <span className="text-gray-500 text-xs">{item.Book?.code}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.borrowDate}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.dueDate}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 text-xs font-semibold rounded-full 
                      ${item.status === 'Borrowing' ? 'bg-yellow-100 text-yellow-800' :
                                                item.status === 'Returned' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    {isAdmin && (
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                            {item.status === 'Borrowing' && (
                                                <button
                                                    onClick={() => handleReturn(item.id)}
                                                    className="text-blue-600 hover:text-blue-900 font-medium"
                                                >
                                                    Xác nhận Trả
                                                </button>
                                            )}
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {borrows.length === 0 && <p className="p-4 text-center text-gray-500">Chưa có dữ liệu mượn trả.</p>}
                </div>
            </div>
        </div>
    );
};

export default BorrowList;

import { useState, useEffect } from "react";
import broadcastService from "../services/broadcastService";
import authService from "../services/authService";

const BroadcastManager = () => {
    const [items, setItems] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false);
    const [newBroadcast, setNewBroadcast] = useState({
        title: "",
        startTime: "",
        days: "Daily",
        audio: null
    });

    useEffect(() => {
        const user = authService.getCurrentUser();
        if (user?.role === 'admin') setIsAdmin(true);
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await broadcastService.getAll();
            setItems(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Xóa bài phát thanh này?")) {
            await broadcastService.remove(id);
            fetchData();
        }
    };

    const handleToggle = async (id) => {
        await broadcastService.toggle(id);
        fetchData();
    };

    const handleFileChange = (e) => {
        setNewBroadcast({ ...newBroadcast, audio: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', newBroadcast.title);
        formData.append('startTime', newBroadcast.startTime); // Expect HH:mm format
        formData.append('days', newBroadcast.days);
        formData.append('audio', newBroadcast.audio);
        formData.append('isActive', true);

        try {
            await broadcastService.create(formData);
            setNewBroadcast({ title: "", startTime: "", days: "Daily", audio: null });
            fetchData();
            alert("Thêm thành công!");
        } catch (err) {
            alert("Lỗi thêm bài: " + (err.response?.data?.message || err.message));
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Quản lý Truyền thanh Nội bộ</h2>

                {isAdmin && (
                    <div className="bg-white p-6 rounded-lg shadow mb-8">
                        <h3 className="text-lg font-bold mb-4">Thêm Bài phát mới</h3>
                        <form onSubmit={handleSubmit} className="flex gap-4 items-end flex-wrap">
                            <div>
                                <label className="block text-sm font-medium">Tiêu đề / Tên bài</label>
                                <input
                                    type="text"
                                    required
                                    className="border p-2 rounded w-64"
                                    value={newBroadcast.title}
                                    onChange={(e) => setNewBroadcast({ ...newBroadcast, title: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Giờ phát (HH:mm)</label>
                                <input
                                    type="time"
                                    required
                                    className="border p-2 rounded"
                                    value={newBroadcast.startTime}
                                    onChange={(e) => setNewBroadcast({ ...newBroadcast, startTime: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">File Âm thanh</label>
                                <input
                                    type="file"
                                    accept="audio/*"
                                    required
                                    className="border p-1 rounded"
                                    onChange={handleFileChange}
                                />
                            </div>
                            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded mb-0.5 hover:bg-blue-700">Lưu</button>
                        </form>
                    </div>
                )}

                <div className="bg-white shadow overflow-hidden rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Giờ phát</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tên bài</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">File</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                                {isAdmin && <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Hành động</th>}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {items.map((item) => (
                                <tr key={item.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{item.startTime}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.title}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate max-w-xs">{item.audioFile}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span
                                            className={`px-2 text-xs font-semibold rounded-full cursor-pointer ${item.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}
                                            onClick={() => isAdmin && handleToggle(item.id)}
                                        >
                                            {item.isActive ? 'Đang bật' : 'Tắt'}
                                        </span>
                                    </td>
                                    {isAdmin && (
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                            <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-700">Xóa</button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                            {items.length === 0 && <tr><td colSpan="5" className="p-4 text-center">Chưa có bài phát nào.</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default BroadcastManager;

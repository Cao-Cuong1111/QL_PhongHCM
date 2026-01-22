import { useState, useEffect } from "react";
import activityPlanService from "../services/activityPlanService";
import authService from "../services/authService";
import { useNavigate } from "react-router-dom";

const ActivityPlanList = () => {
    const [plans, setPlans] = useState([]);
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [year, setYear] = useState(new Date().getFullYear());
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const user = authService.getCurrentUser();
        if (user?.role === 'admin') setIsAdmin(true);
        fetchData();
    }, [month, year]);

    const fetchData = async () => {
        try {
            const res = await activityPlanService.getAll({ month, year });
            setPlans(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Xóa nội dung này?")) {
            await activityPlanService.remove(id);
            fetchData();
        }
    };

    const handleExport = async () => {
        try {
            const res = await activityPlanService.exportDocx({ month, year });
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `ChuongTrinhThang${month}_${year}.docx`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            alert("Lỗi xuất file! Có thể chưa có dữ liệu.");
        }
    };

    // Group by 'group' field
    const grouped = {};
    plans.forEach(p => {
        if (!grouped[p.group]) grouped[p.group] = [];
        grouped[p.group].push(p);
    });

    // Sort groups by Roman numerals if possible, but they are strings "I. Abc", so string sort works roughly OK.
    const sortedGroups = Object.keys(grouped).sort();

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                    <h2 className="text-3xl font-bold text-gray-900">Chương trình Hoạt động Tháng</h2>

                    <div className="flex gap-2 items-center">
                        <label>Tháng:</label>
                        <select value={month} onChange={e => setMonth(e.target.value)} className="border p-1">
                            {[...Array(12)].map((_, i) => <option key={i + 1} value={i + 1}>{i + 1}</option>)}
                        </select>
                        <label>Năm:</label>
                        <input type="number" value={year} onChange={e => setYear(e.target.value)} className="border p-1 w-20" />

                        <button onClick={fetchData} className="bg-gray-200 px-3 py-1 rounded">Xem</button>
                        <button onClick={handleExport} className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700">Xuất Word</button>

                        {isAdmin && (
                            <button
                                onClick={() => navigate("/activity-plans/new")}
                                className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                            >
                                + Thêm Nội dung
                            </button>
                        )}
                    </div>
                </div>

                <div className="bg-white shadow overflow-hidden rounded-lg p-4">
                    <table className="min-w-full border-collapse border border-gray-400 text-sm">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border border-gray-400 p-2 w-10">TT</th>
                                <th className="border border-gray-400 p-2">Nội dung - biện pháp</th>
                                <th className="border border-gray-400 p-2 w-24">Thời gian</th>
                                <th className="border border-gray-400 p-2">Thành phần</th>
                                <th className="border border-gray-400 p-2">Địa điểm</th>
                                <th className="border border-gray-400 p-2">Phụ trách</th>
                                {isAdmin && <th className="border border-gray-400 p-2">Action</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {sortedGroups.length === 0 ? (
                                <tr><td colSpan={isAdmin ? 7 : 6} className="text-center p-4">Chưa có chương trình cho tháng này.</td></tr>
                            ) : (
                                sortedGroups.map(groupTitle => (
                                    <>
                                        {/* Group Header Row */}
                                        <tr key={groupTitle} className="bg-gray-200 font-bold">
                                            <td className="border border-gray-400 p-2">{groupTitle.split('.')[0]}</td>
                                            <td className="border border-gray-400 p-2" colSpan={isAdmin ? 6 : 5}>
                                                {groupTitle.substring(groupTitle.indexOf('.') + 1).trim()}
                                            </td>
                                        </tr>
                                        {/* Items */}
                                        {grouped[groupTitle].map((item, index) => (
                                            <tr key={item.id} className="hover:bg-gray-50">
                                                <td className="border border-gray-400 p-2 text-center">{index + 1}</td>
                                                <td className="border border-gray-400 p-2">{item.content}</td>
                                                <td className="border border-gray-400 p-2 text-center">{item.time}</td>
                                                <td className="border border-gray-400 p-2">{item.participants}</td>
                                                <td className="border border-gray-400 p-2 text-center">{item.location}</td>
                                                <td className="border border-gray-400 p-2 text-center">{item.personInCharge}</td>
                                                {isAdmin && (
                                                    <td className="border border-gray-400 p-2 text-center">
                                                        <button onClick={() => handleDelete(item.id)} className="text-red-500 text-xs">Xóa</button>
                                                    </td>
                                                )}
                                            </tr>
                                        ))}
                                    </>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ActivityPlanList;

import { useState, useEffect } from "react";
import scheduleService from "../services/scheduleService";
import authService from "../services/authService";
import { useNavigate } from "react-router-dom";

const ScheduleList = () => {
    const [schedules, setSchedules] = useState([]);
    const [week, setWeek] = useState(getCurrentWeek());
    const [year, setYear] = useState(new Date().getFullYear());
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate();

    function getCurrentWeek() {
        const d = new Date();
        d.setHours(0, 0, 0, 0);
        d.setDate(d.getDate() + 4 - (d.getDay() || 7));
        const yearStart = new Date(d.getFullYear(), 0, 1);
        const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
        return weekNo;
    }

    useEffect(() => {
        const user = authService.getCurrentUser();
        if (user?.role === 'admin') setIsAdmin(true);
        fetchData();
    }, [week, year]);

    const fetchData = async () => {
        try {
            const res = await scheduleService.getAll({ weekNumber: week, year: year });
            setSchedules(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleExport = async () => {
        try {
            const res = await scheduleService.exportDocx({ weekNumber: week, year: year });
            // Create blob link to download
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `LichTuan${week}_${year}.docx`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            alert("Lỗi xuất file! Có thể chưa có dữ liệu.");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Xóa lịch này?")) {
            await scheduleService.remove(id);
            fetchData();
        }
    };

    // Helper to group by date for display
    const grouped = {};
    schedules.forEach(s => {
        if (!grouped[s.date]) grouped[s.date] = [];
        grouped[s.date].push(s);
    });

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                    <h2 className="text-3xl font-bold text-gray-900">Lịch Hoạt động</h2>

                    <div className="flex gap-2 items-center">
                        <label>Tuần:</label>
                        <input type="number" value={week} onChange={e => setWeek(e.target.value)} className="border p-1 w-16" />
                        <label>Năm:</label>
                        <input type="number" value={year} onChange={e => setYear(e.target.value)} className="border p-1 w-20" />

                        <button onClick={fetchData} className="bg-gray-200 px-3 py-1 rounded">Xem</button>
                        <button onClick={handleExport} className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700">Xuất Word</button>

                        {isAdmin && (
                            <button
                                onClick={() => navigate("/schedules/new")}
                                className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                            >
                                + Thêm Lịch
                            </button>
                        )}
                    </div>
                </div>

                <div className="bg-white shadow overflow-hidden rounded-lg p-4">
                    {/* Custom Table Layout matching the image */}
                    <table className="min-w-full border-collapse border border-gray-400">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border border-gray-400 p-2">Thứ / Ngày</th>
                                <th className="border border-gray-400 p-2">Nội dung, biện pháp</th>
                                <th className="border border-gray-400 p-2">Thời gian</th>
                                <th className="border border-gray-400 p-2">Thành phần</th>
                                <th className="border border-gray-400 p-2">Địa điểm</th>
                                <th className="border border-gray-400 p-2">Phụ trách</th>
                                {isAdmin && <th className="border border-gray-400 p-2">Action</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {Object.keys(grouped).length === 0 ? (
                                <tr><td colSpan={isAdmin ? 7 : 6} className="text-center p-4">Chưa có lịch cho tuần này.</td></tr>
                            ) : (
                                Object.keys(grouped).map(date => {
                                    const items = grouped[date];
                                    const dateObj = new Date(date);
                                    const dayName = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'][dateObj.getDay()];

                                    return items.map((item, index) => (
                                        <tr key={item.id} className="hover:bg-gray-50">
                                            {index === 0 && (
                                                <td className="border border-gray-400 p-2 align-middle text-center font-bold bg-gray-50" rowSpan={items.length}>
                                                    {dayName}<br />
                                                    {dateObj.getDate()}/{dateObj.getMonth() + 1}
                                                </td>
                                            )}
                                            <td className="border border-gray-400 p-2">{item.content}</td>
                                            <td className="border border-gray-400 p-2 text-center">{item.time}</td>
                                            <td className="border border-gray-400 p-2">{item.participants}</td>
                                            <td className="border border-gray-400 p-2 text-center">{item.location}</td>
                                            <td className="border border-gray-400 p-2 text-center">{item.personInCharge}</td>
                                            {isAdmin && (
                                                <td className="border border-gray-400 p-2 text-center">
                                                    <button onClick={() => handleDelete(item.id)} className="text-red-500 text-sm">Xóa</button>
                                                </td>
                                            )}
                                        </tr>
                                    ));
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ScheduleList;

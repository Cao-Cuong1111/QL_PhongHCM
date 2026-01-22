import { useEffect, useState } from "react";
import reportService from "../services/reportService";

const ReportDashboard = () => {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await reportService.getSummary();
                setStats(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchStats();
    }, []);

    if (!stats) return <div className="p-8 text-center">Đang tải báo cáo...</div>;

    const cards = [
        { label: "Tổng số Sách", value: stats.totalBooks, color: "bg-blue-500", icon: "📚" },
        { label: "Vật chất/Thiết bị", value: stats.totalEquipment, color: "bg-yellow-500", icon: "🖥️" },
        { label: "Lượt mượn tháng này", value: stats.monthBorrows, color: "bg-green-500", icon: "📖" },
        { label: "Sách quá hạn", value: stats.overdueBooks, color: "bg-red-500", icon: "⚠️" },
        { label: "Thiết bị hỏng/Bảo trì", value: stats.brokenEquipment, color: "bg-orange-500", icon: "🛠️" },
        { label: "Đăng ký Chờ duyệt", value: stats.pendingRegistrations, color: "bg-purple-500", icon: "⏳" },
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Báo cáo Tổng hợp</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {cards.map((card, index) => (
                        <div key={index} className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className={`flex-shrink-0 rounded-md p-3 ${card.color}`}>
                                        <span className="text-2xl text-white">{card.icon}</span>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dt className="text-sm font-medium text-gray-500 truncate">
                                            {card.label}
                                        </dt>
                                        <dd>
                                            <div className="text-lg font-bold text-gray-900">
                                                {card.value}
                                            </div>
                                        </dd>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Additional Details Table or Charts could go here */}
                <div className="bg-white shadow rounded-lg p-6">
                    <h3 className="text-lg font-bold mb-4">Thông tin hệ thống</h3>
                    <p className="text-gray-600">Tổng số người dùng trong hệ thống: <strong>{stats.totalUsers}</strong></p>
                    <p className="text-gray-600 mt-2">Dữ liệu được thống kê tính đến thời điểm hiện tại.</p>
                </div>
            </div>
        </div>
    );
};

export default ReportDashboard;

import { Link, useLocation } from "react-router-dom";
import authService from "../services/authService";
import { useEffect, useState } from "react";

const Sidebar = () => {
    const location = useLocation();
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const user = authService.getCurrentUser();
        if (user) {
            setIsAdmin(user.role === 'admin');
        }
    }, []);

    const menuItems = [
        {
            path: "/dashboard",
            icon: "🏠",
            label: "Trang chủ",
            adminOnly: false
        },
        {
            path: "/books",
            icon: "📚",
            label: "Quản lý Tài liệu",
            adminOnly: false
        },
        {
            path: "/borrows",
            icon: "📖",
            label: "Đăng ký & Trả sách",
            adminOnly: false
        },
        {
            path: "/equipment",
            icon: "🖥️",
            label: "Quản lý Vật chất",
            adminOnly: false
        },
        {
            path: "/registrations",
            icon: "📝",
            label: "Đăng ký Sử dụng",
            adminOnly: false
        },
        {
            path: "/schedules",
            icon: "📅",
            label: "Lịch Tuần & Chương trình",
            adminOnly: false
        },
        {
            path: "/activity-plans",
            icon: "🗓️",
            label: "Chương trình Tháng",
            adminOnly: false
        },
        {
            path: "/broadcasts",
            icon: "📢",
            label: "Truyền thanh Nội bộ",
            adminOnly: false
        },
        {
            path: "/users",
            icon: "👥",
            label: "Quản lý Người dùng",
            adminOnly: true
        },
        {
            path: "/reports",
            icon: "📊",
            label: "Báo cáo Tổng hợp",
            adminOnly: false
        }
    ];

    const visibleMenuItems = menuItems.filter(item => !item.adminOnly || isAdmin);

    return (
        <div className="h-screen w-64 bg-gradient-to-b from-blue-900 to-blue-800 text-white flex flex-col shadow-2xl">
            {/* Logo Section */}
            <div className="p-6 text-center border-b border-blue-700">
                <div className="mb-4 flex justify-center">
                    <img
                        src="/logoV4.jpg"
                        alt="Logo Phòng HCM"
                        className="w-24 h-24 object-contain rounded-lg bg-white p-2 shadow-lg"
                    />
                </div>
                <h2 className="text-lg font-bold text-white">
                    LỮ ĐOÀN 957
                </h2>
            </div>
            {/* Menu Items */}
            <nav className="flex-1 overflow-y-auto py-4">
                <ul className="space-y-1 px-3">
                    {visibleMenuItems.map((item) => {
                        const isActive = location.pathname === item.path ||
                            (item.path !== "/dashboard" && location.pathname.startsWith(item.path));

                        return (
                            <li key={item.path}>
                                <Link
                                    to={item.path}
                                    className={`
                                        flex items-center px-4 py-3 rounded-lg transition-all duration-200
                                        ${isActive
                                            ? 'bg-white text-blue-900 shadow-lg font-medium'
                                            : 'text-blue-100 hover:bg-blue-700 hover:text-white hover:shadow-md'
                                        }
                                    `}
                                >
                                    <span className="text-xl mr-3">{item.icon}</span>
                                    <span className="text-sm">{item.label}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-blue-700 text-center">
                <p className="text-xs text-blue-300">© 2026 Phòng HCM</p>
            </div>
        </div>
    );
};

export default Sidebar;

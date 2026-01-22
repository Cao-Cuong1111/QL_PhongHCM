import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";
import Sidebar from "./Sidebar";
import AutoPlayer from "./AutoPlayer";

const AdminLayout = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(undefined);
    const navigate = useNavigate();

    useEffect(() => {
        const user = authService.getCurrentUser();

        if (user) {
            setCurrentUser(user);
        } else {
            navigate("/login");
        }
    }, [navigate]);

    const handleLogout = () => {
        authService.logout();
        navigate("/login");
    };

    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden">
            {/* Auto Player Component */}
            <AutoPlayer />

            {/* Sidebar */}
            <Sidebar />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="bg-white shadow-md z-10">
                    <div className="px-6 py-4 flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-blue-600">
                                PHẦN MỀM QUẢN LÝ PHÒNG HỒ CHÍ MINH
                            </h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-gray-700">
                                Xin chào, <strong className="text-blue-600">{currentUser?.fullName}</strong>
                            </span>
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 shadow-md hover:shadow-lg"
                            >
                                Đăng xuất
                            </button>
                        </div>
                    </div>
                </header>

                {/* Content */}
                <main className="flex-1 overflow-y-auto p-6">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;

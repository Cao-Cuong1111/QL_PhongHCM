import { useEffect, useState } from "react";
import authService from "../services/authService";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
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

    return (
        <div
            className="relative w-full h-full flex items-center justify-center overflow-hidden"
            style={{
                minHeight: 'calc(100vh - 200px)'
            }}
        >
            {/* Background Image with Blur */}
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                    backgroundImage: 'url(/hero-bg.png)',
                    filter: 'blur(3px)',
                    transform: 'scale(1.1)'
                }}
            />

            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-40" />

            {/* Welcome Text */}
            <div className="relative z-10 text-center px-8">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-2xl">
                    PHẦN MỀM QUẢN LÝ PHÒNG HỒ CHÍ MINH
                </h2>
                <h3 className="text-3xl md:text-4xl font-bold text-yellow-400 drop-shadow-2xl">
                    LỮ ĐOÀN 957
                </h3>

                {/* Decorative Line */}
                <div className="mt-8 flex justify-center">
                    <div className="w-32 h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent"></div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import registrationService from "../services/registrationService";

const RegistrationForm = () => {
    const [formData, setFormData] = useState({
        type: "Room",
        date: "",
        shift: "Sáng",
        purpose: "",
        participants: ""
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await registrationService.create(formData);
            navigate("/registrations");
        } catch (err) {
            setError(err.response?.data?.message || "Lỗi tạo đăng ký");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow">
                <h2 className="text-2xl font-bold mb-6">Đăng ký mới</h2>
                {error && <div className="text-red-500 mb-4">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">Loại đăng ký</label>
                        <select
                            name="type"
                            className="mt-1 block w-full border rounded-md p-2"
                            value={formData.type}
                            onChange={handleChange}
                        >
                            <option value="Room">Mượn Phòng Hồ Chí Minh</option>
                            <option value="Computer">Mượn Máy tính</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Ngày sử dụng</label>
                        <input
                            type="date"
                            name="date"
                            required
                            className="mt-1 block w-full border rounded-md p-2"
                            value={formData.date}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Ca / Thời gian</label>
                        <input
                            type="text"
                            name="shift"
                            placeholder="VD: Sáng (8h-11h), Chiều (14h-16h)"
                            required
                            className="mt-1 block w-full border rounded-md p-2"
                            value={formData.shift}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Nội dung / Mục đích</label>
                        <textarea
                            name="purpose"
                            required
                            className="mt-1 block w-full border rounded-md p-2"
                            rows="3"
                            value={formData.purpose}
                            onChange={handleChange}
                        ></textarea>
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Thành phần (Đơn vị / Số lượng)</label>
                        <input
                            type="text"
                            name="participants"
                            placeholder="VD: b1, 15 đồng chí"
                            className="mt-1 block w-full border rounded-md p-2"
                            value={formData.participants}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={() => navigate("/registrations")}
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                        >
                            Hủy bỏ
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
                        >
                            {loading ? "Đang gửi..." : "Gửi đăng ký"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegistrationForm;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import activityPlanService from "../services/activityPlanService";

const ActivityPlanForm = () => {
    const [formData, setFormData] = useState({
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        group: "I. Hoạt động thông tin, tuyên truyền cổ động", // Default
        content: "",
        time: "",
        participants: "",
        location: "",
        personInCharge: "",
        note: ""
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const groups = [
        "I. Hoạt động thông tin, tuyên truyền cổ động",
        "II. Hoạt động giáo dục truyền thống",
        "III. Hoạt động sách báo nội bộ",
        "IV. Hoạt động văn nghệ quần chúng",
        "V. Hoạt động xây dựng MTVH, TDTT, vui chơi giải trí",
    ];

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await activityPlanService.create(formData);
            navigate("/activity-plans");
        } catch (err) {
            alert("Lỗi khi thêm nội dung");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow">
                <h2 className="text-2xl font-bold mb-6">Thêm Nội dung Chương trình Tháng</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-medium">Tháng</label>
                            <select name="month" value={formData.month} onChange={handleChange} className="mt-1 block w-full border rounded-md p-2">
                                {[...Array(12)].map((_, i) => <option key={i + 1} value={i + 1}>{i + 1}</option>)}
                            </select>
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium">Năm</label>
                            <input
                                type="number"
                                name="year"
                                required
                                className="mt-1 block w-full border rounded-md p-2"
                                value={formData.year}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Nhóm Hoạt động</label>
                        <select
                            name="group"
                            className="mt-1 block w-full border rounded-md p-2"
                            value={formData.group}
                            onChange={handleChange}
                        >
                            {groups.map(g => <option key={g} value={g}>{g}</option>)}
                            <option value="Khác">Khác</option>
                        </select>
                        {formData.group === 'Khác' && (
                            <input
                                type="text"
                                name="group"
                                placeholder="Nhập tên nhóm..."
                                className="mt-2 block w-full border rounded-md p-2"
                                onChange={handleChange}
                            />
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Nội dung - biện pháp</label>
                        <textarea
                            name="content"
                            required
                            className="mt-1 block w-full border rounded-md p-2"
                            rows="3"
                            value={formData.content}
                            onChange={handleChange}
                        ></textarea>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium">Thời gian (VD: Sáng thứ 2)</label>
                            <input
                                type="text"
                                name="time"
                                className="mt-1 block w-full border rounded-md p-2"
                                value={formData.time}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Thành phần</label>
                            <input
                                type="text"
                                name="participants"
                                className="mt-1 block w-full border rounded-md p-2"
                                value={formData.participants}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium">Địa điểm</label>
                            <input
                                type="text"
                                name="location"
                                className="mt-1 block w-full border rounded-md p-2"
                                value={formData.location}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Người Phụ trách</label>
                            <input
                                type="text"
                                name="personInCharge"
                                className="mt-1 block w-full border rounded-md p-2"
                                value={formData.personInCharge}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Ghi chú</label>
                        <input
                            type="text"
                            name="note"
                            className="mt-1 block w-full border rounded-md p-2"
                            value={formData.note}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={() => navigate("/activity-plans")}
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                        >
                            Hủy bỏ
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
                        >
                            Lưu Nội dung
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ActivityPlanForm;

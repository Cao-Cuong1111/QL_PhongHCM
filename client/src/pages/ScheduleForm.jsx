import { useState } from "react";
import { useNavigate } from "react-router-dom";
import scheduleService from "../services/scheduleService";

const ScheduleForm = () => {
    // Helper to get current week/year for defaults
    function getWeekNumber(d) {
        d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
        d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
        var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
        var weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
        return weekNo;
    }

    const [formData, setFormData] = useState({
        weekNumber: getWeekNumber(new Date()),
        year: new Date().getFullYear(),
        date: new Date().toISOString().split('T')[0],
        time: "",
        content: "",
        participants: "",
        location: "Phòng HCM",
        personInCharge: "",
        note: ""
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await scheduleService.create(formData);
            navigate("/schedules");
        } catch (err) {
            alert("Lỗi khi tạo lịch");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow">
                <h2 className="text-2xl font-bold mb-6">Thêm Lịch Hoạt động</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-medium">Tuần</label>
                            <input
                                type="number"
                                name="weekNumber"
                                required
                                className="mt-1 block w-full border rounded-md p-2"
                                value={formData.weekNumber}
                                onChange={handleChange}
                            />
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

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium">Ngày</label>
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
                            <label className="block text-sm font-medium">Thời gian (VD: 07h00 - 08h00)</label>
                            <input
                                type="text"
                                name="time"
                                required
                                className="mt-1 block w-full border rounded-md p-2"
                                value={formData.time}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Nội dung, biện pháp</label>
                        <textarea
                            name="content"
                            required
                            className="mt-1 block w-full border rounded-md p-2"
                            rows="3"
                            value={formData.content}
                            onChange={handleChange}
                        ></textarea>
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Thành phần tham gia</label>
                        <input
                            type="text"
                            name="participants"
                            className="mt-1 block w-full border rounded-md p-2"
                            value={formData.participants}
                            onChange={handleChange}
                        />
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
                            <label className="block text-sm font-medium">Phụ trách</label>
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
                            onClick={() => navigate("/schedules")}
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                        >
                            Hủy bỏ
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
                        >
                            Lưu Lịch
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ScheduleForm;

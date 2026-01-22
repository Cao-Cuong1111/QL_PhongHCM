import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import equipmentService from "../services/equipmentService";

const EquipmentForm = () => {
    const [formData, setFormData] = useState({
        code: "",
        name: "",
        quantity: 1,
        status: "Good",
        description: ""
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;

    useEffect(() => {
        if (isEdit) {
            fetchData(id);
        }
    }, [id]);

    const fetchData = async (itemId) => {
        try {
            const res = await equipmentService.getOne(itemId);
            setFormData(res.data);
        } catch (err) {
            setError("Không thể tải thông tin.");
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isEdit) await equipmentService.update(id, formData);
            else await equipmentService.create(formData);
            navigate("/equipment");
        } catch (err) {
            setError(err.response?.data?.message || "Lỗi lưu dữ liệu.");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow">
                <h2 className="text-2xl font-bold mb-6">{isEdit ? "Cập nhật Vật chất" : "Thêm Vật chất"}</h2>
                {error && <div className="text-red-500 mb-4">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">Mã vật chất (Code)</label>
                        <input
                            type="text"
                            name="code"
                            required
                            className="mt-1 block w-full border rounded-md p-2"
                            value={formData.code}
                            onChange={handleChange}
                            disabled={isEdit}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Tên vật chất</label>
                        <input
                            type="text"
                            name="name"
                            required
                            className="mt-1 block w-full border rounded-md p-2"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Số lượng</label>
                        <input
                            type="number"
                            name="quantity"
                            required
                            min="1"
                            className="mt-1 block w-full border rounded-md p-2"
                            value={formData.quantity}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Tình trạng</label>
                        <select
                            name="status"
                            className="mt-1 block w-full border rounded-md p-2"
                            value={formData.status}
                            onChange={handleChange}
                        >
                            <option value="Good">Tốt</option>
                            <option value="Broken">Hỏng</option>
                            <option value="Maintenance">Bảo trì</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Mô tả / Ghi chú</label>
                        <textarea
                            name="description"
                            className="mt-1 block w-full border rounded-md p-2"
                            rows="3"
                            value={formData.description}
                            onChange={handleChange}
                        ></textarea>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={() => navigate("/equipment")}
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                        >
                            Hủy bỏ
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
                        >
                            {loading ? "Đang lưu..." : "Lưu"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EquipmentForm;

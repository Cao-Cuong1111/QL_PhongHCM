import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import userService from "../services/userService";

const UserForm = () => {
    const [formData, setFormData] = useState({
        username: "",
        password: "", // Only required for new users
        fullName: "",
        role: "user",
        unit: "",
        rank: ""
    });
    const [loading, setLoading] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();
    const [isEdit, setIsEdit] = useState(false);

    useEffect(() => {
        if (id) {
            setIsEdit(true);
            fetchUser(id);
        }
    }, [id]);

    const fetchUser = async (userId) => {
        try {
            const res = await userService.getOne(userId);
            const { username, fullName, role, unit, rank } = res.data;
            setFormData({ username, fullName, role, unit, rank, password: "" }); // Don't fill password
        } catch (error) {
            console.error("Error fetching user:", error);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isEdit) {
                await userService.update(id, formData);
            } else {
                await userService.create(formData);
            }
            navigate("/users");
        } catch (error) {
            alert("Lỗi lưu người dùng: " + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow">
                <h2 className="text-2xl font-bold mb-6 text-center">
                    {isEdit ? "Cập nhật Người dùng" : "Thêm Người dùng mới"}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Tên đăng nhập</label>
                        <input
                            type="text"
                            name="username"
                            required
                            disabled={isEdit} // Cannot change username
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2 bg-gray-50"
                            value={formData.username}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            {isEdit ? "Mật khẩu mới (Để trống nếu không đổi)" : "Mật khẩu"}
                        </label>
                        <input
                            type="password"
                            name="password"
                            required={!isEdit}
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Họ và Tên</label>
                        <input
                            type="text"
                            name="fullName"
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                            value={formData.fullName}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Cấp bậc</label>
                            <input
                                type="text"
                                name="rank"
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                value={formData.rank}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Đơn vị</label>
                            <input
                                type="text"
                                name="unit"
                                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                                value={formData.unit}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Vai trò</label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        >
                            <option value="user">User (Người dùng)</option>
                            <option value="admin">Admin (Quản trị)</option>
                        </select>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={() => navigate("/users")}
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
                        >
                            {loading ? "Đang xử lý..." : "Lưu"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserForm;

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import bookService from "../services/bookService";
import authService from "../services/authService";
import QRScanner from "../components/QRScanner";
import borrowReturnService from "../services/borrowReturnService";
import axios from "axios"; // Direct call if userService not ready

const BorrowForm = () => {
    const [books, setBooks] = useState([]);
    const [users, setUsers] = useState([]); // Simplified: List all users (In real app, search by name/unit)
    const [formData, setFormData] = useState({
        userId: "",
        bookId: "",
        dueDate: "",
        note: "",
    });
    const [showScanner, setShowScanner] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetchBooks();
        fetchUsers(); // Temporary: fetch all users for dropdown
    }, []);

    const fetchBooks = async () => {
        try {
            const res = await bookService.getAllBooks();
            setBooks(res.data.filter(b => b.quantity > 0)); // Only show available books
        } catch (err) {
            console.error(err);
        }
    };

    const fetchUsers = async () => {
        // We don't have a userService yet, let's make a quick direct call or mock.
        // Ideally we should add user list API. For now, assuming Admin can input UserID or we list all.
        // Let's implement a quick user fetch in this component for now if API exists.
        // Wait, we didn't implement User List API for Admin. 
        // Let's assume Admin enters User ID or Username manually for now OR I add User List API quickly later.
        // Hack: I'll use a simple text input for User ID first to save time, or I can add User List to AuthController?
        // Let's stick to simple text input for `userId` (ID of the user in DB). 
        // BETTER: Let's create a User Search or just List All Users endpoint in Auth/User Controller.
        // For this step, I will skip fetching users and ask Admin to enter User ID (Visual debt).
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleQRScan = (scannedCode) => {
        console.log("Scanned QR code:", scannedCode);
        // Find the book by code in our list
        const foundBook = books.find(b => b.code === scannedCode);
        if (foundBook) {
            setFormData(prev => ({ ...prev, bookId: foundBook.id }));
            setShowScanner(false);
        } else {
            alert(`Không tìm thấy sách có mã: ${scannedCode}`);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            await borrowReturnService.borrowBook(formData);
            navigate("/borrows");
        } catch (err) {
            setError(err.response?.data?.message || "Lỗi khi mượn sách");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow">
                <h2 className="text-2xl font-bold mb-6">Đăng ký Mượn Sách</h2>
                {error && <div className="text-red-500 mb-4">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <label className="block text-sm font-medium">Chọn Sách</label>
                            <button
                                type="button"
                                onClick={() => setShowScanner(true)}
                                className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1"
                            >
                                📷 Quét mã QR
                            </button>
                        </div>
                        <select
                            name="bookId"
                            required
                            className="mt-1 block w-full border rounded-md p-2"
                            onChange={handleChange}
                        >
                            <option value="">-- Chọn sách --</option>
                            {books.map((b) => (
                                <option key={b.id} value={b.id}>
                                    {b.code} - {b.title} (Còn: {b.quantity})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium">ID Người mượn</label>
                        <input
                            type="number"
                            name="userId"
                            required
                            placeholder="Nhập ID User (Xem trong DB hoặc User List)"
                            className="mt-1 block w-full border rounded-md p-2"
                            onChange={handleChange}
                        />
                        <p className="text-xs text-gray-500 mt-1">* Tạm thời nhập ID (số) của user.</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Hạn trả</label>
                        <input
                            type="date"
                            name="dueDate"
                            required
                            className="mt-1 block w-full border rounded-md p-2"
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Ghi chú</label>
                        <textarea
                            name="note"
                            className="mt-1 block w-full border rounded-md p-2"
                            rows="3"
                            onChange={handleChange}
                        ></textarea>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
                    >
                        {loading ? "Đang xử lý..." : "Xác nhận Mượn"}
                    </button>
                </form>
            </div>

            {/* QR Scanner Modal */}
            {showScanner && (
                <QRScanner
                    onScan={handleQRScan}
                    onClose={() => setShowScanner(false)}
                />
            )}
        </div>
    );
};

export default BorrowForm;

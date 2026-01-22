import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import bookService from "../services/bookService";
import QRGenerator from "../components/QRGenerator";
import QRScanner from "../components/QRScanner";

const BookForm = () => {
    const [book, setBook] = useState({
        code: "",
        title: "",
        category: "Sách chính trị",
        author: "",
        publishYear: new Date().getFullYear(),
        quantity: 1,
        status: "Good",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showScanner, setShowScanner] = useState(false);
    const { id } = useParams(); // If id exists, it's Edit mode
    const navigate = useNavigate();
    const isEditMode = !!id;

    useEffect(() => {
        if (isEditMode) {
            fetchBook(id);
        }
    }, [id]);

    const fetchBook = async (bookId) => {
        try {
            const response = await bookService.getBook(bookId);
            setBook(response.data);
        } catch (err) {
            setError("Không tải được thông tin sách.");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setBook((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleQRScan = (scannedCode) => {
        setBook((prev) => ({
            ...prev,
            code: scannedCode,
        }));
        setShowScanner(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            if (isEditMode) {
                await bookService.updateBook(id, book);
            } else {
                await bookService.createBook(book);
            }
            navigate("/books");
        } catch (err) {
            const msg = err.response?.data?.message || "Có lỗi xảy ra.";
            setError(msg);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                        {isEditMode ? "Cập nhật Sách" : "Thêm Sách mới"}
                    </h2>

                    {error && (
                        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                            {error}
                        </div>
                    )}

                    {/* QR Code Display - Show in Edit Mode or after entering code */}
                    {book.code && (
                        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3 text-center">
                                Mã QR cho sách này
                            </h3>
                            <QRGenerator data={book.code} size={200} />
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="block text-sm font-medium text-gray-700">Mã sách</label>
                                {!isEditMode && (
                                    <button
                                        type="button"
                                        onClick={() => setShowScanner(true)}
                                        className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1"
                                    >
                                        📷 Quét mã
                                    </button>
                                )}
                            </div>
                            <input
                                type="text"
                                name="code"
                                required
                                className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                value={book.code}
                                onChange={handleChange}
                                disabled={isEditMode} // Usually code shouldn't change
                                placeholder="Nhập hoặc quét mã sách..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Tên sách / Tài liệu</label>
                            <input
                                type="text"
                                name="title"
                                required
                                className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                value={book.title}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Thể loại</label>
                                <select
                                    name="category"
                                    className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    value={book.category}
                                    onChange={handleChange}
                                >
                                    <option value="Sách chính trị">Sách chính trị</option>
                                    <option value="Sách pháp luật">Sách pháp luật</option>
                                    <option value="Báo">Báo</option>
                                    <option value="Tạp chí">Tạp chí</option>
                                    <option value="Văn học nghệ thuật">Văn học nghệ thuật</option>
                                    <option value="Khác">Khác</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Tác giả</label>
                                <input
                                    type="text"
                                    name="author"
                                    className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    value={book.author}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Năm xuất bản</label>
                                <input
                                    type="number"
                                    name="publishYear"
                                    className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    value={book.publishYear}
                                    onChange={handleChange}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Số lượng</label>
                                <input
                                    type="number"
                                    name="quantity"
                                    required
                                    min="0"
                                    className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    value={book.quantity}
                                    onChange={handleChange}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Tình trạng</label>
                                <select
                                    name="status"
                                    className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    value={book.status}
                                    onChange={handleChange}
                                >
                                    <option value="Good">Tốt (Mới)</option>
                                    <option value="Old">Cũ</option>
                                    <option value="Damaged">Rách / Hỏng</option>
                                    <option value="Lost">Mất</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-3 pt-4">
                            <button
                                type="button"
                                onClick={() => navigate("/books")}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                            >
                                Hủy bỏ
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                            >
                                {loading ? "Đang lưu..." : "Lưu sách"}
                            </button>
                        </div>
                    </form>
                </div>
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

export default BookForm;

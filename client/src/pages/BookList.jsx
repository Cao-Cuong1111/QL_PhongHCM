import { useEffect, useState } from "react";
import bookService from "../services/bookService";
import authService from "../services/authService";
import { useNavigate } from "react-router-dom";
import QRScanner from "../components/QRScanner";

const BookList = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTitle, setSearchTitle] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);
    const [showScanner, setShowScanner] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const user = authService.getCurrentUser();
        if (user && user.role === 'admin') {
            setIsAdmin(true);
        }
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        setLoading(true);
        try {
            const response = await bookService.getAllBooks({ title: searchTitle });
            setBooks(response.data);
        } catch (error) {
            console.error("Error fetching books:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa sách này không?")) {
            try {
                await bookService.deleteBook(id);
                fetchBooks(); // Refresh list
            } catch (error) {
                alert("Xóa sách thất bại!");
            }
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchBooks();
    };

    const handleQRScan = (scannedCode) => {
        console.log("Scanned QR code:", scannedCode);
        setSearchTitle(scannedCode);
        setShowScanner(false);
        // Auto search with the scanned code
        setTimeout(() => {
            fetchBooks();
        }, 100);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-extrabold text-gray-900 mb-6">
                    Quản lý Sách & Tài liệu
                </h2>

                {/* Search & Actions */}
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                    <form onSubmit={handleSearch} className="w-full sm:w-1/2 flex gap-2">
                        <input
                            type="text"
                            className="flex-1 px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Tìm kiếm theo tên sách..."
                            value={searchTitle}
                            onChange={(e) => setSearchTitle(e.target.value)}
                        />
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            Tìm kiếm
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowScanner(true)}
                            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 flex items-center gap-2"
                        >
                            📷 Quét QR
                        </button>
                    </form>
                    {isAdmin && (
                        <button
                            onClick={() => navigate('/books/new')}
                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                        >
                            + Thêm Sách mới
                        </button>
                    )}
                </div>

                {/* Book Table */}
                <div className="bg-white shadow overflow-hidden rounded-lg">
                    {loading ? (
                        <p className="p-4 text-center">Đang tải dữ liệu...</p>
                    ) : (
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã sách</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên sách</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thể loại</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số lượng</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tình trạng</th>
                                    {isAdmin && <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>}
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {books.length > 0 ? (
                                    books.map((book) => (
                                        <tr key={book.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{book.code}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{book.title}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{book.category}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{book.quantity}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${book.status === 'Good' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                    {book.status}
                                                </span>
                                            </td>
                                            {isAdmin && (
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <button
                                                        onClick={() => navigate(`/books/edit/${book.id}`)}
                                                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                                                    >
                                                        Sửa
                                                    </button>
                                                    <button onClick={() => handleDelete(book.id)} className="text-red-600 hover:text-red-900">Xóa</button>
                                                </td>
                                            )}
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                                            Không tìm thấy sách nào.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
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

export default BookList;

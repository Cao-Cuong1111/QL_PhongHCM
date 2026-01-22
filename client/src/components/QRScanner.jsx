import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

const QRScanner = ({ onScan, onClose }) => {
    const [error, setError] = useState("");
    const scannerRef = useRef(null);
    const [isScanning, setIsScanning] = useState(false);
    const [isCameraStarting, setIsCameraStarting] = useState(false);
    const [cameras, setCameras] = useState([]);
    const [selectedCamera, setSelectedCamera] = useState("");

    useEffect(() => {
        // Find cameras on mount
        const getCameras = async () => {
            try {
                const devices = await Html5Qrcode.getCameras();
                if (devices && devices.length > 0) {
                    setCameras(devices);
                    setSelectedCamera(devices[0].id);
                }
            } catch (err) {
                console.warn("Could not list cameras initially:", err);
            }
        };
        getCameras();

        return () => {
            stopCamera();
        };
    }, []);

    // Effect to start camera once the element is rendered
    useEffect(() => {
        if (isCameraStarting) {
            const timer = setTimeout(() => {
                actualStartCamera();
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [isCameraStarting]);

    const stopCamera = async () => {
        if (scannerRef.current) {
            try {
                if (scannerRef.current.isScanning) {
                    await scannerRef.current.stop();
                }
                scannerRef.current = null;
            } catch (err) {
                console.error("Stop error:", err);
            }
        }
        setIsScanning(false);
        setIsCameraStarting(false);
    };

    const actualStartCamera = async () => {
        setError("");
        try {
            const element = document.getElementById("qr-reader");
            if (!element) {
                throw new Error("Không tìm thấy vùng hiển thị Camera (DOM error)");
            }

            const html5QrCode = new Html5Qrcode("qr-reader");
            scannerRef.current = html5QrCode;

            const config = {
                fps: 15,
                qrbox: { width: 250, height: 250 },
                aspectRatio: 1.0
            };

            const cameraId = selectedCamera || { facingMode: "environment" };

            await html5QrCode.start(
                cameraId,
                config,
                (decodedText) => {
                    stopCamera();
                    if (onScan) onScan(decodedText);
                },
                () => { }
            );
            setIsScanning(true);
            setIsCameraStarting(false);
        } catch (err) {
            console.error("QR Start Error:", err);
            setError(`Lỗi: ${err.message || "Không thể bật camera"}. Vui lòng kiểm tra quyền truy cập.`);
            setIsCameraStarting(false);
            setIsScanning(false);
        }
    };

    const handleStartClick = () => {
        setIsCameraStarting(true);
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="text-lg font-bold text-gray-800">📷 Quét mã QR</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 font-bold text-xl">✕</button>
                </div>

                {/* Body */}
                <div className="p-6 flex flex-col items-center justify-center min-h-[350px] bg-gray-50">
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 text-red-600 text-xs rounded border border-red-100 w-full">
                            <p className="font-bold mb-1 underline">Phát hiện lỗi:</p>
                            {error}
                            <p className="mt-2 text-[10px] text-gray-500 italic">
                                * Gợi ý: Hãy nhấn vào biểu tượng camera trên thanh địa chỉ trình duyệt để cấp quyền.
                            </p>
                        </div>
                    )}

                    {!isScanning && !isCameraStarting ? (
                        <div className="text-center w-full">
                            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                </svg>
                            </div>

                            {cameras.length > 1 && (
                                <div className="mb-4 text-left">
                                    <label className="text-xs text-gray-500 mb-1 block font-medium">Chọn Camera:</label>
                                    <select
                                        className="w-full text-sm border rounded p-2 bg-white"
                                        value={selectedCamera}
                                        onChange={(e) => setSelectedCamera(e.target.value)}
                                    >
                                        {cameras.map(cam => (
                                            <option key={cam.id} value={cam.id}>{cam.label || `Camera ${cam.id.substring(0, 5)}`}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <p className="text-sm text-gray-600 mb-6">Sẵn sàng quét mã tài liệu</p>
                            <button
                                onClick={handleStartClick}
                                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 shadow-lg active:scale-95 transition-all"
                            >
                                Bật Camera Ngay
                            </button>
                        </div>
                    ) : (
                        <div className="w-full text-center">
                            {(isCameraStarting && !isScanning) && (
                                <div className="py-10 animate-pulse text-blue-600 flex flex-col items-center">
                                    <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                                    <span className="text-sm font-medium">Đang kết nối camera...</span>
                                </div>
                            )}
                            <div className={`w-full relative ${isScanning ? 'block' : 'hidden'}`}>
                                <div id="qr-reader" className="w-full bg-black rounded-lg overflow-hidden aspect-square shadow-inner"></div>
                                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                                    <div className="w-48 h-48 border-4 border-white/30 rounded-lg shadow-[0_0_0_9999px_rgba(0,0,0,0.5)]"></div>
                                    <div className="absolute w-48 h-[2px] bg-red-500 shadow-[0_0_8px_rgba(255,0,0,0.8)] animate-bounce mt-[-24px]"></div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t flex gap-2">
                    <button
                        onClick={onClose}
                        className="flex-1 py-2 bg-gray-100 text-gray-600 rounded font-medium hover:bg-gray-200 transition-colors"
                    >
                        Hủy bỏ
                    </button>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                #qr-reader video {
                    width: 100% !important;
                    height: 100% !important;
                    object-fit: cover !important;
                }
            `}} />
        </div>
    );
};

export default QRScanner;

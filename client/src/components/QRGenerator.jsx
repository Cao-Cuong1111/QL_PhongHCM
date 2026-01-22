import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";

const QRGenerator = ({ data, size = 256, onGenerate }) => {
    const canvasRef = useRef(null);
    const [qrDataUrl, setQrDataUrl] = useState("");

    useEffect(() => {
        if (data) {
            generateQR();
        }
    }, [data]);

    const generateQR = async () => {
        try {
            const canvas = canvasRef.current;
            await QRCode.toCanvas(canvas, data, {
                width: size,
                margin: 2,
                errorCorrectionLevel: 'M',
                color: {
                    dark: '#000000',
                    light: '#FFFFFF'
                }
            });

            // Also generate data URL for download
            const dataUrl = await QRCode.toDataURL(data, {
                width: size,
                margin: 2,
                errorCorrectionLevel: 'M'
            });
            setQrDataUrl(dataUrl);

            if (onGenerate) {
                onGenerate(dataUrl);
            }
        } catch (error) {
            console.error("Error generating QR code:", error);
        }
    };

    const handleDownload = () => {
        const link = document.createElement('a');
        link.download = `QR_${data}.png`;
        link.href = qrDataUrl;
        link.click();
    };

    const handlePrint = () => {
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>In mã QR - ${data}</title>
                <style>
                    body {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        min-height: 100vh;
                        margin: 0;
                        font-family: Arial, sans-serif;
                    }
                    .qr-label {
                        text-align: center;
                        padding: 20px;
                        border: 2px solid #000;
                        display: inline-block;
                    }
                    .qr-code {
                        margin: 20px 0;
                    }
                    .book-code {
                        font-size: 18px;
                        font-weight: bold;
                        margin-top: 10px;
                    }
                    @media print {
                        body {
                            margin: 0;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="qr-label">
                    <div class="qr-code">
                        <img src="${qrDataUrl}" alt="QR Code" />
                    </div>
                    <div class="book-code">${data}</div>
                </div>
            </body>
            </html>
        `);
        printWindow.document.close();
        setTimeout(() => {
            printWindow.print();
        }, 250);
    };

    if (!data) {
        return (
            <div className="text-center p-4 bg-gray-100 rounded-lg">
                <p className="text-gray-500">Chưa có mã sách để tạo QR</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center space-y-4">
            <div className="bg-white p-4 rounded-lg shadow-md">
                <canvas ref={canvasRef}></canvas>
            </div>

            <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Mã sách: <strong>{data}</strong></p>
                <div className="flex gap-2">
                    <button
                        onClick={handleDownload}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
                    >
                        ⬇️ Tải QR
                    </button>
                    <button
                        onClick={handlePrint}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-2"
                    >
                        🖨️ In nhãn
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QRGenerator;

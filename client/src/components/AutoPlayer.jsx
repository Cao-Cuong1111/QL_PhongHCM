import { useEffect, useState, useRef } from 'react';
import broadcastService from '../services/broadcastService';

const AutoPlayer = () => {
    const [broadcasts, setBroadcasts] = useState([]);
    const [audioSrc, setAudioSrc] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);
    const intervalRef = useRef(null);

    // Fetch schedule
    useEffect(() => {
        const fetchSchedule = async () => {
            try {
                const res = await broadcastService.getAll();
                // Filter only active
                setBroadcasts(res.data.filter(b => b.isActive));
            } catch (err) {
                console.error("Failed to fetch broadcast schedule");
            }
        };

        fetchSchedule();
        const fetchInterval = setInterval(fetchSchedule, 60000 * 5); // Refresh schedule every 5 mins

        return () => clearInterval(fetchInterval);
    }, []);

    // Check time every minute
    useEffect(() => {
        const checkTime = () => {
            const now = new Date();
            const currentHour = now.getHours();
            const currentMinute = now.getMinutes();

            // Simple check: Exact match to H:M
            // Note: startTime from DB is 'HH:mm:ss' or 'HH:mm' string.
            broadcasts.forEach(b => {
                const [h, m] = b.startTime.split(':').map(Number);
                if (h === currentHour && m === currentMinute) {
                    playBroadcast(b);
                }
            });
        };

        const now = new Date();
        const msTillNextMinute = (60 - now.getSeconds()) * 1000;

        // Timeout to sync with next minute start, then interval
        const timeoutId = setTimeout(() => {
            checkTime();
            intervalRef.current = setInterval(checkTime, 60000);
        }, msTillNextMinute);

        return () => {
            clearTimeout(timeoutId);
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [broadcasts]);

    const playBroadcast = (broadcast) => {
        console.log("Playing broadcast:", broadcast.title);
        // Construct URL. stored as relative "/uploads..."
        const url = `http://localhost:3000${broadcast.audioFile}`;
        setAudioSrc(url);
        setIsPlaying(true);
        // Audio will auto-play if policy allows, via useEffect below
    };

    useEffect(() => {
        if (audioSrc && audioRef.current) {
            audioRef.current.load(); // Reload with new src
            audioRef.current.play()
                .then(() => console.log("Audio started"))
                .catch(err => console.error("Autoplay prevented:", err));
        }
    }, [audioSrc]);

    return (
        <div className="fixed bottom-4 right-4 bg-white p-2 rounded shadow-lg border border-gray-200 z-50 text-xs w-64">
            <div className="font-bold mb-1 flex justify-between">
                <span>Hệ thống Truyền thanh</span>
                <span className={`w-2 h-2 rounded-full ${broadcasts.length > 0 ? 'bg-green-500' : 'bg-gray-400'}`}></span>
            </div>
            {isPlaying && (
                <div className="mb-1 text-blue-600 truncate">
                    Đang phát: {audioSrc?.split('/').pop()}
                </div>
            )}
            <audio
                ref={audioRef}
                controls
                className="w-full h-6"
                src={audioSrc || ""}
                onEnded={() => setIsPlaying(false)}
            />
            <div className="text-gray-400 mt-1" style={{ fontSize: '0.6rem' }}>
                Tự động phát theo lịch trình. Giữ tab này mở.
            </div>
        </div>
    );
};

export default AutoPlayer;

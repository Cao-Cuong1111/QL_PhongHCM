const db = require('../models');
const Broadcast = db.Broadcast;
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Multer Config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '../public/uploads/audio');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const filetypes = /mp3|wav|ogg|m4a/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error("Chỉ hỗ trợ file âm thanh (mp3, wav, ogg, m4a)"));
    }
}).single('audio');

// Create Broadcast (with File Upload)
exports.create = (req, res) => {
    upload(req, res, async (err) => {
        if (err) return res.status(400).json({ message: err.message });

        try {
            const { title, startTime, days, isActive } = req.body;
            let audioFile = "";
            if (req.file) {
                // Store relative path
                audioFile = '/uploads/audio/' + req.file.filename;
            } else if (req.body.audioUrl) {
                audioFile = req.body.audioUrl;
            } else {
                return res.status(400).json({ message: "Vui lòng tải lên file âm thanh." });
            }

            const broadcast = await Broadcast.create({
                title,
                audioFile,
                startTime,
                isActive: isActive === 'true' || isActive === true,
                days: days || 'Daily'
            });

            res.status(201).json(broadcast);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    });
};

// Find All
exports.findAll = async (req, res) => {
    try {
        const data = await Broadcast.findAll({
            order: [['startTime', 'ASC']]
        });
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Delete
exports.delete = async (req, res) => {
    try {
        const { id } = req.params;
        // Optional: Delete file from filesystem too
        const broadcast = await Broadcast.findByPk(id);
        if (broadcast && broadcast.audioFile.startsWith('/uploads')) {
            const filePath = path.join(__dirname, '../public', broadcast.audioFile);
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        }

        await Broadcast.destroy({ where: { id } });
        res.json({ message: "Deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Toggle Active
exports.toggleActive = async (req, res) => {
    try {
        const { id } = req.params;
        const broadcast = await Broadcast.findByPk(id);
        if (!broadcast) return res.status(404).json({ message: "Not found" });

        broadcast.isActive = !broadcast.isActive;
        await broadcast.save();
        res.json(broadcast);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

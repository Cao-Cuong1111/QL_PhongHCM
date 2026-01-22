const db = require('../models');
const Schedule = db.Schedule;
const { Op } = require('sequelize');
const { Document, Packer, Paragraph, Table, TableRow, TableCell, WidthType, TextRun, AlignmentType, VerticalAlign } = require("docx");

// Create Schedule
exports.create = async (req, res) => {
    try {
        const { weekNumber, year, date, time, content, participants, location, personInCharge, note } = req.body;
        const schedule = await Schedule.create({
            weekNumber, year, date, time, content, participants, location, personInCharge, note
        });
        res.status(201).json(schedule);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Find All (Filter by Week/Year or Date Range)
exports.findAll = async (req, res) => {
    try {
        const { weekNumber, year } = req.query;
        const condition = {};
        if (weekNumber) condition.weekNumber = weekNumber;
        if (year) condition.year = year;

        const data = await Schedule.findAll({
            where: condition,
            order: [['date', 'ASC'], ['time', 'ASC']]
        });
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update
exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        await Schedule.update(req.body, { where: { id } });
        res.json({ message: "Updated successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Delete
exports.delete = async (req, res) => {
    try {
        const { id } = req.params;
        await Schedule.destroy({ where: { id } });
        res.json({ message: "Deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Export to Docx
exports.exportDocx = async (req, res) => {
    try {
        const { weekNumber, year } = req.query;
        const schedules = await Schedule.findAll({
            where: { weekNumber, year },
            order: [['date', 'ASC'], ['time', 'ASC']]
        });

        if (schedules.length === 0) {
            return res.status(404).json({ message: "Không có dữ liệu cho tuần này." });
        }

        // Determine start/end date from data or logic
        const startDate = schedules[0]?.date || "Unknown";
        const endDate = schedules[schedules.length - 1]?.date || "Unknown";
        // Better logic: calculate from weekNumber/year if possible, but data-driven is okay for now.

        const tableRows = [
            new TableRow({
                children: [
                    new TableCell({ children: [new Paragraph({ text: "Thứ/Ngày", bold: true })] }),
                    new TableCell({ children: [new Paragraph({ text: "Nội dung, biện pháp", bold: true })] }),
                    new TableCell({ children: [new Paragraph({ text: "Thời gian", bold: true })] }),
                    new TableCell({ children: [new Paragraph({ text: "Thành phần đối tượng", bold: true })] }),
                    new TableCell({ children: [new Paragraph({ text: "Địa điểm", bold: true })] }),
                    new TableCell({ children: [new Paragraph({ text: "Phụ trách", bold: true })] }),
                    new TableCell({ children: [new Paragraph({ text: "Ghi chú", bold: true })] }),
                ],
            }),
        ];

        // Group by Date to mimic the merged cell look?
        // Docx 'merge' is complex. Let's do a simple Flat Table first, users can manual merge if needed.
        // OR: Repeat the Date for each row. 
        // Layout in image: Date is merged vertically.
        // I will try to support rowSpan if `docx` supports it easily, otherwise flat table.
        // Looking at `docx` docs (memory), `rowSpan` is `verticalMerge`.
        // It requires 'restart' on first cell and 'continue' on subsequent.

        // Group data
        const grouped = {};
        schedules.forEach(s => {
            if (!grouped[s.date]) grouped[s.date] = [];
            grouped[s.date].push(s);
        });

        for (const [date, items] of Object.entries(grouped)) {
            const dateObj = new Date(date);
            const days = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];
            const dayStr = days[dateObj.getDay()];
            const displayDate = `${dayStr}\n${dateObj.getDate()}/${dateObj.getMonth() + 1}`;

            items.forEach((item, index) => {
                const isFirst = index === 0;

                tableRows.push(
                    new TableRow({
                        children: [
                            new TableCell({
                                children: [new Paragraph(isFirst ? displayDate : "")],
                                verticalMerge: isFirst ? "restart" : "continue",
                                verticalAlign: VerticalAlign.CENTER
                            }),
                            new TableCell({ children: [new Paragraph(item.content)] }),
                            new TableCell({ children: [new Paragraph(item.time)] }),
                            new TableCell({ children: [new Paragraph(item.participants || "")] }),
                            new TableCell({ children: [new Paragraph(item.location || "")] }),
                            new TableCell({ children: [new Paragraph(item.personInCharge || "")] }),
                            new TableCell({ children: [new Paragraph(item.note || "")] }),
                        ],
                    })
                );
            });
        }

        const doc = new Document({
            sections: [{
                properties: {},
                children: [
                    new Paragraph({ text: "TIỂU ĐOÀN 881", alignment: AlignmentType.LEFT }),
                    new Paragraph({ text: "PHÒNG HỒ CHÍ MINH", alignment: AlignmentType.LEFT, bold: true }),
                    new Paragraph({ text: "CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM", alignment: AlignmentType.CENTER, bold: true }),
                    new Paragraph({ text: "Độc lập - Tự do - Hạnh phúc", alignment: AlignmentType.CENTER, bold: true }),
                    new Paragraph({ text: "" }), // Gap
                    new Paragraph({ text: "LỊCH", alignment: AlignmentType.CENTER, heading: "Heading1" }),
                    new Paragraph({ text: "Hoạt động phòng Hồ Chí Minh", alignment: AlignmentType.CENTER, bold: true }),
                    new Paragraph({ text: `(Tuần ${weekNumber} năm ${year})`, alignment: AlignmentType.CENTER, italics: true }),
                    new Paragraph({ text: "" }), // Gap
                    new Table({
                        rows: tableRows,
                        width: { size: 100, type: WidthType.PERCENTAGE },
                    }),
                ],
            }],
        });

        const buffer = await Packer.toBuffer(doc);

        res.setHeader("Content-Disposition", `attachment; filename=LichTuan${weekNumber}.docx`);
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
        res.send(buffer);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Lỗi xuất file" });
    }
};

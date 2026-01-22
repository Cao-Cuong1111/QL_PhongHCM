const db = require('../models');
const ActivityPlan = db.ActivityPlan;
const { Document, Packer, Paragraph, Table, TableRow, TableCell, text, AlignmentType, WidthType, VerticalAlign } = require("docx");

// Create
exports.create = async (req, res) => {
    try {
        const item = await ActivityPlan.create(req.body);
        res.status(201).json(item);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Find All (Filter by Month/Year)
exports.findAll = async (req, res) => {
    try {
        const { month, year } = req.query;
        const condition = {};
        if (month) condition.month = month;
        if (year) condition.year = year;

        const data = await ActivityPlan.findAll({
            where: condition,
            order: [['group', 'ASC'], ['id', 'ASC']]
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
        await ActivityPlan.update(req.body, { where: { id } });
        res.json({ message: "Updated successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Delete
exports.delete = async (req, res) => {
    try {
        const { id } = req.params;
        await ActivityPlan.destroy({ where: { id } });
        res.json({ message: "Deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Export Docx
exports.exportDocx = async (req, res) => {
    try {
        const { month, year } = req.query;
        const plans = await ActivityPlan.findAll({
            where: { month, year },
            order: [['group', 'ASC'], ['id', 'ASC']]
        });

        if (plans.length === 0) {
            return res.status(404).json({ message: "Không có dữ liệu cho tháng này." });
        }

        // Group by 'group' field
        const grouped = {};
        plans.forEach(p => {
            if (!grouped[p.group]) grouped[p.group] = [];
            grouped[p.group].push(p);
        });

        const tableRows = [
            new TableRow({
                children: [
                    new TableCell({ children: [new Paragraph({ text: "TT", bold: true })] }),
                    new TableCell({ children: [new Paragraph({ text: "Nội dung - biện pháp", bold: true })] }),
                    new TableCell({ children: [new Paragraph({ text: "Thời gian", bold: true })] }),
                    new TableCell({ children: [new Paragraph({ text: "Thành phần đối tượng", bold: true })] }),
                    new TableCell({ children: [new Paragraph({ text: "Địa điểm", bold: true })] }),
                    new TableCell({ children: [new Paragraph({ text: "Người Phụ trách", bold: true })] }),
                    new TableCell({ children: [new Paragraph({ text: "Ghi chú", bold: true })] }),
                ],
            }),
        ];

        // Roman Numerals helper (simple version)
        const getRoman = (str) => {
            // Extract Roman from string if present, else generate?
            // User inputs "I. ...". We can just use the group title directly as a full row.
            return str;
        };

        for (const [groupTitle, items] of Object.entries(grouped)) {
            // Add Header Row for the Group (e.g., "I. Hoạt động...")
            tableRows.push(
                new TableRow({
                    children: [
                        new TableCell({
                            children: [new Paragraph({ text: groupTitle.split('.')[0] || "I", bold: true })], // Just the Numeral
                        }),
                        new TableCell({
                            children: [new Paragraph({ text: groupTitle.substring(groupTitle.indexOf('.') + 1).trim(), bold: true })],
                            columnSpan: 6 // Span across rest
                        }),
                    ],
                })
            );

            // Add Items
            items.forEach((item, index) => {
                tableRows.push(
                    new TableRow({
                        children: [
                            new TableCell({ children: [new Paragraph({ text: (index + 1).toString() })] }),
                            new TableCell({ children: [new Paragraph(item.content)] }),
                            new TableCell({ children: [new Paragraph(item.time || "")] }),
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
                children: [
                    new Paragraph({ text: "LỮ ĐOÀN 131 HẢI QUÂN", alignment: AlignmentType.LEFT }),
                    new Paragraph({ text: "TIỂU ĐOÀN 881", alignment: AlignmentType.LEFT, bold: true }),
                    new Paragraph({ text: "CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM", alignment: AlignmentType.CENTER, bold: true }),
                    new Paragraph({ text: "Độc lập - Tự do - Hạnh phúc", alignment: AlignmentType.CENTER, bold: true }),
                    new Paragraph({ text: "" }),
                    new Paragraph({ text: "CHƯƠNG TRÌNH", alignment: AlignmentType.CENTER, heading: "Heading1" }),
                    new Paragraph({ text: `Hoạt động Phòng Hồ Chí Minh tháng ${month} năm ${year}`, alignment: AlignmentType.CENTER, bold: true }),
                    new Paragraph({ text: "" }),
                    new Table({
                        rows: tableRows,
                        width: { size: 100, type: WidthType.PERCENTAGE },
                    }),
                ],
            }],
        });

        const buffer = await Packer.toBuffer(doc);
        res.setHeader("Content-Disposition", `attachment; filename=ChuongTrinhThang${month}.docx`);
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
        res.send(buffer);

    } catch (err) {
        res.status(500).json({ message: "Lỗi xuất file" });
    }
};

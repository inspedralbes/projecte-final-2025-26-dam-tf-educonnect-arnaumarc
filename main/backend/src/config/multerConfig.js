const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Asegurar que el directorio de subidas existe
const uploadDir = path.join(__dirname, '../../uploads/submissions');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // Formato: entrega-alumnoId-timestamp.ext
        const studentId = req.body.studentId || 'unknown';
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `entrega-${studentId}-${uniqueSuffix}${path.extname(file.originalname)}`);
    }
});

const fileFilter = (req, file, cb) => {
    // Aceptar solo ciertos tipos de archivos si es necesario
    // Por ahora aceptamos casi todo, pero limitamos por seguridad en el futuro
    cb(null, true);
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // Límite de 10MB
    },
    fileFilter: fileFilter
});

module.exports = upload;

const multer = require('multer');

const storage = multer.memoryStorage(); // Store file in memory as Buffer
const upload = multer({ storage });

module.exports = upload;
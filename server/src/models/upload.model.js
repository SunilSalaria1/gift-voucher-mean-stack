const { z } = require("zod");

const fileUploadSchema = z.object({
    fileName: z.string().min(1, "File name is required"), // File name
    fileType: z.string().min(1, "File type is required"), // MIME type (e.g., image/png)
    fileBuffer: z.instanceof(Buffer, "File buffer is required"), // Store file as a Buffer
    uploadedAt: z.preprocess((val) => (val ? new Date(val) : new Date()), z.date()), // Upload timestamp
}).strict();

module.exports = fileUploadSchema;
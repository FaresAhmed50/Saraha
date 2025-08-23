import multer from "multer";

export const allowedExtensions = {
    images : ["image/*"],
    videos : ["video/*"],
    pdfs : ["application"],
};


export const MulterHostMiddleware = (allowedExtensions = []) => {
    const storage = multer.diskStorage({});

    function fileFilter(req, file, cb) {
        if (allowedExtensions.includes(file.mimetype)) {
            cb(new Error('Only image types allowed'));
        } else {
            cb(null, true);
        }
    }

    return multer({storage: storage, fileFilter})
}
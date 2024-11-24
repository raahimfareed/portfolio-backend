import multer from "multer";
import multerS3 from "multer-s3";
import { s3Client } from "./aws";
import moment from "moment";
const bucket = process.env.AWS_S3_BUCKET ?? "";
export const upload = multer({
    storage: multerS3({
        s3: s3Client,
        bucket,
        acl: 'public-read',
        metadata: (req, file, cb) => {
            cb(null, { fieldName: file.filename })
        },
        key: (req, file, cb) => {
            const uniqueKey = `uploads/${moment().toISOString()}_${file.originalname}`;
            cb(null, uniqueKey);
        }
    })
});


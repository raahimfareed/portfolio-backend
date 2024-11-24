import { upload } from "@/utils/multer";
import { validateSessionToken } from "@/utils/session";
import { Request, Response } from "express";
import { promisify } from "util";

export const create = async (request: Request, response: Response) => {
    const bearerHeader = request.headers.authorization;
    const token = bearerHeader?.trim()?.split(" ")?.at(1) ?? "";
    const validated = await validateSessionToken(token);
    if (validated.session === null) {
        response
            .status(403)
            .json({
                message: "You're not authorized to perform this operation"
            })
        return;
    }
    const uploadHandler = promisify(upload.single('file'));
    try {
        const result = await uploadHandler(request, response);
        if (!request.file) {
            response
                .status(400)
                .json({
                    message: "File upload failed"
                });
            return;
        }

        response
            .status(200)
            .json({
                message: "File uploaded successfully",
                // @ts-ignore
                imageUrl: request.file.location
            })
        return;
    } catch (error) {
        console.log(error);
        response
            .status(500)
            .json({
                message: "An error occurred"
            });
        return;
    }
}

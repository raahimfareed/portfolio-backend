import { Request, Response } from "express";
import User from "@/models/User";
import { userLoginSchema, userSetupSchema } from "@/schemas/user.schema";
import { generateHash, validateHash } from "@/utils/password";
import { createSession, generateSessionToken, validateSessionToken } from "@/utils/session";

export const setupUser = async (_: Request, response: Response) => {
    const usersCount = await User.count();
    if (usersCount > 0) {
        response
            .sendStatus(404);
        return;
    }

    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;
    const parsedUserData = userSetupSchema.safeParse({ email, password });
    if (!parsedUserData.success) {
        response
            .status(422)
            .json(parsedUserData.error.flatten().fieldErrors)
        return;
    }

    const adminUser = await User.create({
        email: parsedUserData.data.email,
        password: await generateHash(parsedUserData.data.password)
    });

    const safeUser = adminUser.toJSON();
    delete safeUser.password;

    response
        .status(201)
        .json(safeUser);
    return;
}

export const authenticate = async (request: Request, response: Response) => {
    let body;
    try {
        body = await request.body;
    } catch (error: any) {
        response
            .status(400)
            .json({
                error: "Unable to parse body"
            })
        return
    }
    const parsedBody = userLoginSchema.safeParse(body);
    if (!parsedBody.success) {
        response
            .status(422)
            .json(parsedBody.error.flatten());
        return;
    }
    
    const user = await User.findOne({
        where: {
            email: parsedBody.data.email
        }
    })

    if (!user) {
        response
            .status(422)
            .json({
                formErrors: [],
                fieldErrors: {
                    email: [ 'Invalid Credentials' ],
                    password: [ 'Invalid Credentials' ]
                }
            })
        return;
    }

    const passwordMatch = await validateHash(parsedBody.data.password, user.getDataValue('password'));
    if (!passwordMatch) {
        response
            .status(422)
            .json({
                formErrors: [],
                fieldErrors: {
                    email: [ 'Invalid Credentials' ],
                    password: [ 'Invalid Credentials' ]
                }
            })
        return;
    }

    const token = generateSessionToken();
    await createSession(token, user.getDataValue('id'));

    response
        .status(200)
        .json({ token })
    return;
}

export const validateSession = async (request: Request, response: Response) => {
    const bearerHeader = request.headers.authorization;
    const token = bearerHeader?.trim()?.split(" ")?.at(1) ?? "";
    if (!token || token.length === 0) {
        response
            .status(403)
            .json({
                message: "Invalid Session"
            })
        return;
    }

    const result = await validateSessionToken(token);
    if (result.session !== null) {
        response
            .json({
                message: "Valid Session",
                token
            });
        return;
    }
    response
        .status(200)
        .json({
            message: "Invalid Session"
        });
    return;
}

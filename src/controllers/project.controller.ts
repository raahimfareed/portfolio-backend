import Project from "@/models/Project";
import { createProjectSchema, updateProjectSchema } from "@/schemas/project.schema";
import { validateSessionToken } from "@/utils/session";
import { Request, Response } from "express";

export const getAll = async (_: Request, response: Response) => {
    const projects = await Project.findAll();

    response
        .json(projects);
}

export const get = async (request: Request, response: Response) => {
    const projectId = request.params.id;
    const project = await Project.findOne({
        where: {
            id: projectId
        }
    })

    if (!project) {
        response
            .sendStatus(404);
        return;
    }

    response
        .status(200)
        .json(project);
}

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
    let body;
    try {
        body = await request.body;
    } catch (error: any) {
        response
            .status(400)
            .json({
                error: "Unable to parse body"
            })
        return;
    }
    const parsedBody = createProjectSchema.safeParse(body);
    if (!parsedBody.success) {
        console.log(parsedBody.error);
        response
            .status(422)
            .json(parsedBody.error.flatten());
        return;
    }

    const project = await Project.create({
        name: parsedBody.data.name,
        description: parsedBody.data.description,
        url: parsedBody.data.url,
        image: parsedBody.data.image,
        techStack: parsedBody.data.techStack,
    });

    response
        .status(201)
        .json(project);
    return;
}

export const update = async (request: Request, response: Response) => {
    const projectId = request.params.id;
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

    const project = await Project.findOne({
        where: {
            id: projectId
        }
    });

    if (!project) {
        response
            .sendStatus(404);
        return;
    }

    let body;
    try {
        body = await request.body;
    } catch (error: any) {
        response
            .status(400)
            .json({
                error: "Unable to parse body"
            })
        return;
    }

    const parsedBody = updateProjectSchema.safeParse(body);

    if (!parsedBody.success) {
        console.log(parsedBody.error);
        response
            .status(422)
            .json(parsedBody.error.flatten());
        return;
    }

    await project.update(parsedBody.data);
    response
        .status(200)
        .json(project);
}

export const destroy = async (request: Request, response: Response) => {
    const projectId = request.params.id;
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

    const project = await Project.findOne({
        where: {
            id: projectId
        }
    });

    if (project) {
        await project.destroy();
        response
            .status(200)
            .json(project.toJSON());
        return;
    }

    response
        .sendStatus(404);
}

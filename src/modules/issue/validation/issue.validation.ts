import { NextFunction, Request, Response } from 'express';
import * as Joi from 'joi';

// Basic Joi validation
export function newIssueValidation(request: Request, response: Response, next: NextFunction) {
    const schema = Joi.object({
        title: Joi.string().required().max(100),
        description: Joi.string().required().max(500),
    }).unknown(false);

    const { error } = schema.validate(request.body, { abortEarly: false });

    if (error) {
        return response.send(error.details);
    } else {
        next();
    }
}
export function resolveIssueValidation(request: Request, response: Response, next: NextFunction) {
    const schema = Joi.object({
        issueId: Joi.string().uuid().required()
    }).unknown(false);

    const { error } = schema.validate(request.params, { abortEarly: false });

    if (error) {
        return response.send(error.details);
    } else {
        next();
    }
}
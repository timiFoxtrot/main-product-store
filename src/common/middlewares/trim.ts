import { NextFunction, Request, Response } from 'express';

const trim_string = (input: any) => {
    if (typeof input === 'string') return input.trim();
    if (input !== null && typeof input === 'object') {
        if (!isObjectEmpty(input)) {
            Object.keys(input).forEach((key) => {
                input[key] = trim_string(input[key]);
            });
        }
    }
    return input;
};

const trimmer = (fields: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        fields.forEach((field) => {
            if (req[field]) {
                req[field] = trim_string(req[field]);
            }
        });
        next();
    };
};

const isObjectEmpty = (objectName: object) => {
    return Object.keys(objectName).length === 0;
};

const trim_all = trimmer(['body', 'params', 'query']);
const trim_query = trimmer(['query']);
const trim_body = trimmer(['body']);
const trim_params = trimmer(['params']);

export { trim_all, trim_query, trim_body, trim_params };

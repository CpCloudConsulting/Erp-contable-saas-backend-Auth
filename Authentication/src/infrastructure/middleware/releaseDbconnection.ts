import {
    Request,
    Response,
    NextFunction
} from "express";

export const ReleaseDbConnection = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    res.on("finish", () => {
        if (req.dbClient) {
            req.dbClient.release();
            req.dbClient = undefined;
        }
    });
    next();
};
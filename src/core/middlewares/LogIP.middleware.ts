import { Injectable, Logger, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

@Injectable()
export class LogIPMiddleware implements NestMiddleware {
    private logger = new Logger();

    use(request: Request, response: Response, next: NextFunction): void {
        const { body } = request;
        response.on("finish", () => {
            const msg = `"${body?.username}" login`;
            this.logger.log(msg);
        });
        next();
    }
}
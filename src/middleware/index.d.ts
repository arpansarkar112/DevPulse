import type { JwtPayload as AppJwtPayload } from "../types";

declare global {
    namespace Express {
        interface Request {
            user?: AppJwtPayload;
        }
    }
}

export {};
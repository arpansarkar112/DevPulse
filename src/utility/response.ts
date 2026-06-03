import type { Response } from 'express';

type TResponse<T> = {
    statusCode: number;
    message: string;
    data?: T;
};

const sendResponse = <T>(res: Response, responseData: TResponse<T>) => {
    res.status(responseData.statusCode).json({
        success: true,
        message: responseData.message,
        data: responseData.data
    });
};

export default sendResponse;
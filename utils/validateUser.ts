import {Middleware} from "next-api-route-middleware";
import {firebaseAdmin} from "../config/firebaseAdmin";
import {NextApiRequest} from "next";

export type NextApiRequestWithUser = NextApiRequest & { headers: { email: string } };

type AllowedMethod = 'GET' | 'POST';

export const validateMethod = (method: AllowedMethod): Middleware => async (req, res, next) => {
    if (req.method !== method) {
        return res.status(405).json({message: 'Method not allowed'});
    }
    await next();
}

export const validateUser: Middleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')?.[1] as string;
    if (!token) {
        res.status(401).json({message: 'Unauthorized'});
        return;
    }

    try {
        const tokenInfo = await firebaseAdmin.auth().verifyIdToken(token);
        if (!tokenInfo.email) {
            res.status(401).json({message: 'Unauthorized'});
            return;
        }
        req.headers.email = tokenInfo.email;

        await next();
    } catch (e) {
        console.log('Error verifying token', e);
        res.status(401).json({message: 'Unauthorized'});
        return;
    }
}
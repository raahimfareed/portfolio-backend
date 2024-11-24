import { Session } from "@/types";
import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";
import SessionModel from "@/models/Session";
import crypto from "crypto";
import moment from "moment";

export const generateSessionToken = () => {
    const bytes = new Uint8Array(20);
    crypto.getRandomValues(bytes);
    const token = encodeBase32LowerCaseNoPadding(bytes);
    return token;
}

export async function createSession(token: string, userId: number) {
    const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
    const date = moment().add(30, 'days').toISOString();
    const session = await SessionModel.create({
        id: sessionId,
        user_id: userId,
        expires_at: date
    });
    return session;
}

export async function validateSessionToken(token: string) {
    const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
    const _session = await SessionModel.findOne({
        where: {
            id: sessionId
        }
    })

    if (!_session) {
        return { session: null, user: null };
    }

    const session: Session = _session.toJSON();
    // @ts-ignore
    const _user = await _session.getUser();
    const user = _user.toJSON();
    const { password, ...safeUser } = user;

    if (moment().isSameOrAfter(moment(session.expires_at))) {
        _session.destroy();
        return { session: null, user: null }
    }

    if (moment().isSameOrAfter(moment(session.expires_at).subtract(15, 'days'))) {
        _session.setDataValue("expires_at", moment().add(30, 'days').toDate());
        _session.save();
    }

    return { session, user: safeUser }
}

export async function invalidateSession(sessionId: string) {
    const _session = await SessionModel.findOne({
        where: {
            id: sessionId
        }
    })

    if (!!_session) {
        return await _session.destroy();
    }

    return;
}

export type SessionValidationResult = 
    | { session: Session; user: { id: number } }
    | { session: null; user: null };


import bcrypt from "bcryptjs"

export const generateSalt = async () => {
    return bcrypt.genSalt(10);
}

export const generateHash = async (value: string) => {
    return bcrypt.hash(value, await generateSalt());
}

export const validateHash = async (value: string, hash: string) => {
    return bcrypt.compare(value, hash);
}

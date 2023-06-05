
import bcryptjs from 'bcryptjs';


export async function hashPassword(password: string): Promise<string> {
    const salt = await bcryptjs.genSalt(12)
    return bcryptjs.hash(password, salt)
}

export async function comparePass(hash: string, password: string): Promise<boolean> {
    const isMatch = await bcryptjs.compare(password, hash)
    return isMatch
}
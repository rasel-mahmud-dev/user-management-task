
import bcryptjs from 'bcryptjs';


export async function hashPassword(password: string): Promise<string> {
    const salt = await bcryptjs.genSalt(12)
    return bcryptjs.hash(password, salt)
}
import bcrypt from "bcrypt";


export const generateHash = async ({plainText , signature } = {}) => {
    return await bcrypt.hash(plainText, signature)
}



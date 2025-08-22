import bcrypt from "bcrypt";


export const compareHash = async ({plainText , cipherText } = {}) => {
    return bcrypt.compareSync(plainText, cipherText);
}
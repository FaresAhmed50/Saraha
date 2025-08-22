import CryptoJS from "crypto-js";


export const decryptUtilits = async ({cipherText , signature}) => {
    return CryptoJS.AES.decrypt(cipherText, signature).toString(CryptoJS.enc.Utf8);
}
import CryptoJS from "crypto-js";


export const generateEncryption = async ({planeText , signature}) => {
    return CryptoJS.AES.encrypt(planeText, signature).toString();
}
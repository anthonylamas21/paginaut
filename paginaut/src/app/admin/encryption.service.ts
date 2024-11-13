import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { ENCRYP } from '../constans';

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {
  private readonly key = ENCRYP;

  decrypt(encryptedData: string): any {
    try {
      // Decodificar de base64
      const rawData = CryptoJS.enc.Base64.parse(encryptedData);

      // Extraer IV (primeros 16 bytes)
      const iv = rawData.clone();
      iv.sigBytes = 16;
      iv.clamp();

      // Extraer datos encriptados (resto después del IV)
      const encrypted = rawData.clone();
      encrypted.words.splice(0, 4); // Remover IV
      encrypted.sigBytes -= 16;

      // Crear key a partir de la clave secreta
      const keyHash = CryptoJS.SHA256(this.key);
      const key = CryptoJS.enc.Hex.parse(keyHash.toString().slice(0, 64));

      // Configurar el desencriptador y desencriptar directamente
      const decrypted = CryptoJS.AES.decrypt(
        encrypted.toString(CryptoJS.enc.Base64), // Convertir a string en base64
        key,
        {
          iv: iv,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7
        }
      );

      // Convertir el resultado a string y parsearlo como JSON
      const decryptedStr = decrypted.toString(CryptoJS.enc.Utf8);
        //console.log('Datos desencriptados:', decryptedStr);
      return JSON.parse(decryptedStr);
    } catch (error) {
        //console.error('Error en la desencriptación:', error);
      throw new Error('Error al desencriptar los datos');
    }
  }
}
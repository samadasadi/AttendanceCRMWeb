using System;
using System.IO;
using System.Security.Cryptography;
using Service.Consts;

namespace Service.Security
{
    public static class EncDec
    {
        private static readonly string HashKey = AppSettings.HashKey;

        public static byte[] Encrypt(byte[] clearData, byte[] key, byte[] iv)
        {
            var ms = new MemoryStream();
            var alg = Rijndael.Create();
            alg.Key = key;
            alg.IV = iv;
            CryptoStream cs = new CryptoStream(ms,
               alg.CreateEncryptor(), CryptoStreamMode.Write);
            cs.Write(clearData, 0, clearData.Length);
            cs.Close();
            byte[] encryptedData = ms.ToArray();
            return encryptedData;
        }
        public static string Encrypt(string clearText)
        {
            byte[] clearBytes = System.Text.Encoding.Unicode.GetBytes(clearText);
            var pdb = new PasswordDeriveBytes(HashKey, new byte[] { 0x49, 0x76, 0x61, 0x6e, 0x20, 0x4d, 0x65, 0x64, 0x76, 0x65, 0x64, 0x65, 0x76 });
            byte[] encryptedData = Encrypt(clearBytes, pdb.GetBytes(32), pdb.GetBytes(16));
            return Convert.ToBase64String(encryptedData);
        }

        public static byte[] Decrypt(byte[] cipherData, byte[] key, byte[] iv)
        {
            var ms = new MemoryStream();
            var alg = Rijndael.Create();
            alg.Key = key;
            alg.IV = iv;
            var cs = new CryptoStream(ms,
                alg.CreateDecryptor(), CryptoStreamMode.Write);
            cs.Write(cipherData, 0, cipherData.Length);
            cs.Close();
            var decryptedData = ms.ToArray();

            return decryptedData;
        }
        public static string Decrypt(string cipherText)
        {
            try
            {
                byte[] cipherBytes = Convert.FromBase64String(cipherText);
                var pdb = new PasswordDeriveBytes(HashKey,
                    new byte[] {0x49, 0x76, 0x61, 0x6e, 0x20, 0x4d, 0x65,
            0x64, 0x76, 0x65, 0x64, 0x65, 0x76});
                var decryptedData = Decrypt(cipherBytes,
                    pdb.GetBytes(32), pdb.GetBytes(16));
                return System.Text.Encoding.Unicode.GetString(decryptedData);
            }
            catch (Exception)
            {
                return string.Empty;
            }
        }
    }
}
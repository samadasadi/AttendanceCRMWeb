using System;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Text;

namespace Utility
{
    public class EncryptDecrypt
    {
        #region Declaration

        static readonly byte[] TripleDesKey1 = { 15, 11, 7, 21, 34, 32, 33, 5, 23, 13, 23, 41, 43, 41, 7, 19, 91, 91, 47, 7, 37, 13, 19, 41 };
        static readonly byte[] TripleDesiv1 = { 5, 23, 13, 23, 41, 43, 41, 7 };

        #endregion


        /// <summary>
        /// To Encrypt String
        /// </summary>
        /// <param name="value">String To Encrypt</param>
        /// <returns>Returns Encrypted String</returns>
        public static string ToEncrypt(string value)
        {
            var des = new TripleDESCryptoServiceProvider
            {
                Key = TripleDesKey1,
                IV = TripleDesiv1
            };

            MemoryStream ms;

            ms = value.Length >= 1 ? new MemoryStream(((value.Length * 2) - 1)) : new MemoryStream();

            ms.Position = 0;
            var encStream = new CryptoStream(ms, des.CreateEncryptor(), CryptoStreamMode.Write);
            byte[] plainBytes = System.Text.Encoding.UTF8.GetBytes(value);
            encStream.Write(plainBytes, 0, plainBytes.Length);
            encStream.FlushFinalBlock();
            encStream.Close();

            return Convert.ToBase64String(plainBytes);
        }

        /// <summary>
        /// To Decrypt Data Encrypted From TripleDEC Algoritham
        /// </summary>
        /// <param name="value">String Value To Decrypt</param>
        /// <returns>Return Decrypted Data</returns>
        public static string ToDecrypt(string value)
        {
            var des = new TripleDESCryptoServiceProvider();
            //System.IO.MemoryStream ms = new System.IO.MemoryStream(((value.Length * 2) - 1));
            MemoryStream ms;
            ms = value.Length >= 1 ? new MemoryStream(((value.Length * 2) - 1)) : new MemoryStream();

            ms.Position = 0;
            var encStream = new CryptoStream(ms, des.CreateDecryptor(TripleDesKey1, TripleDesiv1), CryptoStreamMode.Write);
            byte[] plainBytes = Convert.FromBase64String(value);
            encStream.Write(plainBytes, 0, plainBytes.Length);
            return System.Text.Encoding.UTF8.GetString(plainBytes);
        }







        //Add By Samad - For HardwareKey
        private const int Keysize = 128;
        private const int DerivationIterations = 1000;
        private const string Pqssword_Key = "mina";
        public static string Encrypt(string plainText)
        {
            try
            {
                var saltStringBytes = Generate256BitsOfRandomEntropy();
                var ivStringBytes = Generate256BitsOfRandomEntropy();
                var plainTextBytes = Encoding.UTF8.GetBytes(plainText);
                using (var password = new Rfc2898DeriveBytes(Pqssword_Key, saltStringBytes, DerivationIterations))
                {
                    var keyBytes = password.GetBytes(Keysize / 8);
                    using (var symmetricKey = new RijndaelManaged())
                    {
                        symmetricKey.BlockSize = 128;
                        symmetricKey.Mode = CipherMode.CBC;
                        symmetricKey.Padding = PaddingMode.PKCS7;
                        using (var encryptor = symmetricKey.CreateEncryptor(keyBytes, ivStringBytes))
                        {
                            using (var memoryStream = new MemoryStream())
                            {
                                using (var cryptoStream = new CryptoStream(memoryStream, encryptor, CryptoStreamMode.Write))
                                {
                                    cryptoStream.Write(plainTextBytes, 0, plainTextBytes.Length);
                                    cryptoStream.FlushFinalBlock();
                                    var cipherTextBytes = saltStringBytes;
                                    cipherTextBytes = cipherTextBytes.Concat(ivStringBytes).ToArray();
                                    cipherTextBytes = cipherTextBytes.Concat(memoryStream.ToArray()).ToArray();
                                    memoryStream.Close();
                                    cryptoStream.Close();
                                    return Convert.ToBase64String(cipherTextBytes);
                                }
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return "NON";
            }
        }
        public static string Decrypt(string cipherText)
        {
            try
            {
                // Get the complete stream of bytes that represent:
                // [32 bytes of Salt] + [32 bytes of IV] + [n bytes of CipherText]
                var cipherTextBytesWithSaltAndIv = Convert.FromBase64String(cipherText);
                // Get the saltbytes by extracting the first 32 bytes from the supplied cipherText bytes.
                var saltStringBytes = cipherTextBytesWithSaltAndIv.Take(Keysize / 8).ToArray();
                // Get the IV bytes by extracting the next 32 bytes from the supplied cipherText bytes.
                var ivStringBytes = cipherTextBytesWithSaltAndIv.Skip(Keysize / 8).Take(Keysize / 8).ToArray();
                // Get the actual cipher text bytes by removing the first 64 bytes from the cipherText string.
                var cipherTextBytes = cipherTextBytesWithSaltAndIv.Skip((Keysize / 8) * 2).Take(cipherTextBytesWithSaltAndIv.Length - ((Keysize / 8) * 2)).ToArray();

                using (var password = new Rfc2898DeriveBytes(Pqssword_Key, saltStringBytes, DerivationIterations))
                {
                    var keyBytes = password.GetBytes(Keysize / 8);
                    using (var symmetricKey = new RijndaelManaged())
                    {
                        symmetricKey.BlockSize = 128;
                        symmetricKey.Mode = CipherMode.CBC;
                        symmetricKey.Padding = PaddingMode.PKCS7;
                        using (var decryptor = symmetricKey.CreateDecryptor(keyBytes, ivStringBytes))
                        {
                            using (var memoryStream = new MemoryStream(cipherTextBytes))
                            {
                                using (var cryptoStream = new CryptoStream(memoryStream, decryptor, CryptoStreamMode.Read))
                                {
                                    var plainTextBytes = new byte[cipherTextBytes.Length];
                                    var decryptedByteCount = cryptoStream.Read(plainTextBytes, 0, plainTextBytes.Length);
                                    memoryStream.Close();
                                    cryptoStream.Close();
                                    return Encoding.UTF8.GetString(plainTextBytes, 0, decryptedByteCount);
                                }
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return "NON";
            }
        }
        private static byte[] Generate256BitsOfRandomEntropy()
        {
            var randomBytes = new byte[16]; // 32 Bytes will give us 256 bits.
            using (var rngCsp = new RNGCryptoServiceProvider())
            {
                // Fill the array with cryptographically secure random bytes.
                rngCsp.GetBytes(randomBytes);
            }
            return randomBytes;
        }


    }
}
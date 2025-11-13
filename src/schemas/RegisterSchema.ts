<<<<<<< HEAD
import { t } from "i18next";
import { z } from "zod";
import { wp } from "../hooks/useRespons";
=======
import { z } from "zod";
>>>>>>> 2742bcc (ilk yükleme)

// Özel validasyon fonksiyonları
const containsNumber = (str: string) => /\d/.test(str);
const containsUppercase = (str: string) => /[A-Z]/.test(str);
const containsLowercase = (str: string) => /[a-z]/.test(str);
<<<<<<< HEAD
const containsSpecialChar = (str: string) =>
  /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(str);
const isValidTurkishName = (str: string) =>
  /^[a-zA-ZçÇğĞıİöÖşŞüÜ\s]+$/.test(str);
=======
const containsSpecialChar = (str: string) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(str);
const isValidTurkishName = (str: string) => /^[a-zA-ZçÇğĞıİöÖşŞüÜ\s]+$/.test(str);
>>>>>>> 2742bcc (ilk yükleme)

// Yasaklı email domainleri
const blockedEmailDomains = [
  "tempmail.org",
  "10minutemail.com",
  "guerrillamail.com",
<<<<<<< HEAD
  "mailinator.com",
=======
  "mailinator.com"
>>>>>>> 2742bcc (ilk yükleme)
];

// Yaygın zayıf şifreler
const commonPasswords = [
  "password",
  "123456789",
  "qwertyuiop",
  "asdfghjkl",
  "password123",
  "admin123",
<<<<<<< HEAD
  "123456",
];

export const registerSchemas = z.object({
  firstName: z
    .string()
    .min(2, { message: "Ad en az 2 karakter olmalıdır" })
    .max(30, { message: "Ad en fazla 30 karakter olmalıdır" })
    .refine((val) => isValidTurkishName(val), {
      message: "Ad sadece harf içermelidir (Türkçe karakterler desteklenir)",
    })
    .refine((val) => !/^\s|\s$/.test(val), {
      message: "Ad başında veya sonunda boşluk olamaz",
    })
    .refine((val) => !/\s{2,}/.test(val), {
      message: "Ad içinde ardışık boşluklar olamaz",
    }),

  lastName: z
    .string()
    .min(2, { message: "Soyad en az 2 karakter olmalıdır" })
    .max(30, { message: "Soyad en fazla 30 karakter olmalıdır" })
    .refine((val) => isValidTurkishName(val), {
      message: "Soyad sadece harf içermelidir (Türkçe karakterler desteklenir)",
    })
    .refine((val) => !/^\s|\s$/.test(val), {
      message: "Soyad başında veya sonunda boşluk olamaz",
    })
    .refine((val) => !/\s{2,}/.test(val), {
      message: "Soyad içinde ardışık boşluklar olamaz",
    }),

  email: z
    .string()
    .toLowerCase()
    .min(1, { message: "Email adresi zorunludur" })
    .email({ message: "Geçersiz email formatı" })
    .max(100, { message: "Email adresi en fazla 100 karakter olmalıdır" })
    .refine(
      (email) => {
        const domain = email.split("@")[1];
        return !blockedEmailDomains.includes(domain);
      },
      {
        message: "Bu email sağlayıcısı kabul edilmemektedir",
      }
    )
    .refine(
      (email) => {
        // Email'in yerel kısmında geçersiz karakterler kontrolü
        const localPart = email.split("@")[0];
        return !/[<>()[\]\\,;:\s@"]/.test(localPart);
      },
      {
        message: "Email adresi geçersiz karakterler içeriyor",
      }
    )
    .refine(
      (email) => {
        // Çift nokta kontrolü
        return !email.includes("..");
      },
      {
        message: "Email adresinde ardışık noktalar olamaz",
      }
    ),

  password: z
    .string()
    .min(8, { message: "Şifre en az 8 karakter olmalıdır" })
    .max(128, { message: "Şifre en fazla 128 karakter olmalıdır" })
    .refine((password) => containsLowercase(password), {
      message: "Şifre en az 1 küçük harf içermelidir",
    })
    .refine((password) => containsUppercase(password), {
      message: "Şifre en az 1 büyük harf içermelidir",
    })
    .refine((password) => containsNumber(password), {
      message: "Şifre en az 1 rakam içermelidir",
    })
    .refine((password) => containsSpecialChar(password), {
      message: "Şifre en az 1 özel karakter içermelidir (!@#$%^&*)",
    })
    .refine((password) => !commonPasswords.includes(password.toLowerCase()), {
      message: "Bu şifre çok yaygın kullanılıyor, daha güçlü bir şifre seçin",
    })
    .refine((password) => !/(.)\1{2,}/.test(password), {
      message: "Şifrede aynı karakter 3 kez tekrar edemez",
    })
    .refine((password) => !/\s/.test(password), {
      message: "Şifre boşluk karakteri içeremez",
    }),
});

// Şifre gücü hesaplama fonksiyonu (opsiyonel)
export const calculatePasswordStrength = (
  password: string
): {
  score: number;
  feedback: string[];
  color: string;
  width: number;
=======
  "123456"
];

export const registerSchemas = z
  .object({
    firstName: z
      .string()
      .min(2, { message: "Ad en az 2 karakter olmalıdır" })
      .max(30, { message: "Ad en fazla 30 karakter olmalıdır" })
      .refine((val) => isValidTurkishName(val), {
        message: "Ad sadece harf içermelidir (Türkçe karakterler desteklenir)"
      })
      .refine((val) => !/^\s|\s$/.test(val), {
        message: "Ad başında veya sonunda boşluk olamaz"
      })
      .refine((val) => !/\s{2,}/.test(val), {
        message: "Ad içinde ardışık boşluklar olamaz"
      }),

    lastName: z
      .string()
      .min(2, { message: "Soyad en az 2 karakter olmalıdır" })
      .max(30, { message: "Soyad en fazla 30 karakter olmalıdır" })
      .refine((val) => isValidTurkishName(val), {
        message: "Soyad sadece harf içermelidir (Türkçe karakterler desteklenir)"
      })
      .refine((val) => !/^\s|\s$/.test(val), {
        message: "Soyad başında veya sonunda boşluk olamaz"
      })
      .refine((val) => !/\s{2,}/.test(val), {
        message: "Soyad içinde ardışık boşluklar olamaz"
      }),

    email: z
      .string()
      .toLowerCase()
      .min(1, { message: "Email adresi zorunludur" })
      .email({ message: "Geçersiz email formatı" })
      .max(100, { message: "Email adresi en fazla 100 karakter olmalıdır" })
      .refine((email) => {
        const domain = email.split("@")[1];
        return !blockedEmailDomains.includes(domain);
      }, {
        message: "Bu email sağlayıcısı kabul edilmemektedir"
      })
      .refine((email) => {
        // Email'in yerel kısmında geçersiz karakterler kontrolü
        const localPart = email.split("@")[0];
        return !/[<>()[\]\\,;:\s@"]/.test(localPart);
      }, {
        message: "Email adresi geçersiz karakterler içeriyor"
      })
      .refine((email) => {
        // Çift nokta kontrolü
        return !email.includes("..");
      }, {
        message: "Email adresinde ardışık noktalar olamaz"
      }),

    password: z
      .string()
      .min(8, { message: "Şifre en az 8 karakter olmalıdır" })
      .max(128, { message: "Şifre en fazla 128 karakter olmalıdır" })
      .refine((password) => containsLowercase(password), {
        message: "Şifre en az 1 küçük harf içermelidir"
      })
      .refine((password) => containsUppercase(password), {
        message: "Şifre en az 1 büyük harf içermelidir"
      })
      .refine((password) => containsNumber(password), {
        message: "Şifre en az 1 rakam içermelidir"
      })
      .refine((password) => containsSpecialChar(password), {
        message: "Şifre en az 1 özel karakter içermelidir (!@#$%^&*)"
      })
      .refine((password) => !commonPasswords.includes(password.toLowerCase()), {
        message: "Bu şifre çok yaygın kullanılıyor, daha güçlü bir şifre seçin"
      })
      .refine((password) => !/(.)\1{2,}/.test(password), {
        message: "Şifrede aynı karakter 3 kez tekrar edemez"
      })
      .refine((password) => !/\s/.test(password), {
        message: "Şifre boşluk karakteri içeremez"
      } ),

    confirmPassword: z
      .string()
      .min(1, { message: "Şifre tekrarı zorunludur" }),

    
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Şifreler eşleşmiyor",
    path: ["confirmPassword"],
  })
  .refine((data) => {
    // İsim ve soyismin şifrede bulunmaması kontrolü
    const fullName = `${data.firstName}${data.lastName}`.toLowerCase();
    const password = data.password.toLowerCase();
    return !password.includes(fullName) && 
           !password.includes(data.firstName.toLowerCase()) && 
           !password.includes(data.lastName.toLowerCase());
  }, {
    message: "Şifre ad veya soyad bilgilerinizi içeremez",
    path: ["password"],
  })
  .refine((data) => {
    // Email'in yerel kısmının şifrede bulunmaması kontrolü
    const emailLocal = data.email.split("@")[0].toLowerCase();
    const password = data.password.toLowerCase();
    return emailLocal.length < 4 || !password.includes(emailLocal);
  }, {
    message: "Şifre email adresinizin bir kısmını içeremez",
    path: ["password"],
  });

// Şifre gücü hesaplama fonksiyonu (opsiyonel)
export const calculatePasswordStrength = (password: string): {
  score: number;
  feedback: string[];
>>>>>>> 2742bcc (ilk yükleme)
} => {
  let score = 0;
  const feedback: string[] = [];

  if (password.length >= 8) score += 1;
<<<<<<< HEAD
  else feedback.push(t("register.passwordStrength.0"));

  if (containsLowercase(password)) score += 1;
  else feedback.push(t("register.passwordStrength.1"));

  if (containsUppercase(password)) score += 1;
  else feedback.push(t("register.passwordStrength.2"));

  if (containsNumber(password)) score += 1;
  else feedback.push(t("register.passwordStrength.3"));

  if (containsSpecialChar(password)) score += 1;
  else feedback.push(t("register.passwordStrength.4"));

  if (password.length >= 12) score += 1;

  let width = 0;
  const maxScore = 6;
  width = Math.min((score / maxScore) * wp(60), wp(60));

  // Şifre gücüne göre renkleri ayarlıyoruz
  let color: string = "#EF4444";
  switch (score) {
    case 1:
      color = "#EF4444"; // zayıf (kırmızı)
      break;
    case 2:
      color = "#F59E42"; // orta-alt (turuncu)
      break;
    case 3:
      color = "#EAB308"; // orta-seviye (sarı)
      break;
    case 4:
      color = "#4ADF4A"; // iyi (yeşil)
      break;
    case 5:
      color = "#3498db"; // çok iyi (koyu yeşil)
      break;
  }
  return { score, feedback, color, width };
};

export type RegisterFormData = z.infer<typeof registerSchemas>;
=======
  else feedback.push("En az 8 karakter kullanın");

  if (containsLowercase(password)) score += 1;
  else feedback.push("Küçük harf ekleyin");

  if (containsUppercase(password)) score += 1;
  else feedback.push("Büyük harf ekleyin");

  if (containsNumber(password)) score += 1;
  else feedback.push("Rakam ekleyin");

  if (containsSpecialChar(password)) score += 1;
  else feedback.push("Özel karakter ekleyin");

  if (password.length >= 12) score += 1;

  return { score, feedback };
};

export type RegisterFormData = z.infer<typeof registerSchemas>;
>>>>>>> 2742bcc (ilk yükleme)

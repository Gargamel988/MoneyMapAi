
import { t } from "i18next";
import { z } from "zod";
import { wp } from "../hooks/useResponsive";


// Özel validasyon fonksiyonları
const containsNumber = (str: string) => /\d/.test(str);
const containsUppercase = (str: string) => /[A-Z]/.test(str);
const containsLowercase = (str: string) => /[a-z]/.test(str);
const containsSpecialChar = (str: string) =>
  /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(str);
const isValidTurkishName = (str: string) =>
  /^[a-zA-ZçÇğĞıİöÖşŞüÜ\s]+$/.test(str);

// Yasaklı email domainleri
const blockedEmailDomains = [
  "tempmail.org",
  "10minutemail.com",
  "guerrillamail.com",
  "mailinator.com",
];

// Yaygın zayıf şifreler
const commonPasswords = [
  "password",
  "123456789",
  "qwertyuiop",
  "asdfghjkl",
  "password123",
  "admin123",
  "123456",
];

export const registerSchemas = z.object({
  firstName: z
    .string()
    .min(2, { message: t("register.error.firstNameMin") })
    .max(30, { message: t("register.error.firstNameMax") })
    .refine((val) => isValidTurkishName(val), {
      message: t("register.error.firstNameLetters"),
    })
    .refine((val) => !/^\s|\s$/.test(val), {
      message: t("register.error.firstNameSpaces"),
    })
    .refine((val) => !/\s{2,}/.test(val), {
      message: t("register.error.firstNameConsecutiveSpaces"),
    }),

  lastName: z
    .string()
    .min(2, { message: t("register.error.lastNameMin") })
    .max(30, { message: t("register.error.lastNameMax") })
    .refine((val) => isValidTurkishName(val), {
      message: t("register.error.lastNameLetters"),
    })
    .refine((val) => !/^\s|\s$/.test(val), {
      message: t("register.error.lastNameSpaces"),
    })
    .refine((val) => !/\s{2,}/.test(val), {
      message: t("register.error.lastNameConsecutiveSpaces"),
    }),

  email: z
    .string()
    .toLowerCase()
    .min(1, { message: t("register.error.emailRequired") })
    .email({ message: t("register.error.emailInvalid") })
    .max(100, { message: t("register.error.emailMax") })
    .refine(
      (email) => {
        const domain = email.split("@")[1];
        return !blockedEmailDomains.includes(domain);
      },
      {
        message: t("register.error.emailBlocked"),
      }
    )
    .refine(
      (email) => {
        // Email'in yerel kısmında geçersiz karakterler kontrolü
        const localPart = email.split("@")[0];
        return !/[<>()[\]\\,;:\s@"]/.test(localPart);
      },
      {
        message: t("register.error.emailInvalidChars"),
      }
    )
    .refine(
      (email) => {
        // Çift nokta kontrolü
        return !email.includes("..");
      },
      {
        message: t("register.error.emailConsecutiveDots"),
      }
    ),

  password: z
    .string()
    .min(8, { message: t("register.error.passwordMin") })
    .max(128, { message: t("register.error.passwordMax") })
    .refine((password) => containsLowercase(password), {
      message: t("register.error.passwordLowercase"),
    })
    .refine((password) => containsUppercase(password), {
      message: t("register.error.passwordUppercase"),
    })
    .refine((password) => containsNumber(password), {
      message: t("register.error.passwordNumber"),
    })
    .refine((password) => containsSpecialChar(password), {
      message: t("register.error.passwordSpecial"),
    })
    .refine((password) => !commonPasswords.includes(password.toLowerCase()), {
      message: t("register.error.passwordCommon"),
    })
    .refine((password) => !/(.)\1{2,}/.test(password), {
      message: t("register.error.passwordRepeat"),
    })
    .refine((password) => !/\s/.test(password), {
      message: t("register.error.passwordSpaces"),
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

} => {
  let score = 0;
  const feedback: string[] = [];

  if (password.length >= 8) score += 1;
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

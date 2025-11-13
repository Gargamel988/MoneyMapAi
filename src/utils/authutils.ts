import { AuthError } from "@supabase/supabase-js";

const getErrorMessage = (error: AuthError): string => {

	switch (error.message) {
		case 'Email already in use':
			return 'Bu email adresi zaten kullanılmaktadır.';
		case 'Email not confirmed':
			return 'Email adresiniz doğrulanmamış. Lütfen mailinizi kontrol edin ve doğrulama bağlantısına tıklayın.';
		case 'User not found':
			return 'Bu email ile kayıtlı bir kullanıcı bulunamadı. Hesap oluşturmak için kayıt ol butonuna tıklayın.';
		case 'Too many requests':
			return 'Çok fazla deneme yapıldı. Lütfen birkaç dakika bekleyin.';
		case 'Invalid login credentials':
			return 'Email veya şifre yanlış. Lütfen tekrar deneyin.';
		default:
			return error.message;
	}
}


const getsignInErrorMessage = (error: AuthError): string => {

	switch (error.message) {
		case 'Invalid login credentials':
			return 'Email veya şifre yanlış. Lütfen tekrar deneyin.';
		case 'Email not confirmed':
			return 'Email adresiniz doğrulanmamış. Lütfen mailinizi kontrol edin ve doğrulama bağlantısına tıklayın.';
		case 'User not found':
			return 'Bu email ile kayıtlı bir kullanıcı bulunamadı. Hesap oluşturmak için kayıt ol butonuna tıklayın.';
		case 'Too many requests':
			return 'Çok fazla deneme yapıldı. Lütfen birkaç dakika bekleyin.';
		default:
			return error.message;
	}
}

export { getErrorMessage, getsignInErrorMessage };

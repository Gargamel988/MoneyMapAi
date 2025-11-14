import { AuthError } from "@supabase/supabase-js";
import i18next from "../../services/i18next";

const getErrorMessage = (error: AuthError): string => {

	switch (error.message) {
		case 'Email already in use':
			return i18next.t('auth.errors.emailExists');
		case 'Email not confirmed':
			return i18next.t('auth.errors.emailNotConfirmed');
		case 'User not found':
			return i18next.t('auth.errors.userNotFound');
		case 'Too many requests':
			return i18next.t('auth.errors.tooManyRequests');
		case 'Invalid login credentials':
			return i18next.t('auth.errors.invalidCredentials');
		default:
			return error.message;
	}
}


const getsignInErrorMessage = (error: AuthError): string => {

	switch (error.message) {
		case 'Invalid login credentials':
			return i18next.t('auth.errors.invalidCredentials');
		case 'Email not confirmed':
			return i18next.t('auth.errors.emailNotConfirmed');
		case 'User not found':
			return i18next.t('auth.errors.userNotFound');
		case 'Too many requests':
			return i18next.t('auth.errors.tooManyRequests');
		default:
			return error.message;
	}
}

export { getErrorMessage, getsignInErrorMessage };

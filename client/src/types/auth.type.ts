export interface IUser {
	_id: string;
	name: string;
	email: string;
	date_of_birth: Date;
	password: string;
	created_at: Date;
	updated_at: Date;
	email_verify_token: string;
	forgot_password_token: string;
	verify: number;
	filePath: string;
	bio: string;
	location: string;
	website: string;
	username: string;
	avatar: string;
	cover_photo: string;
	tweeter_circle: string[];
}
export type IAuthResponse = {
	accessToken: string;
	refreshToken: string;
	user: IUser;
};

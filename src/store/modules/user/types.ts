import { AuthModel } from '~/models/auth';

export interface UserState {
	auth: Nullable<AuthModel>;
}

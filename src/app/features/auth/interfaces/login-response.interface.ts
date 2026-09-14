import { User } from "../../../core/models/user.model";

export interface LoginResponse {
  success: boolean;
  data: {
    token: string;
    user: User;
  };
}
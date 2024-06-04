export const RoleName = {
    ADMIN: 'Admin',
    USER: 'User',
  };

export type TCurrentUser = {
    user_id: string,
    role_id: string,
    username: string,
    phone_number: string,
    branch_id: string,
    email: string,
    password_hash: string,
    confirm_yn: string,
    created_at: string,
    updated_at: string,
}
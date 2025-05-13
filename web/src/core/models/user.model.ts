import { UserRoles } from "@core/enums/user-roles.enum";

export interface User {
    id: string;
    name: string;
    email: string;
    isEmailConfirmed: boolean;
    role: UserRoles;
    createdAt: Date;
    updatedAt: Date;
}
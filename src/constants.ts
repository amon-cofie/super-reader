enum UserRole {
    BASIC,
    MODERATOR,
    EDITOR,
    ADMIN,
  }
  
  interface UserRoleInterface {
    role: UserRole;
  }
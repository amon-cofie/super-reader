enum UserRole {
  BASIC,
  MODERATOR,
  EDITOR,
  ADMIN,
}

interface UserRoleInterface {
  role: UserRole;
}

// class TemplateJSONResponse {
//   //  success;
//   //  data;
//   // constructor(success: boolean, data: any) {
//   //   this.success = success;
//   //   this.data = data;
//   // }

//   static success = (message?: string, data?: any) => {
//     return {
//       success: true,
//       message: message,
//       data: data,
//     };
//   };

//   static failure = (message?: string, data?: any) => {
//     return {
//       success: false,
//       message: message,
//       data: data,
//     };
//   };
// }

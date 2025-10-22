export const RouteIndex = "/";
export const RouteSignIn = "/sign-in";
export const RouteSignUp = "/sign-up";
export const RouteForgotPassword = "/forgot-password";
export const RouteResetPassword = "/reset-password";
export const RouteOtpVerification = "/otp-verification";
export const RouteVerification = "/verification/";
export const RouteConfirmVerification = "/confirm-verification/:token";

export const RouteUpdateUserProfile = "/updateuser/:id";

// Catigories
export const RouteDashBoardCategory = "/categories";
export const RouteAddCategory = "/category/add";
export const RouteEditCategory = (id) => {
  if (id) {
    return `/category/update/${id}`;
  } else {
    return `/category/update/id`;
  }
};

// BLog
export const RouteDashBoardBlog = "/blogs";
export const RouteAddBlog = "/blog/add";
export const RouteEditBlog = (id) => {
  if (id) {
    return `/blog/update/${id}`;
  } else {
    return `/blog/update/id`;
  }
};

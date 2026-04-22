
export type AdminUser = {
  email: string;
  password: string;
  username: string;
};

export const ALLOWED_ADMINS: AdminUser[] = [
  {
    email: import.meta.env.VITE_ADMIN1_EMAIL || "",
    password: import.meta.env.VITE_ADMIN1_PASSWORD || "",
    username: import.meta.env.VITE_ADMIN1_USERNAME || ""
  },
  {
    email: import.meta.env.VITE_ADMIN2_EMAIL || "",
    password: import.meta.env.VITE_ADMIN2_PASSWORD || "",
    username: import.meta.env.VITE_ADMIN2_USERNAME || ""
  },
  {
    email: import.meta.env.VITE_ADMIN3_EMAIL || "",
    password: import.meta.env.VITE_ADMIN3_PASSWORD || "",
    username: import.meta.env.VITE_ADMIN3_USERNAME || ""
  }
];

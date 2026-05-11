export type TDatabase = {
  name: string;
  phone: string;
  scheduled_at: string;
  type_cut: "cabelo" | "barba" | "cabelo e barba";
  user_id?: number
};

export type TDatabaseUser = {
  id?: number
  name: string;
  email: string;
  password: string;
  role: 'user' | 'manager' | 'admin'
};

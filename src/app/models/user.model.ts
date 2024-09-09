export interface User {
  avatar: string;
  email: string;
  first_name: string;
  id: number;
  last_name: string;
}

export interface UserApiResponse {
  data: User[];
  page: number;
  per_page: number;
  support: {
    text: string;
    url: string;
  };
  total: number;
  total_pages: number;
}

export interface SingleUserApiResponse {
  data: User;
  support: {
    text: string;
    url: string;
  };
}

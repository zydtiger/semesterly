export interface User {
  friendRequestId: string;
  email: string;
  first_name: string;
  last_name: string;
  img_url: string;
  username: string;
  userId: string;
}

export interface FriendRequest {
  friendRequestId: number;
  userId: number;
  email: string;
  sender: {
    first_name: string;
    last_name: string;
    username: string;
    userId;
  };
  receiver: {
    first_name: string;
    last_name: string;
    username: string;
    userId;
  };
  img_url?: string | null;
}

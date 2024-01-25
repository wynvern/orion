interface UserType {
    username: string;
    fullName: string | undefined;
    id: string;
    followers?: {
        length: number;
    }[];
    following?: {
        length: number;
    }[];
    location?: string;
    biography?: string;
    createdAt: number;
}

export default UserType;

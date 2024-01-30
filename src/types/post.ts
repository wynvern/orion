export type Post = {
    id: string;
    content: string;
    createdAt: string; // You might want to use a more specific type for date
    updatedAt: string; // You might want to use a more specific type for date
    userId: string;
    user: {
        id: string;
        username: string; // Assuming there is a username property in the User model
    };
    comments: Comment[]; // Assuming Comment is another type you have
};

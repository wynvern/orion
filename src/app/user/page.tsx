'use client';

import { getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const RedirectToUser = () => {
    const router = useRouter();

    useEffect(() => {
        const redirect = async () => {
            const session = await getSession();

            // Assuming your session object has a user property with a username
            if (session?.user?.username) {
                router.push(`/user/${session.user.username}`);
            } else {
                // Handle the case where the username is not available in the session
                // You might redirect to a login page or another appropriate action
            }
        };

        redirect();
    }); // Empty dependency array ensures useEffect runs only once when the component mounts

    return (
        // You might want to render something here, or you can leave it empty
        <main className="flex h-full flex-col">
            <div className="h-full flex items-center justify-center">
                Redirecting...
            </div>
        </main>
    );
};
export default RedirectToUser;

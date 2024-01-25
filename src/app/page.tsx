import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';

const Home = async () => {
    const session = await getServerSession(authOptions);

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <p>Welcome {session?.user.username}</p>
        </main>
    );
};

export default Home;

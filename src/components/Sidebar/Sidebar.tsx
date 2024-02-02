import {
    BookmarkIcon,
    HomeIcon,
    PaperAirplaneIcon,
    UserIcon,
} from '@heroicons/react/24/solid';
import { Button, Image } from '@nextui-org/react';
import { getSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ProfileHeader from '../Header/ProfileDropdown';

const Sidebar = () => {
    const path = usePathname();
    const router = useRouter();
    const [tokenUsername, setTokenUsername] = useState<string | undefined>(
        '/user/abc'
    );

    const getProfileUsername = async () => {
        const session = await getSession();
        setTokenUsername(session?.user.username);
    };

    useEffect(() => {
        getProfileUsername();
    }, []);

    return (
        <div className="h-full w-full flex items-center justify-center p-4">
            <nav className="h-full flex flex-col justify-between">
                <div>
                    <Image
                        src="/static/logo.svg"
                        className="w-full h-auto"
                    ></Image>
                </div>
                <ul className="gap-y-4 flex flex-col">
                    <li>
                        <Button
                            variant="bordered"
                            style={{ border: 'none', padding: '6px' }}
                            color={path === '/' ? 'secondary' : 'default'}
                            isIconOnly={true}
                            onClick={() => {
                                router.push('/');
                            }}
                        >
                            <HomeIcon />
                        </Button>
                    </li>
                    <li>
                        <Button
                            variant="bordered"
                            style={{ border: 'none', padding: '6px' }}
                            isIconOnly={true}
                        >
                            <BookmarkIcon />
                        </Button>
                    </li>
                    <li>
                        <Button
                            variant="bordered"
                            style={{ border: 'none', padding: '6px' }}
                            isIconOnly={true}
                        >
                            <PaperAirplaneIcon />
                        </Button>
                    </li>
                    <li>
                        <Button
                            variant="bordered"
                            style={{ border: 'none', padding: '6px' }}
                            color={
                                path.includes(String(tokenUsername))
                                    ? 'secondary'
                                    : 'default'
                            }
                            isIconOnly={true}
                            onClick={() => {
                                router.push(`/user/${tokenUsername}`);
                            }}
                        >
                            <UserIcon />
                        </Button>
                    </li>
                </ul>
                <div>
                    <ProfileHeader />
                </div>
            </nav>
        </div>
    );
};

export default Sidebar;

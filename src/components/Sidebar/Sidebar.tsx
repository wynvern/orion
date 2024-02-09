import {
    BookmarkIcon,
    HomeIcon,
    MagnifyingGlassIcon,
    PaperAirplaneIcon,
    UserIcon,
} from '@heroicons/react/24/solid';
import { Button, Image } from '@nextui-org/react';
import { usePathname, useRouter } from 'next/navigation';
import ProfileHeader from '../Header/ProfileDropdown';

const Sidebar = () => {
    const path = usePathname();
    const router = useRouter();

    return (
        <div className="h-full w-full flex items-center justify-center p-4 rounded-3xl background-bg">
            <nav className="h-full flex flex-col justify-between">
                <div>
                    <Image
                        src="/static/logo.svg"
                        alt="Orion logo"
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
                            onClick={() => router.push('/search')}
                            color={
                                path.includes('/search')
                                    ? 'secondary'
                                    : 'default'
                            }
                            isIconOnly={true}
                        >
                            <MagnifyingGlassIcon />
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
                </ul>
                <div>
                    <ProfileHeader />
                </div>
            </nav>
        </div>
    );
};

export default Sidebar;

import {
    BookmarkIcon,
    HomeIcon,
    MagnifyingGlassIcon,
    PaperAirplaneIcon,
} from '@heroicons/react/24/solid';
import { Button } from '@nextui-org/react';
import { usePathname, useRouter } from 'next/navigation';

const SidebarMobile = () => {
    const path = usePathname();
    const router = useRouter();

    return (
        <div className="w-full flex items-center justify-center background-bg nav-mobile">
            <nav className="w-full flex flex-col justify-between p-5">
                <ul className="flex w-full justify-between">
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
            </nav>
        </div>
    );
};

export default SidebarMobile;

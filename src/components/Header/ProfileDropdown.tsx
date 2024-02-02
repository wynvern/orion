'use client';

import {
    ArrowLeftEndOnRectangleIcon,
    Cog6ToothIcon,
    InformationCircleIcon,
} from '@heroicons/react/24/solid';
import {
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
    Image,
} from '@nextui-org/react';
import { Session } from 'next-auth';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import SignOut from '../Form/confirmSignOut';

const ProfileHeader = () => {
    const [session, setSession] = useState<Session | null>();
    const [signOutOpen, setSignOutOpen] = useState(false);

    const router = useRouter();

    useEffect(() => {
        const executeLoad = async () => {
            const fetchSession = await getSession();

            setSession(fetchSession);
        };

        executeLoad();
    }, []);

    return (
        <div className="h-full">
            <Dropdown placement="bottom-end" className="background-bg border-d">
                <DropdownTrigger>
                    <div className="h-full">
                        <Image
                            alt="default"
                            src={`/api/image/avatar/${session?.user.id}`}
                            style={{
                                width: 'auto',
                                height: '100%',
                                display: 'block',
                                zIndex: '100',
                            }}
                            removeWrapper={true}
                        ></Image>
                    </div>
                </DropdownTrigger>
                <DropdownMenu aria-label="User Actions" variant="flat">
                    <DropdownItem
                        key="profile"
                        className="h-14 gap-2 border-radius-sys pl-5"
                    >
                        <p className="font-bold">
                            Logado como <b>{session?.user.username}</b>
                        </p>
                    </DropdownItem>
                    <DropdownItem
                        key="settings"
                        description="Configure o sistema"
                        className="border-radius-sys"
                        startContent={
                            <Cog6ToothIcon
                                scale={0.1}
                                className="w-14"
                                style={{
                                    padding: '10px',
                                }}
                            />
                        }
                    >
                        Configurações
                    </DropdownItem>
                    <DropdownItem
                        key="info"
                        description="Veja guias e contribua"
                        className="border-radius-sys"
                        startContent={
                            <InformationCircleIcon
                                scale={0.1}
                                className="w-14"
                                style={{
                                    padding: '10px',
                                }}
                            />
                        }
                    >
                        Ajuda e Feedback
                    </DropdownItem>
                    <DropdownItem
                        key="exit"
                        description="Desconecte-se de sua conta"
                        className="border-radius-sys text-danger"
                        onClick={() => setSignOutOpen(true)}
                        startContent={
                            <ArrowLeftEndOnRectangleIcon
                                scale={0.1}
                                className="w-14"
                                style={{
                                    padding: '10px',
                                }}
                            />
                        }
                    >
                        Sair
                    </DropdownItem>
                </DropdownMenu>
            </Dropdown>

            <SignOut isActive={signOutOpen} setIsActive={setSignOutOpen} />
        </div>
    );
};

export default ProfileHeader;

'use client';

import { NextUIProvider } from '../../lib/nextui';
import Sidebar from '../../components/Sidebar/Sidebar';
import { usePathname } from 'next/navigation';
import SidebarMobile from '../Sidebar/SidebarMobile';

import '../../styles/Toast.css';

import { SessionProvider, getSession } from 'next-auth/react';
import { ToastContainer } from 'react-toastify';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { Session } from 'next-auth';

export default function Orion({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const pathname = usePathname(),
        enabledSidebar =
            pathname === '/' ||
            pathname.includes('/user') ||
            pathname.includes('/search') ||
            pathname.includes('/post') ||
            pathname.includes('chat'),
        [session, setSession] = useState<Session | null | undefined>();

    useEffect(() => {
        const fetchSession = async () => {
            const data = await getSession();

            setSession(data);
        };

        fetchSession();
    }, []);

    useEffect(() => {
        if (session) {
            const socket = io('localhost:8000');

            socket.emit('authorize', { auth: session });
        }
    }, [session]);

    return (
        <NextUIProvider className="h-full">
            <SessionProvider>
                <div className="flex h-full">
                    {!enabledSidebar ? (
                        ''
                    ) : (
                        <div
                            className="flex h-full lg:block bg-transparent md:block sm:hidden p-6 pr-0"
                            style={{ width: '100px' }}
                        >
                            <Sidebar></Sidebar>
                        </div>
                    )}

                    {!enabledSidebar ? (
                        ''
                    ) : (
                        <div className="flex w-full lg:hidden md:hidden sm:fixed z-50 bottom-0 p-6">
                            <SidebarMobile></SidebarMobile>
                        </div>
                    )}

                    <div className="relative flex flex-1 flex-col overflow-x-hidden">
                        <main className="max-w-screen h-full">{children}</main>
                    </div>
                </div>
                <ToastContainer />
            </SessionProvider>
        </NextUIProvider>
    );
}

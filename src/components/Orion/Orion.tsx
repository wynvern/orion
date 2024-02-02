'use client';

import { NextUIProvider } from '../../lib/nextui';
import Sidebar from '../../components/Sidebar/Sidebar';
import { usePathname } from 'next/navigation';
import SidebarMobile from '../Sidebar/SidebarMobile';
import Header from '../Header/Header';
import { SessionProvider } from 'next-auth/react';

export default function Orion({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const pathname = usePathname();
    const disableSidebar =
        pathname.includes('/login') ||
        pathname.includes('/signup') ||
        pathname.includes('/verify');

    return (
        <NextUIProvider className="h-full">
            <SessionProvider>
                <div className="flex h-full">
                    {disableSidebar ? (
                        ''
                    ) : (
                        <div
                            className="flex h-full z-10 blurred-background-form lg:block md:block sm:hidden p-6 pr-0"
                            style={{ width: '100px' }}
                        >
                            <Sidebar></Sidebar>
                        </div>
                    )}

                    {disableSidebar ? (
                        ''
                    ) : (
                        <div className="flex w-full blurred-background-form lg:hidden md:hidden sm:fixed z-50 bottom-0 h-20">
                            <SidebarMobile></SidebarMobile>
                        </div>
                    )}

                    <div className="relative flex flex-1 flex-col overflow-x-hidden">
                        <main className="max-w-screen h-full">{children}</main>
                    </div>
                </div>
            </SessionProvider>
        </NextUIProvider>
    );
}

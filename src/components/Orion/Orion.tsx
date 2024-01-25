'use client';

import { NextUIProvider } from '../../lib/nextui';
import Sidebar from '../../components/Sidebar/Sidebar';
import { usePathname } from 'next/navigation';

export default function Orion({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const pathname = usePathname();
    const disableSidebar =
        pathname.includes('/login') || pathname.includes('/signup');

    return (
        <NextUIProvider>
            <div className="flex h-screen">
                {disableSidebar ? (
                    ''
                ) : (
                    <div className="flex h-full background-bg">
                        <Sidebar></Sidebar>
                    </div>
                )}

                <div className="relative flex flex-1 flex-col overflow-x-hidden">
                    <main className="max-w-screen">{children}</main>
                </div>
            </div>
        </NextUIProvider>
    );
}

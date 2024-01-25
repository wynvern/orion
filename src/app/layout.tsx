import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import '../styles/globals.css';
import Orion from '@/components/Orion/Orion';

const roboto = Roboto({
    subsets: ['latin'],
    weight: ['100', '300', '400', '500', '700', '900'],
});

export const metadata: Metadata = {
    title: 'Orion',
};

const RootLayout = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    return (
        <html lang="pt-BR">
            <body
                className={`${roboto.className}`}
                suppressHydrationWarning={true}
            >
                <div className="min-h-screen">
                    <Orion>{children}</Orion>
                </div>
            </body>
        </html>
    );
};

export default RootLayout;

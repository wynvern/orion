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
            <head>
                <link
                    rel="shortcut icon"
                    href="/static/logo.svg"
                    type="image/x-icon"
                />
            </head>
            <body
                className={`${roboto.className}`}
                suppressHydrationWarning={true}
            >
                <div className="h-dvh">
                    <Orion>{children}</Orion>
                </div>
            </body>
        </html>
    );
};

export default RootLayout;

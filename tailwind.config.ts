import { nextui } from '@nextui-org/react';
import type { Config } from 'tailwindcss';

const config: Config = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',

        // Nextui
        './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {},
        screens: {
            sm: '300px',
            md: '700px',
            lg: '1300px',
        },
    },
    darkMode: 'class',
    plugins: [
        nextui({
            layout: {
                borderWidth: {
                    small: '1px', // border-small
                    medium: '1px', // border-medium
                    large: '1px', // border-large
                },
            },
            themes: {
                light: {
                    colors: {
                        foreground: '#333',
                        secondary: '#ffffff',
                        primary: '#0079E8',
                    },
                },
                dark: {},
            },
        }),
    ],
};
export default config;

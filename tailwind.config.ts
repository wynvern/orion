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
                    },
                },
                dark: {},
            },
        }),
    ],
};
export default config;
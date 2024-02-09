import React, { useState, useEffect, Ref } from 'react';
import ProfileHeader from './ProfileDropdown';
import { Image } from '@nextui-org/react';

interface HeaderProps {
    reference: any;
}

const Header: React.FC<HeaderProps> = ({ reference }) => {
    const [prevScrollPos, setPrevScrollPos] = useState(0);
    const [visible, setVisible] = useState(true);

    const scrollThreshold = 20;

    useEffect(() => {
        const handleScroll = () => {
            setPrevScrollPos(reference.current.scrollTop);

            const scrollDifference =
                reference.current.scrollTop - prevScrollPos;

            if (scrollDifference > scrollThreshold) {
                // Scrolling down
                setVisible(false);
            } else if (scrollDifference < -scrollThreshold) {
                // Scrolling up
                setVisible(true);
            }
        };

        reference.current.addEventListener('scroll', handleScroll);
    });

    return (
        <div
            className={`absolute top-0 right-0 w-full transition-all duration-300 p-6 ${
                visible ? 'translate-y-0' : '-translate-y-40'
            }`}
            style={{ zIndex: '120' }}
        >
            <div className="p-4 background-bg border-radius-sys">
                <div className="flex items-center justify-between h-12">
                    <div className="h-12 w-12">
                        <Image
                            src="/static/logo.svg"
                            className="w-full h-auto"
                            alt="Orion logo"
                        ></Image>
                    </div>
                    <ProfileHeader />
                </div>
            </div>
        </div>
    );
};

export default Header;

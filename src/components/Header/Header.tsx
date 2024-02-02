import React, { useState, useEffect } from 'react';
import ProfileHeader from './ProfileDropdown';
import { Button } from '@nextui-org/react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';

interface HeaderProps {
    scrollY: number;
}

const Header: React.FC<HeaderProps> = ({ scrollY }) => {
    const [prevScrollPos, setPrevScrollPos] = useState(0);
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        setPrevScrollPos(scrollY);

        if (prevScrollPos > scrollY) {
            setVisible(true);
        } else {
            setVisible(false);
        }
    }, [scrollY]);

    return (
        <div
            className={`absolute top-0 right-0 z-50 w-full transition-all duration-300  ${
                visible ? 'translate-y-0' : '-translate-y-20'
            }`}
        >
            <div className="p-4 border-b blurred-background-form">
                <div className="flex items-center justify-between h-12">
                    <Button
                        variant="bordered"
                        style={{ border: 'none', padding: '6px' }}
                        isIconOnly={true}
                        color="secondary"
                    >
                        <MagnifyingGlassIcon />
                    </Button>
                    <ProfileHeader />
                </div>
            </div>
        </div>
    );
};

export default Header;

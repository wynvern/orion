import React, { useState, useEffect } from 'react';
import { Button, Image, Input, Tab, Tabs } from '@nextui-org/react';
import {
    CubeIcon,
    MagnifyingGlassIcon,
    UserIcon,
} from '@heroicons/react/24/solid';

interface SearchHeaderProps {
    scrollY: number;
    onSubmit: (data: string, type: string) => void;
}

const SearchHeader: React.FC<SearchHeaderProps> = ({ scrollY, onSubmit }) => {
    const [prevScrollPos, setPrevScrollPos] = useState(0);
    const [visible, setVisible] = useState(true);
    const [selected, setSelected] = useState('user');
    const [searchInput, setSearchInput] = useState('');

    const scrollThreshold = 20;

    useEffect(() => {
        setPrevScrollPos(scrollY);

        const scrollHandler = () => {
            const scrollDifference = scrollY - prevScrollPos;

            if (scrollDifference > scrollThreshold) {
                // Scrolling down
                setVisible(false);
            } else if (scrollDifference < -scrollThreshold) {
                // Scrolling up
                setVisible(true);
            }
        };

        scrollHandler();
    }, [scrollY, prevScrollPos]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            onSubmit(searchInput, selected);
        }
    };

    return (
        <div
            className={`absolute top-0 right-0 z-50 w-full transition-all duration-300 p-6 sm:px-6 md:px-40 lg:px-60 ${
                visible ? 'translate-y-0' : '-translate-y-40'
            }`}
        >
            <div className="p-4 background-bg border-radius-sys">
                <div className="w-full h-12">
                    <div className="flex gap-x-4 w-full h-12">
                        <Input
                            size="sm"
                            type="text"
                            placeholder="Digite algo..."
                            variant="bordered"
                            value={searchInput}
                            onKeyDown={handleKeyDown}
                            classNames={{
                                inputWrapper: 'border-color rounded-3xl  pl-6',
                            }}
                            onValueChange={(e) => {
                                setSearchInput(e);
                            }}
                        />
                        <Tabs
                            variant="bordered"
                            selectedKey={selected}
                            onSelectionChange={(e) => setSelected(e as string)}
                            size="lg"
                            classNames={{
                                tabList: 'rounded-3xl border-color h-12',
                                base: 'h-12',
                            }}
                            radius="full"
                        >
                            <Tab
                                key="user"
                                title={
                                    <div>
                                        <UserIcon className="h-4 w-4" />
                                    </div>
                                }
                            ></Tab>
                            <Tab
                                key="post"
                                title={
                                    <div>
                                        <CubeIcon className="h-4 w-4" />
                                    </div>
                                }
                            ></Tab>
                        </Tabs>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchHeader;

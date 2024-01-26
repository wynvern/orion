import { useEffect } from 'react';

interface PopupProps {
    children: React.ReactNode;
    opened: boolean;
}

const Popup: React.FC<PopupProps> = ({ children, opened }) => {
    return (
        <>
            {opened && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    {/* Background blur effect */}
                    <div className="fixed inset-0 bg-black opacity-50"></div>

                    {/* Popup container */}
                    <div className="border-d h-3/4 w-1/3 flex z-10 background-bg flex-col p-14">
                        {children}
                    </div>
                </div>
            )}
        </>
    );
};

export default Popup;

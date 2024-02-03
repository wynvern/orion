import React from 'react';
import { Button } from '@nextui-org/react';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';

const StartDM: React.FC = () => {
    const handleSendDM = () => {
        // Handle follower logic here
    };

    return (
        <Button
            isIconOnly={true}
            style={{ padding: '8px' }}
            onClick={handleSendDM}
        >
            <PaperAirplaneIcon />
        </Button>
    );
};

export default StartDM;

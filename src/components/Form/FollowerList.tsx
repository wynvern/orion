import UserType from '@/types/user';
import React, { useEffect, useState } from 'react';
import {
    Button,
    Image,
    Link,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
} from '@nextui-org/react';
import FollowUser from '../userActions/FollowUser';
import { getSession } from 'next-auth/react';
import { Session } from 'next-auth';
import UserList from '../User/UserList';
import { CubeTransparentIcon } from '@heroicons/react/24/solid';

interface FollowerListProps {
    isActive: boolean;
    setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
    userData: UserType;
}

interface FollowerData {
    data: any[];
    message: string;
    type: string;
}

const FollowerList: React.FC<FollowerListProps> = ({
    isActive,
    setIsActive,
    userData,
}) => {
    const [followerData, setFollowerData] = useState<any[]>([]);
    const [session, setSession] = useState<Session | null>();

    const fetchfollowers = async () => {
        const response = await fetch(`/api/user/${userData.id}/followers`);

        if (response.ok) {
            const data: FollowerData = await response.json();
            return data.data;
        } else {
            console.error(response.statusText);
        }
        return [];
    };

    useEffect(() => {
        const fetchAllUserFollowers = async () => {
            const session = await getSession();
            setSession(session);

            const data = await fetchfollowers();
            setFollowerData(data);
        };

        fetchAllUserFollowers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Modal
            isOpen={isActive}
            onOpenChange={() => setIsActive(false)}
            className="modal-style"
            classNames={{
                base: 'border-radius-sys lg:p-8 md:p-8 sm:p-6',
                closeButton: 'transition-all mt-6 mr-6 active:scale-80',
            }}
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1 pt-1">
                            Seguidores
                        </ModalHeader>
                        <ModalBody
                            className="flex flex-col flex-grow justify-between"
                            style={{ overflowY: 'auto' }}
                        >
                            {followerData.length ? (
                                <UserList
                                    session={session}
                                    users={followerData}
                                />
                            ) : (
                                <div className="w-full h-40 flex items-center justify-center flex-col">
                                    <CubeTransparentIcon className="h-20 mb-4" />
                                    <p>Está um pouco vazio por aqui.</p>
                                </div>
                            )}
                        </ModalBody>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};

export default FollowerList;

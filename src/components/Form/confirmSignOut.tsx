import React, { useState } from 'react';
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
} from '@nextui-org/react';
import { ArrowLeftEndOnRectangleIcon } from '@heroicons/react/24/solid';
import { signOut } from 'next-auth/react';
interface SignOutProps {
    isActive: boolean;
    setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
}

const SignOut: React.FC<SignOutProps> = ({ isActive, setIsActive }) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleSignOut = async () => {
        setIsLoading(true);
        await signOut();
    };

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
                        <ModalHeader className="flex flex-col gap-1 items-center">
                            <h1>Sair</h1>
                        </ModalHeader>
                        <ModalBody className="py-6">
                            <p className="text-center">
                                Tem certeza que deseja sair de sua conta? Será
                                necessário entrar novamente
                            </p>
                        </ModalBody>
                        <ModalFooter>
                            <Button
                                color="danger"
                                className="rounded-3xl h-14 w-full"
                                onClick={async () => {
                                    await handleSignOut();
                                    onClose();
                                }}
                                isLoading={isLoading}
                            >
                                Sair
                                <ArrowLeftEndOnRectangleIcon className="h-full p-1" />
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};

export default SignOut;

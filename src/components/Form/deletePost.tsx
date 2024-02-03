import React, { useState } from 'react';
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
} from '@nextui-org/react';
import { TrashIcon } from '@heroicons/react/24/solid';

interface DeletePostProps {
    isActive: boolean;
    setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
    uuid: string;
    handleDelete: () => void;
}

const DeletePost: React.FC<DeletePostProps> = ({
    isActive,
    setIsActive,
    uuid,
    handleDelete,
}) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleDeletePost = async () => {
        setIsLoading(true);
        await deletePost(uuid);
    };

    const deletePost = async (uuid: string) => {
        try {
            const response = await fetch(`/api/post/${uuid}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                handleDelete();
                setIsActive(false);
                setIsLoading(false);
            }
        } catch (e: any) {
            console.error('Error:', e.message);
        }
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
                            <h1>Excluír Post</h1>
                        </ModalHeader>
                        <ModalBody className="py-6">
                            <p className="text-center">
                                Tem certeza que deseja excluír este post? Não
                                será possível recuperá-lo.
                            </p>
                        </ModalBody>
                        <ModalFooter>
                            <Button
                                color="danger"
                                className="rounded-3xl h-14 w-full"
                                onClick={async () => {
                                    await handleDeletePost();
                                    onClose();
                                }}
                                isLoading={isLoading}
                            >
                                Excluír
                                <TrashIcon className="h-full p-1" />
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};

export default DeletePost;

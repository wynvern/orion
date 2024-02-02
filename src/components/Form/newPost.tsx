import React, { useRef, useState } from 'react';
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Textarea,
    Link,
    Image,
} from '@nextui-org/react';
import { PencilIcon, PhotoIcon, XMarkIcon } from '@heroicons/react/24/solid';

interface NewPostProps {
    isActive: boolean;
    setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
    handleCreatePost: () => void;
}

const CreatePost: React.FC<NewPostProps> = ({
    isActive,
    setIsActive,
    handleCreatePost,
}) => {
    const [newPostContent, setNewPostContent] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [uploadedImages, setUploadedImages] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;

        if (uploadedImages.length > 4) {
            return false;
        }

        if (files) {
            const imageUrls = Array.from(files).map((file) =>
                URL.createObjectURL(file)
            );
            setUploadedImages((prevImages) => [...prevImages, ...imageUrls]);
        }
    };

    const createPost = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/post', {
                method: 'POST',
                body: JSON.stringify({
                    text: newPostContent,
                    images: uploadedImages,
                }),
            });
            if (response.ok) {
                handleCreatePost();
                setIsLoading(false);
                setIsActive(false);
            }
        } catch (e: any) {
            console.error('Error:', e.message);
        }
        setIsLoading(false);
    };

    return (
        <Modal
            size="3xl"
            isOpen={isActive}
            onOpenChange={() => {
                setIsActive(false);
                setNewPostContent('');
            }}
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
                            Nova postagem
                        </ModalHeader>
                        <ModalBody className="py-6">
                            <Textarea
                                placeholder="Digite aqui..."
                                label="Conteúdo da postagem"
                                variant="bordered"
                                value={newPostContent}
                                onValueChange={(e) => {
                                    setNewPostContent(e);
                                }}
                            />

                            <div
                                className={`grid grid-cols-4 gap-4 ${
                                    uploadedImages.length > 0 ? 'mt-6' : ''
                                }`}
                            >
                                {uploadedImages.map((imageUrl, index) => (
                                    <div key={index} className="relative">
                                        <Button
                                            size="sm"
                                            onClick={() => {
                                                setUploadedImages(
                                                    (prevImages) =>
                                                        prevImages.filter(
                                                            (_, i) =>
                                                                i !== index
                                                        )
                                                );
                                            }}
                                            isIconOnly={true}
                                            className="absolute top-0 left-0 z-50 p-2 m-1"
                                        >
                                            <XMarkIcon className="h-1/1" />
                                        </Button>
                                        <Image
                                            src={imageUrl}
                                            alt={`Uploaded ${index}`}
                                            className="max-w-full max-h-32 object-contain"
                                        />
                                    </div>
                                ))}
                            </div>
                        </ModalBody>
                        <ModalFooter className="flex justify-between">
                            <div className="h-full">
                                <Button
                                    isIconOnly={true}
                                    variant="bordered"
                                    color="secondary"
                                    onClick={() =>
                                        fileInputRef.current?.click()
                                    }
                                >
                                    <PhotoIcon className="h-1/2" />
                                </Button>
                            </div>
                            <Button
                                color="primary"
                                onClick={() => {
                                    createPost();
                                    onClose();
                                }}
                                style={{ lineHeight: '1.5' }}
                                isLoading={isLoading}
                            >
                                Criar Postagem
                                <PencilIcon className="h-1/2" />
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
            <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={(e) => handleFileChange(e)}
                accept="image/*"
            />
        </Modal>
    );
};

export default CreatePost;

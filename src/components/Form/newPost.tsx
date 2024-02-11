import React, { useRef, useState } from 'react';
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Textarea,
    Image,
} from '@nextui-org/react';
import { PhotoIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/solid';

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
    const [uploadedMedia, setUploadedMedia] = useState<string[]>([]);
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [videoFiles, setVideoFiles] = useState<File[]>([]);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [wordCounter, setWordCounter] = useState(0);

    const countLetters = (text: string) => {
        const words = text.trim().split(/\s+/).join();
        setWordCounter(words.length);
    };

    const clearEverything = () => {
        setWordCounter(0);
        setUploadedMedia([]);
        setImageFiles([]);
        setVideoFiles([]);
    };

    const convertImagesToBase64 = async (images: File[]): Promise<string[]> => {
        const base64Promises = images.map((file) => {
            return new Promise<string>((resolve) => {
                const reader = new FileReader();
                reader.onload = () => {
                    const base64String = reader.result
                        ?.toString()
                        .split(',')[1] as string;
                    resolve(base64String);
                };
                reader.readAsDataURL(file);
            });
        });

        try {
            const base64Images = await Promise.all(base64Promises);
            return base64Images;
        } catch (error) {
            console.error('Error converting images to base64:', error);
            throw error;
        }
    };

    const convertVideosToBase64 = async (videos: File[]): Promise<string[]> => {
        const base64Promises = videos.map((file) => {
            return new Promise<string>((resolve) => {
                const reader = new FileReader();
                reader.onload = () => {
                    const base64String = reader.result
                        ?.toString()
                        .split(',')[1] as string;
                    resolve(base64String);
                };
                reader.readAsDataURL(file);
            });
        });

        try {
            const base64Videos = await Promise.all(base64Promises);
            return base64Videos;
        } catch (error) {
            console.error('Error converting videos to base64:', error);
            throw error;
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;

        if (
            imageFiles.length + (files?.length || 0) > 4 ||
            videoFiles.length + (files?.length || 0) > 4
        ) {
            return false;
        }

        if (files) {
            const newFiles = Array.from(files);
            newFiles.forEach((file) => {
                if (file.type.startsWith('image/')) {
                    setImageFiles((prevFiles) => [...prevFiles, file]);
                } else if (file.type.startsWith('video/')) {
                    setVideoFiles((prevFiles) => [...prevFiles, file]);
                }
            });

            const mediaUrls = newFiles.map((file) => URL.createObjectURL(file));
            setUploadedMedia((prevMedia) => [...prevMedia, ...mediaUrls]);
        }
    };

    const createPost = async () => {
        try {
            setIsLoading(true);
            const imageData = await convertImagesToBase64(imageFiles);
            const videoData = await convertVideosToBase64(videoFiles);

            const response = await fetch('/api/post', {
                method: 'POST',
                body: JSON.stringify({
                    text: newPostContent,
                    images: imageData,
                    videos: videoData,
                }),
            });

            if (response.ok) {
                handleCreatePost();
                setIsLoading(false);
                setIsActive(false);
                clearEverything();
            }
        } catch (error) {
            console.error('Error:', error);
        }
        setIsLoading(false);
    };

    return (
        <Modal
            size="3xl"
            isOpen={isActive}
            onOpenChange={() => {
                setIsActive(false);
                clearEverything();
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
                                size="lg"
                                placeholder="Digite aqui..."
                                label="Conteúdo da postagem"
                                variant="bordered"
                                value={newPostContent}
                                classNames={{
                                    inputWrapper: 'border-none p-0',
                                }}
                                onValueChange={(e) => {
                                    countLetters(e);
                                    setNewPostContent(e);
                                }}
                            />
                            <div>
                                <p className="text-neutral-600">
                                    {wordCounter}/200
                                </p>
                            </div>

                            <div
                                className={`grid grid-cols-4 gap-4 ${
                                    uploadedMedia.length > 0 ? 'mt-6' : ''
                                }`}
                            >
                                {uploadedMedia.map((imageUrl, index) => (
                                    <div key={index} className="relative">
                                        <Button
                                            size="sm"
                                            onClick={() => {
                                                setUploadedMedia((prevImages) =>
                                                    prevImages.filter(
                                                        (_, i) => i !== index
                                                    )
                                                );
                                                setImageFiles((prevFiles) =>
                                                    prevFiles.filter(
                                                        (_, i) => i !== index
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
                                    variant="bordered"
                                    color="secondary"
                                    style={{ border: 'none' }}
                                    isIconOnly={true}
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
                                <PlusIcon className="h-1/2" />
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
                accept=".jpg, .jpeg, .png, .mp4"
            />
        </Modal>
    );
};

export default CreatePost;

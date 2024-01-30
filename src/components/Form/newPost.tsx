import { useState } from 'react';
import { PencilIcon } from '@heroicons/react/24/solid';
import { Textarea } from '@nextui-org/react';
import { Button } from '@nextui-org/react';

interface NewPostProps {
    isActive: boolean;
    setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
    handleCreatePost: () => void; // Change the name of the function
}

const CreatePost: React.FC<NewPostProps> = ({
    isActive,
    setIsActive,
    handleCreatePost,
}) => {
    const [newPostContent, setNewPostContent] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);

    const createPost = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/post', {
                method: 'POST',
                body: JSON.stringify({ content: newPostContent }),
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
        <>
            {isActive && (
                <div
                    style={{
                        opacity: '0',
                    }}
                    className={`fixed inset-0 flex items-center justify-center z-50 py-6 ${
                        isActive ? 'active-popup' : ''
                    }`}
                >
                    {/* Background blur effect */}
                    <div
                        onClick={() => {
                            setIsActive(false);
                            setNewPostContent('');
                        }}
                        className="fixed inset-0 bg-black opacity-50"
                    ></div>

                    {/* Popup container */}
                    <div
                        className="border-d h-full lg:w-1/2 md:w-1/2 sm:w-2/3 flex flex-col justify-between  background-bg px-14 pb-10"
                        style={{
                            zIndex: '100',
                        }}
                    >
                        <div className="w-full flex items-center flex-col mt-10">
                            <h1>Nova postagem</h1>
                        </div>
                        <div
                            className="flex flex-col flex-grow justify-between my-14"
                            style={{ overflowY: 'auto' }}
                        >
                            <div className="mb-10">
                                <Textarea
                                    placeholder="Digite aqui..."
                                    label="Conteúdo da postagem"
                                    variant="bordered"
                                    classNames={{
                                        inputWrapper: 'border-color',
                                    }}
                                    value={newPostContent}
                                    onValueChange={(e) => {
                                        setNewPostContent(e);
                                    }}
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-x-4">
                            <Button
                                size="lg"
                                color="default"
                                onClick={() => {
                                    setIsActive(false);
                                    setNewPostContent('');
                                }}
                            >
                                Cancelar
                            </Button>
                            <Button
                                size="lg"
                                color="primary"
                                onClick={createPost}
                                style={{ lineHeight: '1.5' }}
                                isLoading={isLoading}
                            >
                                Criar Postagem
                                <PencilIcon className="h-1/2" />
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default CreatePost;

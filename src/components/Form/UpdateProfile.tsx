import UserType from '@/types/user';
import {
    CakeIcon,
    MapIcon,
    PencilIcon,
    UserIcon,
    XMarkIcon,
} from '@heroicons/react/24/solid';
import {
    Button,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Textarea,
} from '@nextui-org/react';
import { useEffect, useState } from 'react';

interface ProfileUpdateProps {
    isActive: boolean;
    setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
    handleProfileUpdate: () => void;
    userData: UserType;
}

const UpdateProfile: React.FC<ProfileUpdateProps> = ({
    isActive,
    setIsActive,
    handleProfileUpdate,
    userData,
}) => {
    const [atUpdateData, setAtUpdateData] = useState<UserType>(userData);
    const [isLoading, setIsLoading] = useState(false);

    const updateProfileData = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`/api/user`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(atUpdateData),
            });

            if (response.ok) {
                const data = await response.json();

                handleProfileUpdate();
                setIsLoading(false);
                setIsActive(false);
            }
        } catch (e: any) {
            console.error('Error:', e.message);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        if (!isActive) {
            setAtUpdateData(userData);
        }
    });

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
                            Editar Perfil
                        </ModalHeader>
                        <ModalBody
                            className="flex flex-col flex-grow justify-between py-6"
                            style={{ overflowY: 'auto' }}
                        >
                            {!atUpdateData ? (
                                ''
                            ) : (
                                <>
                                    <div className="mb-6">
                                        <Input
                                            type="text"
                                            placeholder="Nome Completo"
                                            isClearable={true}
                                            variant="bordered"
                                            classNames={{
                                                inputWrapper:
                                                    'border-color rounded-3xl',
                                                input: 'placeholder:text-neutral-600',
                                            }}
                                            startContent={
                                                <UserIcon className="h-1/2" />
                                            }
                                            value={atUpdateData.fullName}
                                            onValueChange={(e) => {
                                                setAtUpdateData((prevData) => ({
                                                    ...prevData,
                                                    fullName: e,
                                                }));
                                            }}
                                        />
                                    </div>
                                    <div className="mb-6">
                                        <Input
                                            type="text"
                                            placeholder="Localização"
                                            isClearable={true}
                                            variant="bordered"
                                            classNames={{
                                                inputWrapper:
                                                    'border-color rounded-3xl',
                                                input: 'placeholder:text-neutral-600',
                                            }}
                                            startContent={
                                                <MapIcon className="h-1/2" />
                                            }
                                            value={atUpdateData.location}
                                            onValueChange={(e) => {
                                                setAtUpdateData((prevData) => ({
                                                    ...prevData,
                                                    location: e,
                                                }));
                                            }}
                                        />
                                    </div>
                                    <div className="mb-6">
                                        <Input
                                            type="date"
                                            placeholder="Data de Aniversário"
                                            isClearable={true}
                                            variant="bordered"
                                            classNames={{
                                                inputWrapper:
                                                    'border-color rounded-3xl',
                                                input: 'placeholder:text-neutral-600',
                                            }}
                                            startContent={
                                                <CakeIcon className="h-1/2" />
                                            }
                                            value={atUpdateData.birthDate}
                                            onValueChange={(e) => {
                                                setAtUpdateData((prevData) => ({
                                                    ...prevData,
                                                    birthDate: e,
                                                }));
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <Textarea
                                            placeholder="Fale um pouco sobre você"
                                            label="Biografia"
                                            variant="bordered"
                                            classNames={{
                                                inputWrapper: 'border-color',
                                            }}
                                            value={atUpdateData.biography}
                                            onValueChange={(e) => {
                                                setAtUpdateData((prevData) => ({
                                                    ...prevData,
                                                    biography: e,
                                                }));
                                            }}
                                        />
                                    </div>
                                </>
                            )}
                        </ModalBody>
                        <ModalFooter className="flex justify-end gap-x-4">
                            <Button
                                color="secondary"
                                variant="bordered"
                                className="border-none"
                                onClick={() => {
                                    setIsActive(false);
                                    setAtUpdateData(userData);
                                }}
                            >
                                Cancelar
                                <XMarkIcon className="h-1/2" />
                            </Button>
                            <Button
                                color="primary"
                                onClick={updateProfileData}
                                style={{ lineHeight: '1.5' }}
                                isLoading={isLoading}
                            >
                                Salvar
                                <PencilIcon className="h-1/2" />
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};

export default UpdateProfile;

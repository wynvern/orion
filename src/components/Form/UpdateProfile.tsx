import UserType from '@/types/user';
import {
    CakeIcon,
    MapIcon,
    PencilIcon,
    UserIcon,
    XMarkIcon,
} from '@heroicons/react/24/solid';
import { Button, Input, Textarea } from '@nextui-org/react';
import { useState } from 'react';

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
                            setAtUpdateData(userData);
                        }}
                        className="fixed inset-0 bg-black opacity-50"
                    ></div>

                    {/* Popup container */}
                    <div
                        className="border-d blurred-bg-color h-full lg:w-2/3 md:w-3/4 sm:w-full flex flex-col justify-between blurred-background-form lg:px-14 md:px-14 sm:px-6 pb-10 max-w-lg"
                        style={{
                            zIndex: '100',
                        }}
                    >
                        <div className="w-full flex items-center flex-col mt-10">
                            <h1>Editar seu perfil</h1>
                        </div>
                        <div
                            className="flex flex-col flex-grow justify-between my-14"
                            style={{ overflowY: 'auto' }}
                        >
                            <div className="mb-10">
                                <Input
                                    type="text"
                                    label="Nome Completo"
                                    isClearable={true}
                                    variant="bordered"
                                    classNames={{
                                        inputWrapper: 'border-color',
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
                            <div className="mb-10">
                                <Input
                                    type="text"
                                    label="Localização"
                                    isClearable={true}
                                    variant="bordered"
                                    classNames={{
                                        inputWrapper: 'border-color',
                                    }}
                                    startContent={<MapIcon className="h-1/2" />}
                                    value={atUpdateData.location}
                                    onValueChange={(e) => {
                                        setAtUpdateData((prevData) => ({
                                            ...prevData,
                                            location: e,
                                        }));
                                    }}
                                />
                            </div>
                            <div className="mb-10">
                                <Input
                                    type="date"
                                    label="Data de Aniversário"
                                    isClearable={true}
                                    variant="bordered"
                                    classNames={{
                                        inputWrapper: 'border-color',
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
                        </div>
                        <div className="flex justify-end gap-x-4">
                            <Button
                                size="lg"
                                color="default"
                                onClick={() => {
                                    setIsActive(false);
                                    setAtUpdateData(userData);
                                }}
                            >
                                Cancelar
                                <XMarkIcon className="h-1/2" />
                            </Button>
                            <Button
                                size="lg"
                                color="primary"
                                onClick={updateProfileData}
                                style={{ lineHeight: '1.5' }}
                                isLoading={isLoading}
                            >
                                Salvar
                                <PencilIcon className="h-1/2" />
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default UpdateProfile;

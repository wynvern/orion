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
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    {/* Background blur effect */}
                    <div
                        onClick={() => setIsActive(false)}
                        className="fixed inset-0 bg-black opacity-50"
                    ></div>

                    {/* Popup container */}
                    <div className="border-d h-3/4 w-1/3 flex z-10 background-bg flex-col">
                        <div className="w-full flex items-center flex-col mt-10">
                            <h1>Editar seu perfil</h1>
                            <p>Personalize seu perfil.</p>
                        </div>
                        <div
                            className="p-14 flex flex-col justify-between"
                            style={{ flexGrow: '1' }}
                        >
                            <div>
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
                                <div className="mb-10">
                                    <Textarea
                                        type="date"
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
                            <div className="justify-end flex gap-x-4">
                                <Button
                                    size="lg"
                                    color="default"
                                    onClick={() => {
                                        setIsActive(false);
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
                </div>
            )}
        </>
    );
};

export default UpdateProfile;

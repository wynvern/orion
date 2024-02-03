'use client';

import { ChevronRightIcon, ShieldCheckIcon } from '@heroicons/react/24/solid';
import { Button, Input, Link } from '@nextui-org/react';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import React from 'react';

const VerifyEmail = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [codeSent, setCodeSent] = useState(false);
    const { update } = useSession();

    const [code, setCode] = useState('');
    const router = useRouter();
    const [codeInvalid, setCodeInvalid] = useState({
        bool: false,
        message: '',
    });

    const validateInput = () => {
        if (code.length < 6) {
            setCodeInvalid({
                bool: true,
                message: `O código não tem menos que 6 dígitos`,
            });
            return false;
        }

        return true;
    };

    const sendCode = async () => {
        setIsLoading(true);

        try {
            const response = await fetch('/api/verify/email', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();

                setCodeSent(true);
            } else {
                const data = await response.json();

                if (data.type === 'code-already-sent') {
                    setCodeInvalid({
                        bool: true,
                        message: `O código já foi enviado para seu Email`,
                    });
                }
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    const validateCode = async () => {
        setIsLoading(true);

        const validation = validateInput();
        if (!validation) {
            setIsLoading(false);
            return false;
        }

        try {
            const response = await fetch('/api/verify/email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ code: code }),
            });

            if (response.ok) {
                const data = await response.json();

                if (data.type === 'email-verified') {
                    update({ emailVerified: true });
                    setTimeout(() => {
                        router.push('/');
                    }, 500);
                }
            } else {
                const data = await response.json();

                if (
                    data.type === 'invalid-code' ||
                    data.type === 'code-not-found'
                ) {
                    setCodeInvalid({
                        bool: true,
                        message: `O código fornecido é inválido`,
                    });
                }
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = () => {
        signOut();
    };

    return (
        <div className="w-full h-full flex items-center justify-center">
            <div className="border-d lg:w-2/3 md:w-3/4 sm:w-full flex flex-col justify-between blurred-background-form lg:px-14 md:px-14 sm:px-6 pb-10 max-w-lg m-4">
                <div className="w-full flex items-center flex-col pt-10">
                    <h1>Verificar Email</h1>
                    <p className="text-center">
                        É preciso verificar o seu email para que comece a
                        utilizar a plataforma
                    </p>
                </div>
                <div className="py-10">
                    <Input
                        isDisabled={!codeSent}
                        placeholder="Código"
                        variant="bordered"
                        value={code}
                        isInvalid={codeInvalid.bool}
                        classNames={{
                            inputWrapper: 'border-color rounded-3xl',
                        }}
                        startContent={
                            <ShieldCheckIcon className="h-2/3 ml-4 mr-3" />
                        }
                        isClearable={true}
                        errorMessage={codeInvalid.message}
                        onValueChange={(e) => {
                            setCode(e);
                            setCodeInvalid({
                                message: '',
                                bool: false,
                            });
                        }}
                    />
                </div>
                <Button
                    color="primary"
                    className="rounded-3xl h-14"
                    onClick={() => {
                        if (codeSent) validateCode();
                        else sendCode();
                    }}
                    isLoading={isLoading}
                >
                    {codeSent ? 'Verificar código' : 'Enviar Email'}
                    <ChevronRightIcon className="h-full p-1" />
                </Button>
                <Link
                    color="secondary"
                    className="pt-6 w-full flex items-end justify-center"
                    onClick={handleLogout}
                >
                    Sair
                </Link>
            </div>
        </div>
    );
};

export default VerifyEmail;

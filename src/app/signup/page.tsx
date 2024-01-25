'use client';
import { Button, Input, Link } from '@nextui-org/react';
import {
    AtSymbolIcon,
    ChevronRightIcon,
    KeyIcon,
    UserIcon,
} from '@heroicons/react/24/solid';
import { Image } from '@nextui-org/react';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [usernameIsInvalid, setUsernameIsInvalid] = useState(false);
    const [emailIsInvalid, setEmailIsInvalid] = useState(false);
    const [passwordIsInvalid, setPasswordIsInvalid] = useState(false);
    const [buttonLoading, setButtonLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async () => {
        try {
            setButtonLoading(true);

            // Password validation
            if (password.length < 8) {
                setPasswordIsInvalid(true);
                return; // Don't proceed with the login if the password is too short
            }

            const response = await fetch('/api/user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    email,
                    password,
                }),
            });

            if (response.ok) {
                setTimeout(async () => {
                    const signInData = await signIn('credentials', {
                        email: email,
                        password: password,
                        redirect: false,
                    });

                    if (signInData?.error === null) {
                        router.push(`/user/${username}`);
                    }
                }, 1000);
            } else {
                const responsePretty = await response.json();

                if (responsePretty.type === 'username-in-use') {
                    console.log('Username already in use');
                    setUsernameIsInvalid(true);
                } else if (responsePretty.type === 'email-in-use') {
                    console.log('Email already in use');
                    setEmailIsInvalid(true);
                }
            }
        } catch (e: any) {
            console.error('Error:', e.message);
        } finally {
            setButtonLoading(false);
        }
    };

    return (
        <div className="flex w-full h-lvh items-center justify-center">
            <div className="border-d h-3/4 w-2/3 flex">
                <div className="w-1/2 h-full p-5">
                    <div className="w-full flex items-center flex-col mt-10">
                        <h1>Crie uma Conta</h1>
                        <p>
                            Frase extremamente dramática para página de signup.
                        </p>
                    </div>
                    <form className="p-14">
                        <div className="mb-10">
                            <Input
                                type="text"
                                label="Nome de usuário"
                                isClearable={true}
                                value={username}
                                variant="bordered"
                                classNames={{ inputWrapper: 'border-color' }}
                                startContent={<UserIcon className="h-1/2" />}
                                isInvalid={usernameIsInvalid}
                                errorMessage={
                                    usernameIsInvalid
                                        ? 'O nome de usuário escolhido está em uso.'
                                        : undefined
                                }
                                onValueChange={(e) => {
                                    setUsername(e);
                                    setUsernameIsInvalid(false); // Remove the warning when the user changes the input
                                }}
                            />
                        </div>
                        <div className="mb-10">
                            <Input
                                type="email"
                                label="Email"
                                isClearable={true}
                                value={email}
                                variant="bordered"
                                classNames={{ inputWrapper: 'border-color' }}
                                startContent={
                                    <AtSymbolIcon className="h-1/2" />
                                }
                                errorMessage={
                                    emailIsInvalid
                                        ? 'Este email já está em uso.'
                                        : undefined
                                }
                                onValueChange={(e) => {
                                    setEmail(e);
                                    setEmailIsInvalid(false); // Remove the warning when the user changes the input
                                }}
                            />
                        </div>
                        <div className="mb-10">
                            <Input
                                type="password"
                                label="Senha"
                                variant="bordered"
                                isClearable={true}
                                value={password}
                                isInvalid={passwordIsInvalid}
                                classNames={{ inputWrapper: 'border-color' }}
                                startContent={<KeyIcon className="h-1/2" />}
                                errorMessage={
                                    passwordIsInvalid
                                        ? 'A senha deve ter no mínimo 8 caracteres.'
                                        : undefined
                                }
                                onValueChange={(e) => {
                                    setPassword(e);
                                    setPasswordIsInvalid(false); // Remove the warning when the user changes the input
                                }}
                            />
                        </div>
                        <div className="w-full justify-between flex">
                            <div className="max-h-full flex items-center">
                                <Link href="/login" color="foreground">
                                    Já tem uma conta?
                                </Link>
                            </div>
                            <Button
                                size="lg"
                                color="primary"
                                onClick={handleLogin}
                                isLoading={buttonLoading}
                            >
                                Criar Conta
                                <ChevronRightIcon className="h-1/2" />
                            </Button>
                        </div>
                    </form>
                </div>
                <div className="w-1/2 h-full relative border-ll">
                    <Image
                        src={'/static/glass.png'}
                        alt="Picture of the author"
                        className="border-l"
                        style={{
                            height: '100%',
                            objectFit: 'cover',
                            border: 'none',
                        }}
                        removeWrapper={true}
                    />
                </div>
            </div>
        </div>
    );
};

export default Login;

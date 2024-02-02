'use client';
import { Button, Input, Link } from '@nextui-org/react';
import {
    AtSymbolIcon,
    ChevronRightIcon,
    EyeIcon,
    EyeSlashIcon,
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
    const [visible, setVisible] = useState(false);

    const toggleVisible = () => setVisible(!visible);

    const [usernameIsInvalid, setUsernameIsInvalid] = useState({
        bool: false,
        message: '',
    });
    const [emailIsInvalid, setEmailIsInvalid] = useState({
        bool: false,
        message: '',
    });
    const [passwordIsInvalid, setPasswordIsInvalid] = useState({
        bool: false,
        message: '',
    });

    const [buttonLoading, setButtonLoading] = useState(false);
    const router = useRouter();

    const verifyInputs = () => {
        const isUsernameValid = (username: string) => {
            if (!username) {
                setUsernameIsInvalid({
                    bool: true,
                    message: 'Este campo é obrigatório',
                });
                return false;
            }

            if (username.length > 20) {
                setUsernameIsInvalid({
                    bool: true,
                    message:
                        'O nome de usuário não pode ter mais que 20 caracteres',
                });
                return false;
            }

            if (/\s/.test(username) || /[^a-zA-Z0-9]/.test(username)) {
                setUsernameIsInvalid({
                    bool: true,
                    message:
                        'O nome de usuário não pode conter espaços ou caracteres especiais',
                });
                return false;
            }

            return true;
        };

        const isEmailValid = (email: string) => {
            if (!email || !email.includes('@') || !email.includes('.')) {
                setEmailIsInvalid({
                    bool: true,
                    message: 'Email inválido',
                });
                return false;
            }

            return true;
        };

        const isPasswordValid = (password: string) => {
            if (password.length < 8) {
                setPasswordIsInvalid({
                    bool: true,
                    message: 'A senha precisa ter no mínimo 8 caracteres',
                });
                return false;
            }

            return true;
        };

        // Usage of validation functions
        if (
            isUsernameValid(username) &&
            isEmailValid(email) &&
            isPasswordValid(password)
        ) {
            return true;
        }

        return false;
    };

    const handleLogin = async () => {
        try {
            setButtonLoading(true);
            const inputVal = verifyInputs();
            if (!inputVal) return false;

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
                const responsePretty = await response.json(); // Something?
            }
        } catch (e: any) {
            console.error('Error:', e.message);
        } finally {
            setButtonLoading(false);
        }
    };

    return (
        <div className="flex w-full h-full items-center justify-center lg:py-6 md:py-6 sm:py-4 lg:px-0 md:px-0 sm:px-2">
            <div className="border-d h-full lg:w-2/3 md:w-3/4 sm:w-full flex">
                <div className="lg:w-1/2 flex flex-col md:w-full sm:w-full h-full p-6">
                    <div className="w-full flex items-center flex-col pt-4 sm:py-0 md:py-10">
                        <h1>Criar Conta</h1>
                        <p>Crie uma conta e começe a diversão.</p>
                    </div>
                    <form className="md:px-10 lg:px-10 sm:px-2 py-10 grow flex flex-col justify-between">
                        <div>
                            <div className="mb-8">
                                <Input
                                    type="text"
                                    placeholder="Nome de usuário"
                                    isClearable={true}
                                    value={username}
                                    variant="bordered"
                                    classNames={{
                                        inputWrapper:
                                            'border-color rounded-3xl',
                                    }}
                                    startContent={
                                        <UserIcon className="h-2/3 ml-4 mr-3" />
                                    }
                                    isInvalid={usernameIsInvalid.bool}
                                    errorMessage={usernameIsInvalid.message}
                                    onValueChange={(e) => {
                                        setUsername(e);
                                        setUsernameIsInvalid({
                                            message: '',
                                            bool: false,
                                        }); // Remove the warning when the user changes the input
                                    }}
                                />
                            </div>
                            <div className="mb-8">
                                <Input
                                    type="email"
                                    placeholder="Email"
                                    isClearable={true}
                                    value={email}
                                    variant="bordered"
                                    classNames={{
                                        inputWrapper:
                                            'border-color rounded-3xl',
                                    }}
                                    startContent={
                                        <AtSymbolIcon className="h-2/3 ml-4 mr-3" />
                                    }
                                    isInvalid={emailIsInvalid.bool}
                                    errorMessage={emailIsInvalid.message}
                                    onValueChange={(e) => {
                                        setEmail(e);
                                        setEmailIsInvalid({
                                            message: '',
                                            bool: false,
                                        }); // Remove the warning when the user changes the input
                                    }}
                                />
                            </div>
                            <div className="mb-8">
                                <Input
                                    type={visible ? 'text' : 'password'}
                                    placeholder="Senha"
                                    variant="bordered"
                                    value={password}
                                    isInvalid={passwordIsInvalid.bool}
                                    classNames={{
                                        inputWrapper:
                                            'border-color rounded-3xl',
                                    }}
                                    startContent={
                                        <KeyIcon className="h-2/3 ml-4 mr-3" />
                                    }
                                    endContent={
                                        <>
                                            <button
                                                type="button"
                                                className="h-full p-2"
                                                onClick={toggleVisible}
                                            >
                                                {visible ? (
                                                    <EyeIcon className="h-full ml-4 mr-3" />
                                                ) : (
                                                    <EyeSlashIcon className="h-full ml-4 mr-3" />
                                                )}
                                            </button>
                                        </>
                                    }
                                    errorMessage={passwordIsInvalid.message}
                                    onValueChange={(e) => {
                                        setPassword(e);
                                        setPasswordIsInvalid({
                                            message: '',
                                            bool: false,
                                        }); // Remove the warning when the user changes the input
                                    }}
                                />
                            </div>
                            <div className="w-full justify-between flex">
                                <div className="max-h-full flex items-center">
                                    <Link href="/login" color="secondary">
                                        Já tem uma conta?
                                    </Link>
                                </div>
                                <Button
                                    size="lg"
                                    color="primary"
                                    className="rounded-3xl h-14"
                                    onClick={handleLogin}
                                    isLoading={buttonLoading}
                                >
                                    Criar Conta
                                    <ChevronRightIcon className="h-1/2" />
                                </Button>
                            </div>
                        </div>
                        <div className="w-full flex justify-center py-4">
                            Ou
                        </div>
                        <div>
                            <div className="mb-8">
                                <Button
                                    color="secondary"
                                    size="lg"
                                    variant="bordered"
                                    className="border-color rounded-3xl h-14 w-full"
                                    startContent={
                                        <div className="p-2">
                                            <img
                                                src="/company-logos/google.svg"
                                                style={{ width: '30px' }}
                                            ></img>
                                        </div>
                                    }
                                >
                                    Entre com o Google
                                </Button>
                            </div>
                            <div>
                                <Button
                                    color="secondary"
                                    size="lg"
                                    variant="bordered"
                                    className="border-color rounded-3xl h-14 w-full"
                                    startContent={
                                        <div className="p-2">
                                            <img
                                                src="/company-logos/github.svg"
                                                style={{ width: '30px' }}
                                            ></img>
                                        </div>
                                    }
                                >
                                    Entre com o Github
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>
                <div className="h-full relative border-ll lg:w-1/2 md:w-0 sm:w-0 md:hidden sm:hidden lg:block">
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

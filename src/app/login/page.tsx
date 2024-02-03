'use client';
import {
    AtSymbolIcon,
    ChevronRightIcon,
    EyeIcon,
    EyeSlashIcon,
    KeyIcon,
} from '@heroicons/react/24/solid';
import { Button, Input, Link } from '@nextui-org/react';
import { signIn } from 'next-auth/react';
import { Image } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordIsInvalid, setPasswordIsInvalid] = useState({
        bool: false,
        message: '',
    });
    const [emailIsInvalid, setEmailIsInvalid] = useState({
        bool: false,
        message: '',
    });
    const [buttonLoading, setButtonLoading] = useState(false);
    const router = useRouter();
    const [visible, setVisible] = useState(false);

    const toggleVisible = () => setVisible(!visible);

    const handleEnterKey = (event: any) => {
        if (event.key === 'Enter') {
            handleLogin();
        }
    };

    const verifyInputs = () => {
        if (!email.includes('@') || !email.includes('.')) {
            setEmailIsInvalid({ bool: true, message: 'Email inválido' });
            return false;
        }

        if (password.length <= 0) {
            setPasswordIsInvalid({
                bool: true,
                message: 'Este campo é obrigatório',
            });
            return false;
        }

        return true;
    };

    const handleLogin = async () => {
        setButtonLoading(true);

        const inputVal = verifyInputs();
        if (!inputVal) {
            setButtonLoading(false);
            return null;
        }

        try {
            const signInData = await signIn('credentials', {
                email: email,
                password: password,
                redirect: false,
            });

            if (signInData && signInData.error === null) {
                router.push(`/user`);
                return;
            }

            if (signInData && signInData.error === 'password-not-match') {
                setPasswordIsInvalid({ bool: true, message: 'Senha inválida' });
            } else if (signInData && signInData.error === 'email-not-found') {
                setEmailIsInvalid({
                    bool: true,
                    message: 'Uma conta com esse email não foi encontrada',
                });
            } else if (signInData && signInData.error === '401') {
                // Handle 401 Unauthorized error (wrong credentials)
                setPasswordIsInvalid({
                    bool: true,
                    message: 'Credenciais inválidas',
                });
            } else {
                // Handle other errors
                console.error('Unexpected error:', signInData);
            }

            setButtonLoading(false);
        } catch (e) {
            console.error('Error during login:', e);
            // Handle unexpected errors here
            setButtonLoading(false);
        }
    };

    return (
        <div className="flex w-full h-full items-center justify-center lg:py-6 md:py-6 sm:py-4 lg:px-0 md:px-0 sm:px-2">
            <div className="border-d h-full lg:w-2/3 md:w-3/4 sm:w-full flex">
                <div className="lg:w-1/2 flex flex-col md:w-full sm:w-full h-full p-6">
                    <div className="w-full flex items-center flex-col pt-4 sm:py-0 md:py-10">
                        <h1>Login</h1>
                        <p>Bem vindo de volta</p>
                    </div>
                    <form
                        className="md:px-10 lg:px-10 sm:px-2 py-10 grow flex flex-col justify-between"
                        onKeyDown={handleEnterKey}
                    >
                        <div>
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
                                    onValueChange={(e) => {
                                        setEmail(e);
                                        setEmailIsInvalid({
                                            bool: false,
                                            message: '',
                                        });
                                    }}
                                    startContent={
                                        <AtSymbolIcon className="h-2/3 ml-4 mr-3" />
                                    }
                                    isInvalid={emailIsInvalid.bool}
                                    errorMessage={emailIsInvalid.message}
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
                                    <Link href="/signup" color="secondary">
                                        Não tem uma conta?
                                    </Link>
                                </div>
                                <Button
                                    size="lg"
                                    color="primary"
                                    className="rounded-3xl h-14"
                                    onClick={handleLogin}
                                    isLoading={buttonLoading}
                                >
                                    Entrar
                                    <ChevronRightIcon className="h-full" />
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
                                    className="border-color rounded-3xl  h-14 w-full"
                                    startContent={
                                        <div className="p-2">
                                            <Image
                                                src="/company-logos/google.svg"
                                                style={{ width: '30px' }}
                                                removeWrapper={true}
                                                alt="Google logo"
                                            ></Image>
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
                                    className="border-color rounded-3xl  h-14 w-full"
                                    startContent={
                                        <div className="p-2">
                                            <Image
                                                src="/company-logos/github.svg"
                                                style={{ width: '30px' }}
                                                alt="Github logo"
                                                removeWrapper={true}
                                            ></Image>
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

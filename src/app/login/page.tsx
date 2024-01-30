'use client';
import {
    AtSymbolIcon,
    ChevronRightIcon,
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

            if (signInData?.error === null) {
                router.push(`/user`);
            }

            if (signInData?.error === 'password-not-match') {
                setPasswordIsInvalid({ bool: true, message: 'Senha inválida' });
            }

            if (signInData?.error === 'email-not-found') {
                setEmailIsInvalid({
                    bool: true,
                    message: 'Uma conta com esse email não foi encontrada',
                });
            }
            setButtonLoading(false);
        } catch (e) {
            console.log(e);
        }

        setButtonLoading(false);
    };

    return (
        <div className="flex w-full h-lvh items-center justify-center  py-6">
            <div className="border-d h-full w-2/3 flex">
                <div className="w-1/2 h-full p-5">
                    <div className="w-full flex items-center flex-col mt-10">
                        <h1>Login</h1>
                        <p>Bem vindo de volta</p>
                    </div>
                    <form className="p-14">
                        <div className="mb-10">
                            <Input
                                type="email"
                                label="Email"
                                isClearable={true}
                                value={email}
                                variant="bordered"
                                classNames={{ inputWrapper: 'border-color' }}
                                onValueChange={(e) => {
                                    setEmail(e);
                                    setEmailIsInvalid({
                                        bool: false,
                                        message: '',
                                    });
                                }}
                                startContent={
                                    <AtSymbolIcon className="h-1/2" />
                                }
                                isInvalid={emailIsInvalid.bool}
                                errorMessage={emailIsInvalid.message}
                            />
                        </div>
                        <div className="mb-10">
                            <Input
                                type="password"
                                label="Senha"
                                classNames={{ inputWrapper: 'border-color' }}
                                isClearable={true}
                                variant="bordered"
                                value={password}
                                onValueChange={(e) => {
                                    setPassword(e);
                                    setPasswordIsInvalid({
                                        bool: false,
                                        message: '',
                                    });
                                }}
                                startContent={<KeyIcon className="h-1/2" />}
                                isInvalid={passwordIsInvalid.bool}
                                errorMessage={passwordIsInvalid.message}
                            />
                        </div>
                        <div className="w-full justify-between flex">
                            <div className="max-h-full flex items-center">
                                <Link href="/signup" color="foreground">
                                    Não tem uma conta?
                                </Link>
                            </div>
                            <Button
                                size="lg"
                                color="primary"
                                onClick={handleLogin}
                                isLoading={buttonLoading}
                            >
                                Entrar
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

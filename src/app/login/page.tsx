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
    const [passwordIsInvalid, setPasswordIsInvalid] = useState(false);
    const [emailIsInvalid, setEmailIsInvalid] = useState(false);
    const [buttonLoading, setButtonLoading] = useState(false);
    const [customWarning, setCustomWarning] = useState('');
    const [passwordWarning, setPasswordWarning] = useState('');
    const router = useRouter();

    const handleLogin = async () => {
        setButtonLoading(true);

        try {
            const signInData = await signIn('credentials', {
                email: email,
                password: password,
                redirect: false,
            });

            if (signInData?.error === 'email-not-found') {
                setEmailIsInvalid(true);
                setCustomWarning('Nenhuma conta cadastrada com este email.');
            }
            if (signInData?.error === 'password-not-match') {
                setPasswordIsInvalid(true);
                setPasswordWarning('Senha inválida.');
            }
            if (signInData?.error === 'missing-data') {
                setPasswordIsInvalid(true);
                setEmailIsInvalid(true);
                setCustomWarning('Campos não podem ficar vazios.');
                setPasswordWarning('Campos não podem ficar vazios.');
            }

            if (signInData?.error === null) {
                router.push(`/user`);
            }
        } catch (e) {
            console.log(e);
        }

        setButtonLoading(false);
    };

    return (
        <div className="flex w-full h-lvh items-center justify-center">
            <div className="border-d h-3/4 w-2/3 flex">
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
                                    setPasswordIsInvalid(false);
                                    setEmailIsInvalid(false);
                                    setPasswordWarning('');
                                    setCustomWarning('');
                                }}
                                startContent={
                                    <AtSymbolIcon className="h-1/2" />
                                }
                                isInvalid={emailIsInvalid}
                                errorMessage={customWarning}
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
                                    setPasswordIsInvalid(false);
                                    setEmailIsInvalid(false);
                                    setPasswordWarning('');
                                    setCustomWarning('');
                                }}
                                startContent={<KeyIcon className="h-1/2" />}
                                isInvalid={passwordIsInvalid}
                                errorMessage={passwordWarning}
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

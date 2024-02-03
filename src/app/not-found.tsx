import { Link } from '@nextui-org/react';

const NotFound = () => {
    return (
        <main className="w-full h-full background-bg1 flex items-center justify-center">
            <div className="flex flex-col gap-y-4 items-center">
                <h1 className="text-6xl">404</h1>
                <p>A página requisitada não foi encontrada</p>
                <Link href="/login" color="secondary">
                    Voltar
                </Link>
            </div>
        </main>
    );
};

export default NotFound;

import {useState, useActionState, useEffect} from "react";

function App() {
    useEffect(() => {
        const userName = localStorage.getItem('userName');
        const password = localStorage.getItem('password');
        if (userName && password) {
            document.querySelector('input[name="userName"]').value = userName;
            document.querySelector('input[name="password"]').value = password;
        }
    })
    const [response, setResponse] = useState('');
    const [error, sendRequest, isPending] = useActionState(
        async (previousState, formData) => {
            localStorage.setItem('userName', formData.get('userName'))
            localStorage.setItem('password', formData.get('password'))
            const url = formData.get("endpoint").includes('http') ? formData.get("endpoint") : "http://localhost:3000" + formData.get("endpoint");
            await fetch(url, {
                headers: {
                    "Content-Type": "application/json",
                    "user-name": formData.get("userName"),
                    "user-pass": formData.get("password"),
                },
            }).then(res => {
                if (res.status === 200) {
                    setResponse(res.text());
                } else {
                    setResponse(res.statusText);
                    return res.statusText;
                }
            }).catch(() => {
                setResponse('Error de conexión');
                return 'Error de conexión'
            });

            return ''
        },
        '',
    );

    return (
        <div className={'h-svh flex justify-center items-center bg-gradient-to-br from-indigo-800 to-indigo-600'}>
            <div className={'flex items-center p-5 bg-white w-1/2 rounded-xl h-2/3'}>
                <div className={'w-1/2 p-5 h-full text-center'}>
                    <h1 className={'text-2xl font-bold text-gray-800'}>Formulario</h1>

                    <form action={sendRequest} className={'flex flex-col items-center justify-around w-full h-full'}>
                        <div className={'flex flex-col space-y-5 w-full'}>
                            <article className={'text-left w-full'}>
                                <h2 className={'text-gray-500'}>Usuario</h2>
                                <input name={'userName'}
                                       className={'rounded border-2 border-indigo-600 w-full h-10 p-2'}
                                       placeholder={'Nombre de Usuario'}/>
                            </article>
                            <article className={'text-left w-full'}>
                                <h2 className={'text-gray-500'}>Contraseña</h2>
                                <input name={'password'}
                                       className={'rounded border-2 border-indigo-600 w-full h-10 p-2'}
                                       placeholder={'Contraseña'}/>
                            </article>
                            <article className={'text-left w-full'}>
                                <h2 className={'text-gray-500'}>Endpoint</h2>
                                <input name={'endpoint'}
                                       className={'rounded border-2 border-indigo-600 w-full h-10 p-2'}
                                       placeholder={'/'}/>
                            </article>
                        </div>
                        <button type={'submit'}
                                className={'w-1/2 py-2 bg-indigo-600 font-bold text-white rounded hover:bg-indigo-700 hover:scale-105 transition-all'}>
                            {isPending ?
                                'Enviando...'
                                :
                                'Enviar'}
                        </button>
                    </form>

                </div>
                <div className={'h-2/3 w-0.5 bg-indigo-400 rounded-full'}/>
                <div className={'flex flex-col h-full w-1/2 items-center spacing-y-5 p-5'}>
                    <h1 className={'text-2xl font-bold text-gray-800'}>Response</h1>
                    <p className={`w-full overflow-scroll h-full p-5 border-1 ${error !== '' ? 'border-red-600' : ' border-gray-800'}`}>
                        {response}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default App

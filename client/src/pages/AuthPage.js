import {React, useContext, useEffect, useState} from 'react';
import { AuthContext } from '../context/AuthContext';
import { useHttp } from '../hooks/http.hook';
import {useMessage} from '../hooks/message.hook';

export const AuthPage = () => {
    const auth = useContext(AuthContext);
    const message = useMessage();
    const {loading, request, error, clearError} = useHttp();

    const [form, setForm] = useState({
        login: '', password: ''
    });

    useEffect(() => {
        message(error);
        clearError();
    }, [error, message, clearError]);

    useEffect(() => {
        window.M.updateTextFields();
    }, []);

    const changeHandler = event => {
        setForm({...form, [event.target.name]: event.target.value});
    }

    const registerHandler = async () => {
        try {
            const data = await request('/api/auth/register', 'POST', {...form});
            message(data.message);
        }
        catch (e) {}
    }

    const loginHandler = async () => {
        try {
            const data = await request('api/auth/login', 'POST', {...form});
            auth.login(data.token, data.userId);
            message(data.message);
        }
        catch (e) {}
    }

    return (
        <div className="row">
            <div className="col s6 offset-s3">
                <h1>MERN-project</h1>
                <div className="card blue darken-1">
                    <div className="card-content white-text">
                        <span className="card-title">Авторизация</span>
                        <div>
                        <div className="input-field">
                            <input
                                id="login"
                                type="text"
                                className="white-text"
                                name="login"
                                value={form.login}
                                onChange={changeHandler}
                            />
                            <label htmlFor="login" className="white-text">Логин</label>
                        </div>
                        <div className="input-field">
                            <input
                                id="password"
                                type="password"
                                className="white-text"
                                name="password"
                                value={form.password}
                                onChange={changeHandler}
                            />
                            <label htmlFor="password" className="white-text">Пароль</label>
                        </div>
                        </div>
                        <div className="card-action">
                            <button
                                className="btn yellow darken-4"
                                onClick={loginHandler}
                                disabled={loading}
                            >
                                Войти
                            </button>
                            <button
                                className="btn gray lighten-1 black-text"
                                onClick={registerHandler}
                                disabled={loading}
                            >
                                Регистрация
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
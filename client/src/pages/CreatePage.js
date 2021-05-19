import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { AuthContext } from '../context/AuthContext';
import { useHttp } from '../hooks/http.hook';

export const CreatePage = () => {
    const history = useHistory();
    const auth = useContext(AuthContext);
    const {request} = useHttp();
    const [link, setLink] = useState('');

    const pressHandler = async event => {
        if ( event.key === 'Enter' ) {
            try {
                const data = await request('/api/link/generate', 'POST', { from: link }, {
                    Authorization: `Bearer ${auth.token}`
                });
                console.log(data);
                history.push(`/detail/${data.link._id}`);
            }
            catch (e) {}
        }
    }

    useEffect(() => {
        window.M.updateTextFields();
    }, []);

    return (
        <div className="row">
            <div className="col s8 offset-s2">
                <div className="input-field">
                    <input
                        placeholder="Вставьте ссылку"
                        id="link"
                        type="text"
                        value={link}
                        onChange={e => setLink(e.target.value)}
                        onKeyPress={pressHandler}
                    />
                    <label htmlFor="link" className="blue-text">Ссылка</label>
                </div>
            </div>
        </div>
    )
}
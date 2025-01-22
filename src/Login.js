import { useEffect, useState } from 'react';
import styles from './Login.module.css';
import { requestAuthorization, getToken } from './authorization';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [clientId, setClientId] = useState('');
    const [clientSecret, setClientSecret] = useState('');
    const [query, setQuery] = useState(window.location.search);

    const navigate = useNavigate();

    function handleEmail (e) {
        setClientId(e.target.value);
    }

    function handlePassword (e) {
        setClientSecret(e.target.value);
    }

    function handleClick () {
        if (clientId === '' || clientSecret === '') {
            alert("Invalid Credentials");
            return;
        }
        window.localStorage.setItem('client_id', clientId);
        requestAuthorization(clientId);
    }

    useEffect (() => {
        if (query !== '' && query.includes('code')) {
            if(getToken())
                navigate('/app');
        }
    }, [query]);

    return (
        <div className={styles.main} onChange={() => {setQuery(window.location.search)}}>
            <div className={styles.login}>
                <div>
                    <label htmlFor='email'>Client-ID:</label>
                    <input type="text" id='email' style={{ marginLeft: 56 }} value={clientId} onChange={handleEmail} className={styles.inpField} />
                </div>
                <div>
                    <label htmlFor='password'>Client-Secret:</label>
                    <input id='password' type="password" value={clientSecret} onChange={handlePassword} className={styles.inpField} />
                </div>
                <input type="submit" value="Log In" onClick={handleClick} className={styles.submit} />
                <a>Forgot Password</a>
            </div>
        </div>
    );
}

export default Login;
import { useEffect, useState } from 'react';
import styles from './styles/Login.module.css';
import { requestAuthorization, getToken } from '../utililty_functions/authorization';
import { useNavigate } from 'react-router-dom';

// Component for rendering the Login page of the website
function Login() {
    // Saving and updating the state of the client id input 
    const [clientId, setClientId] = useState('');
    // Saving and updating the state of the client secret input
    const [clientSecret, setClientSecret] = useState('');
    // Saving the state of the url so that when it changes, the useEffect hook is called to change the path.
    const [query, setQuery] = useState(window.location.search);
    
    // navigate function from the useNavigate hook
    const navigate = useNavigate();
    
    // callback function that updates the clientId's state whenever some change is encountered by the client id input field.
    // Both the internal state and input field are always the same. 
    function handleClientId (e) {
        setClientId(e.target.value);
    }
    
    // callback function that updates the clientSecret's state whenever some change is encountered by the client secret input field.
    // Both the internal state and input field are always the same. 
    function handleClientSecret (e) {
        setClientSecret(e.target.value);
    }
    
    // Callback that is invoked when the submit button is pressed
    function handleClick () {
        // If either of the state's are empty it alert's the user and returns
        if (clientId === '' || clientSecret === '') {
            alert("Invalid Credentials");
            return;
        }
        // Else it stores the client id in local storage and calls requestAuthorization function with valid credentials.
        window.localStorage.setItem('client_id', clientId);
        requestAuthorization(clientId);
    }
    
    // The change of url when the user is redirected back to the login page from the spotify's authorization page triggers this hook
    useEffect (() => {
        // Checks if the query is not empty and that it contains the substring 'code' 
        if (query !== '' && query.includes('code')) {
            // Then it calls the getToken() function to get the token, and if the request is successful, redirects the user to the main page.
            if(getToken())
                navigate('/app');
        }
    }, [query, navigate]);
    
    // The main div that displays the background image and updates the query state whenever any change occurs
    return (
        <div className={styles.main} onChange={() => {setQuery(window.location.search)}}>
            {/*div displaying the login form*/}
            <div className={styles.login}>
                <div>
                    {/*Label for the Client-Id*/}
                    <label htmlFor='email'>Client-ID:</label>
                    {/*Input field for the client id*/}
                    <input type="text" id='email' style={{ marginLeft: 56 }} value={clientId} onChange={handleClientId} className={styles.inpField} />
                </div>
                <div>
                    {/*Label for the Client Secret*/}
                    <label htmlFor='password'>Client-Secret:</label>
                    {/*Input Field for the client secret*/}
                    <input id='password' type="password" value={clientSecret} onChange={handleClientSecret} className={styles.inpField} />
                </div>
                {/*Submit button that triggers the authorization process*/}
                <input type="submit" value="Log In" onClick={handleClick} className={styles.submit} />
            </div>
        </div>
    );
}

export default Login;
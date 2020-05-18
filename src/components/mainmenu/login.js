import React, { useState } from 'react';

function Login(props) {
    const [ loginState, setLoginState ] = useState('login');
    const [ userName, setUserName ] = useState('');
    const [ password, setPassword ] = useState('');
    const showLogin = () => {
        setLoginState('login');
    }
    const showRegister = () => {
        setLoginState('register');
    }
    const login = () => {
        props.socket.emit('login_attempt', { uName: userName, pass: password});
    }
    const register = () => {
        props.socket.emit('register_attempt', { uName: userName, pass: password});
    }
    return (
        <div className='d-flex justify-content-center'>
            <div className='login'>
                <div className='row login-btns'>
                    <div className='col'>
                        <div className='row'>
                            <div className='col-sm-3'>
                                <label htmlFor="nick">Nickname:</label>
                            </div>
                            <div className='col'>
                                <input type="text" id="nick" name="nick" value={userName} onChange={(e) => setUserName(e.target.value)}/>
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col-sm-3'>
                                <label htmlFor="pass">Password:</label>
                            </div>
                            <div className='col'>
                                <input type="password" id="pass" name="pass" value={password} onChange={(e) => setPassword(e.target.value)}/>
                            </div>
                        </div>
                        <div className='row submit-row'>
                            <div className='col'>
                                <button className="" id='submitBtn' type="button">{loginState === 'login' ? 'Login' : 'Register'}</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='row register-btns'>
                    <div className='col'>
                        <div className='row'>
                            <div className='col'>
                                <button className="" id='change' type="button" onClick={() => loginState === 'login' ? showRegister() : showLogin() }>
                                    {loginState === 'register' ? 'Login' : 'Register'}
                                </button>
                            </div>
                            <div className='col'>
                                <button className="" id='skip' type="button" onClick={props.goToMenu}>Just looking around</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
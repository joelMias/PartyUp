import * as React from 'react';
import { useEffect } from 'react';
import './login.css';
import { Form, FormGroup, Label, Input, FormText, Button } from 'reactstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import LoginData from '../../entity/LoginData';
import MyAlert from '../alerta/Alert';
import UserData from '../../entity/userData';

function Login(props) {
    const location = useLocation();
    const navigate = useNavigate();

    // Nou estat per controlar l'alert de registre
    // Només serà true si venim del register
    const [showRegisteredAlert, setShowRegisteredAlert] = React.useState(false);

    useEffect(() => {
        if (location.state?.registered) {
            setShowRegisteredAlert(true); // activem l'alert

            // Després de 3 segons, ocultem l'alert automàticament
            const timer = setTimeout(() => {
                setShowRegisteredAlert(false);
            }, 3000);

            // Neteja del timer si el component es desmonta abans
            return () => clearTimeout(timer);
        }
    }, []); // s'executa cada cop que canvia location.state


    useEffect(() => {
        props.setHidden(true);

        return () => {
            props.setHidden(false); //tornem a mostrar el link
        };

    }, []);

    const [loginData, setLoginData] = React.useState(new LoginData);
    const [errors, setErrors] = React.useState({});
    const [showPassword, setShowPassword] = React.useState(false);
    const [success, setSuccess] = React.useState(false);

    const [forgotPasswd, setForgotPasswd] = React.useState(false);

    const handleForgotPassword = () => {
        const newErrors = {};
        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const email = loginData.email;
        const isEmail = regexEmail.test(email);

        if (!email) {
            newErrors.email = "Missing field";
            setSuccess(false);
        }

        if (!isEmail && email) {
            newErrors.email = "Invalid email syntax";
            setSuccess(false);
        }

        setErrors(newErrors);
        if (Object.keys(newErrors).length !== 0) return;

        fetch("/api/sendCodeMail.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email })
        })
            .then(async res => {
                const text = await res.text();   // Primero obtenemos el texto crudo
                let data;
                try {
                    data = JSON.parse(text);     // Intentamos parsear JSON
                } catch (err) {
                    throw new Error("Invalid server response: " + text);
                }

                if (!res.ok || !data.success) {
                    throw new Error(data.message || "Error sending mail");
                }
                return data;
            })
            .then((data) => {
                console.log('Código enviado (solo testing):', data.code);
                setSuccess(true);
            })
            .catch(err => {
                setErrors({ server: err.message });
            });
    };

    const handleSubmit = () => {
        const newErrors = {};

        if (!loginData.eu) {
            newErrors.email = "Missing field";
            setSuccess(false);
        }

        if (!loginData.password) {
            newErrors.password = "Missing field";
            setSuccess(false);
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length !== 0) return;


        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isEmail = regexEmail.test(loginData.eu);


        const credentials = {
            email: isEmail ? loginData.eu : "",
            username: !isEmail ? loginData.eu : "",
            password: loginData.password
        };
        console.log(credentials);

        fetch("/api/login.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(credentials)
        })

            .then(async res => {
                // LLegim la resposta com a text (per si el servidor retorna un error que no és JSON)
                const text = await res.text();
                let data;

                try {
                    data = JSON.parse(text); // intentem de passar-ho a JSON
                } catch (err) {
                    throw new Error("Invalid server response: " + text);
                }

                if (!res.ok || !data.success) {
                    throw new Error(data.message || "Login error");
                }

                return data;
            })


            .then((data) => {
                const usuarioActual = new UserData(); //Creem un usuari on guardarem lles dades del usuari loggejat

                usuarioActual.id = data.userId;
                usuarioActual.username = data.username;
                usuarioActual.state = data.state;
                usuarioActual.description = data.description;
                usuarioActual.avatar = data.avatar;
                usuarioActual.email = data.email;

                props.setUserData(usuarioActual);

                localStorage.setItem("user", JSON.stringify({
                    id: data.userId,
                    email: data.email,
                    username: data.username,
                    state: data.state,
                    description: data.description,
                    avatar: data.avatar
                }));

                // Si hem arribat aquí, vol dir que el login ha estat correcte
                // Naveguem a la pàgina principal
                props.setHidden(false);
                props.setIsLoggedIn(true);

                navigate("/dashboard", {
                    state: { loggedIn: true }
                });
            })
            .catch(err => {
                // Si hi ha hagut algun error (HTTP o JSON), el capturem aquí
                // Mostrem el missatge d'error al usuari
                setErrors({ server: err.message });
            });



    };

    return (
        <div>
            {/*Alerta d'error de servidor'*/}
            {errors.server && (
                <div className="alert-container">
                    <MyAlert type="error" title="Server Error" message={errors.server} />
                </div>
            )}

            {/*Alerta d'error en el formulari*/}
            {Object.keys(errors).length > 0 && !errors.server && (
                <div className="alert-container">
                    <MyAlert type="warning" title="Check Input" message="Please fix the highlighted fields." />
                </div>
            )}

            {/*Alerta de usuari registrat correctament*/}
            {success && (
                <div className="alert-container">
                    <MyAlert type="success" title="Success" message="User registered successfully!" />
                </div>
            )}

            <div className='mainFormulari'>
                {/* Alert només si venim del registre */}
                {showRegisteredAlert && (
                    <MyAlert
                        type="success"
                        title="Success"
                        message="User registered successfully! You can now log in."
                    />
                )}

                <div id='contenidor-formulari' className='formulari'>
                    {!forgotPasswd ? (
                        <>
                            <div className='contenidorTitolLogIn'>
                                <h1 className='titolLogIn'>Log In</h1>
                            </div>
                            <p className='textLogin'>Welcome back! Please enter your credentials to continue.</p>
                            <Form id='formulariLogin'>
                                <FormGroup className="camp">
                                    <Label for="email" className='textLogin'> Username or Email address*</Label>
                                    <Input
                                        id='email'
                                        name='email'
                                        placeholder=""
                                        type="email"
                                        className={`celda ${errors.email ? "celdaIncorrecte" : ""}`}
                                        onChange={(val) => setLoginData({ ...loginData, eu: val.target.value })}
                                    />
                                </FormGroup>

                                <FormGroup className="camp">
                                    <Label for="password" className='textLogin'> Password *</Label>
                                    <div className="password-wrapper">
                                        <Input
                                            id='password'
                                            className={`celda ${errors.password ? "celdaIncorrecte" : ""}`}
                                            name='password'
                                            type="password"
                                            onChange={(val) => setLoginData({ ...loginData, password: val.target.value })}
                                        />
                                        <span className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
                                            👁
                                        </span>
                                    </div>
                                </FormGroup>

                                <div className='contenidor-botoLogin'>
                                    <Button type='button' className='botoLogin' onClick={handleSubmit}>
                                        Log In
                                    </Button>

                                    <Link to="/register" id='main' className='textLogin'>
                                        Don't have an account?
                                    </Link>
                                    <Link to="#" id='main' className='textLogin' onClick={() => setForgotPasswd(true)}>
                                        Forgot password?
                                    </Link>
                                </div>
                            </Form>
                        </>
                    ) : (
                        <div className='forgotPasswd-container'>
                            <h2>Forgot your password?</h2>
                            <p>Enter your email address below and we'll send you instructions on how to reset it.</p>
                            <label className='etiquetaInput'>
                                <p>Email address</p>
                                <p>(required)</p>
                            </label>
                            <input
                                id='emailForgotPasswd'
                                name='emailForgotPasswd'
                                className='celda mailForgotPasswd'
                                onChange={(val) => setLoginData({ ...loginData, email: val.target.value })}>
                            </input>
                            <button onClick={handleForgotPassword}>Send Code</button>
                            <Link to="#" className='cancelForgotPasswd' onClick={() => setForgotPasswd(false)}>
                                Cancel
                            </Link>
                        </div>

                    )}
                </div>
            </div>
        </div>
    );
}

export default Login;
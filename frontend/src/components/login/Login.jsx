import * as React from 'react';
import { useEffect } from 'react';
import './login.css';
import { Form, FormGroup, Label, Input, FormText, Button } from 'reactstrap';
import { Link, useNavigate } from 'react-router-dom';
import LoginData from '../../entity/LoginData';
import MyAlert from '../alerta/Alert';

function Login(props){
    const navigate = useNavigate();
    const [hideAlert, setHideAlert] = React.useState(false);

    React.useEffect(() =>{
        if(!hideAlert){
            const timer = setTimeout(() => {
                setHideAlert(true);
            }, 3000);

            return () => {
                clearTimeout(timer);
            }
        }
    }, []);
    

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
        // Llegim la resposta del servidor i la convertim a JSON
        const data = await res.json();

        // Comprovem si la resposta HTTP NO és correcta (res.ok)
        // O si el JSON indica que success = false
        if (!res.ok || !data.success) {
            // Si hi ha error, llancem una excepció amb el missatge que vingui del backend
            throw new Error(data.message || "Login error");
            setSuccess(false);
        }

        // Si tot va bé, retornem el JSON per al següent .then
        return data;
        })


        .then(() => {
            // Si hem arribat aquí, vol dir que el login ha estat correcte
            // Naveguem a la pàgina principal
            navigate("/");
        })
        .catch(err => {
            // Si hi ha hagut algun error (HTTP o JSON), el capturem aquí
            // Mostrem el missatge d'error al usuari
            setErrors({ server: err.message });
        });

        

    };

    return(
        <div>
            {errors.server && <MyAlert  type="error" title="Server Error" message={errors.server} />}
            {Object.keys(errors).length > 0 && !errors.server && <MyAlert  type="warning" title="Check Input" message="Please fix the highlighted fields." />}
            {success && <MyAlert  type="success" title="Success" message="User registered successfully!" />}

            {!hideAlert && <MyAlert
                type="success"
                title="Success"
                message="User registered successfully! You can now log in."
            />}

            <div id='contenidor-formulari' className='formulari'>
                
                <h1>Log In</h1>
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
                            onChange={(val) => setLoginData({...loginData, eu: val.target.value})}
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
                                onChange={(val) => setLoginData({...loginData, password: val.target.value})}
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
                        <Link to="/" id='main' className='textLogin'>
                            Forgot password?
                        </Link>
                    </div>
            </Form>
            </div>
        </div>
    );
}

export default Login;
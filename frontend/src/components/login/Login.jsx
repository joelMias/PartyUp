import * as React from 'react';
import { useEffect } from 'react';
import './login.css';
import { Form, FormGroup, Label, Input, FormText, Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import LoginData from '../../entity/LoginData';


function Login(props){
    useEffect(() => {
    props.setHidden(true);

    return () => {
        props.setHidden(false); //tornem a mostrar el link
    };

    }, []);

    const [loginData, setLoginData] = React.useState(new LoginData);
    const [errors, setErrors] = React.useState({});
    const [showPassword, setShowPassword] = React.useState(false);

    const handleSubmit = () => {
        const newErrors = {};
        let correctPassword = false;

        if (!loginData.eu){
            newErrors.email = "Missing field";
        }

        if (!loginData.password){
            newErrors.password = "Missing field";
        }


        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regexEmail.test(loginData.eu)) {
            setLoginData(prev => ({ ...prev, email: loginData.eu, username: "" }));
        } else {
            setLoginData(prev => ({ ...prev, username: loginData.eu, email: "" }));
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {

            fetch("http://localhost/Projecte_PartyUp/BACKEND/api/login.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(loginData)
            })


            .then(res => res.json())


            .then(data => {

                if (data.success) {

                    navigate("/");
                } else {
                    setErrors({ server: data.message });
                }
            })

            .catch(() => {
                setErrors({ server: "Server error" });
            });
        }

    };

    return(
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
                    {errors.email && <span className="error-msg">{errors.email}</span>}
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
                    {errors.password && <span className="error-msg">{errors.email}</span>}
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
    );
}

export default Login;
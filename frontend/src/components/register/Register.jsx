import * as React from 'react';
import { Form, FormGroup, Label, Input, FormText, Button } from 'reactstrap';
import { SlArrowLeft, SlArrowRight } from "react-icons/sl";
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import RegisterData from '../../entity/RegisterData';
import './register.css';

function Register(props) {
    let navigate = useNavigate();
    
    // el useEffect s'executa quan es monta el component dins es posa el que s'ha de fer quan es crei el component 
    // i al return el que ha de pasar quan surtim del component
    React.useEffect(() => {
    props.setHidden(true);


    return () => {
      props.setHidden(false); //tornem a mostrar el link
    };

    }, []); // el [] significa que només s'executara al montar i desmontar

    const [registerData, setRegisterData] = React.useState(new RegisterData);
    const [errors, setErrors] = React.useState({});
    const [showPassword, setShowPassword] = React.useState(false);

    const handleSubmit = () => {
        const newErrors = {};

        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regexEmail.test(registerData.email)) {
            newErrors.email = "Invalid email.";
        }

        let contMayus=0;
        let contMinus=0;
        let contNum=0;
        let contSpecialChar=0;

        if (!registerData.password || registerData.password.length < 8) {
            newErrors.password = "Password must be at least 8 characters";
        } else {
            for(let i=0; i<registerData.password.length; i++){
                const char = registerData.password.charAt(i);
                if(/[A-Z]/.test(char)) contMayus++;
                else if(/[a-z]/.test(char)) contMinus++;
                else if(/[0-9]/.test(char)) contNum++;
                else if(/[^A-Za-z0-9]/.test(char)) contSpecialChar++;
            }
        }

        if (contMayus==0 || contMinus==0 || contNum==0 || contSpecialChar==0) newErrors.password =  newErrors.password = "Password must include uppercase, lowercase, number, and special character.";;

        if (registerData.gender != "Male" && registerData.gender != "Female" && registerData.gender != "Other") newErrors.gender = "Gender required.";
        if (!registerData.username) newErrors.username = "Username required.";
        if (!registerData.date) newErrors.date = "Birth date required.";


        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {

            // Enviem les dades del registre al backend (PHP)
            fetch("/api/register.php", {
                method: "POST", // Tipus de petició: POST (enviem dades)
                headers: {
                    // Indiquem que enviem JSON
                    "Content-Type": "application/json"
                },
                // Convertim l'objecte registerData a JSON
                body: JSON.stringify(registerData)
            })

            // Convertim la resposta del servidor a JSON
            .then(res => res.json())

            // Tractem la resposta del PHP
            .then(data => {
                // Si el PHP retorna success = true
                if (data.success) {
                    // Redirigim l'usuari a la pàgina de login
                    navigate("/login");
                } else {
                    // Si hi ha algun error (email duplicat, error BD, etc.)
                    // guardem el missatge d'error per mostrar-lo al formulari
                    setErrors({ server: data.message });
                }
            })

            // Si el servidor no respon o hi ha un error de xarxa
            .catch(() => {
                setErrors({ server: "Server error" });
            });
        }

    };

    return (
        <div>
            <h1 className='title-register'><img src="img/mando.png" />Join Party-Up</h1>
            <p className='text-register'>Create your profile and find your perfect teammates</p>

            <div id='main'>
                <Form className='formulari'>
                        {errors.server && <p className="error-msg">{errors.server}</p>}
                        <FormGroup>
                            <Label for="email" className='textLogin'>Email address *</Label>
                            <Input
                                id="email"
                                className={`celda ${errors.email ? "celdaIncorrecte" : ""}`}
                                name="email"
                                placeholder="your.email@example.com"
                                type="email"
                                onChange={(val) => setRegisterData({...registerData, email: val.target.value})}
                            />
                            {errors.email && <span className="error-msg">{errors.email}</span>}
                        </FormGroup>

                        <FormGroup>
                            <Label for="username" className='textLogin'>Username *</Label>
                            <Input 
                                id="username" 
                                className={`celda ${errors.username ? "celdaIncorrecte" : ""}`} 
                                name="username" 
                                placeholder="Example32" 
                                type="text"
                                onChange={(val) => setRegisterData({...registerData, username: val.target.value})}
                            />
                            {errors.username && <span className="error-msg">{errors.username}</span>}
                        </FormGroup>

                        <FormGroup>
                            <Label for="password" className='textLogin'>Password *</Label>
                            <div className="password-wrapper">
                                <Input 
                                    id="password" 
                                    className={`celda ${errors.password ? "celdaIncorrecte" : ""}`} 
                                    name="password" 
                                    type= {showPassword ? "text" : "password"} 
                                    placeholder="••••••••" 
                                    onChange={(val) => setRegisterData({...registerData, password: val.target.value})}
                                />
                                <span className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
                                    👁
                                </span>
                            </div>
                            {errors.password && <span className="error-msg">{errors.password}</span>}
                        </FormGroup>

                        <FormGroup>
                            <Label for="gender" className='textLogin'>Gender *</Label>
                            <Input 
                                id="gender" 
                                className={`celda ${errors.gender ? "celdaIncorrecte" : ""}`}  
                                name="gender" 
                                type="select"
                                defaultValue=""
                                onChange={(val) => setRegisterData({...registerData, gender: val.target.value})}
                            >
                                <option value="" disabled></option>
                                <option>Male</option>
                                <option>Female</option>
                                <option>Other</option>
                            </Input>
                            {errors.gender && <span className="error-msg">{errors.gender}</span>}
                        </FormGroup>

                        <FormGroup>
                            <Label for="date" className='textLogin'>Birth Date *</Label>
                            <Input 
                                id="date" 
                                className={`celda ${errors.date ? "celdaIncorrecte" : ""}`} 
                                name="date" 
                                type="date"
                                onChange={(val) => setRegisterData({...registerData, date: val.target.value})}
                            />
                            {errors.date && <span className="error-msg">{errors.date}</span>}
                        </FormGroup>

                        <div id='botons'>
                            <Link to="/" id="main" className="button-register" onClick={() => props.setHidden(false)}>
                                <SlArrowLeft /> Previous
                            </Link>

                            
                            <Button type="button" className="button-register" onClick={handleSubmit}>
                            Next <SlArrowRight />
                            </Button>

                        </div>
                </Form>
            </div>
        </div>
    );
}

export default Register;
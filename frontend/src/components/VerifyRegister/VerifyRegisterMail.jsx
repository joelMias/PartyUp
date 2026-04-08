import { useParams } from 'react-router-dom';

function VerifyRegisterMail(){
    //React buscara a la URL i el que trobi ens ho guardarà la variable
    const { token } = useParams();

        return(
            <div>
                <h1>Verifying account</h1>
                <p>Your code is { token }</p>
            </div>
        )
}

export default VerifyRegisterMail;
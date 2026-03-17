import { IoClose } from "react-icons/io5";
import "./account.css";
import { useEffect, useState } from "react";
import { Form, FormGroup, Label, Input, FormText, Button } from 'reactstrap';

function Account() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);       

    const handleChangeUsername = (e) => {
        const { name, value } = e.target;
        setUser(prevUser => ({
            ...prevUser,
            [name]: value
        }));
    };

    const handleChangeEmail = (e) => {
        const { name, value } = e.target;
        setUser(prevUser => ({
            ...prevUser,
            [name]: value
        }));
    };
  return (
    <div className="accountContainer">
      <FormGroup className="formgroup">
        <Label htmlFor="username">Username</Label>
        <div>
            <Input 
                type="text" 
                id="username" 
                name="username" 
                value={user?.username || "your username"} 
                onChange={handleChangeUsername}
            />
            <button>Edit</button>
        </div>
      </FormGroup>

      <FormGroup className="formgroup">
        <Label htmlFor="email">Email address</Label>
        <div>
            <Input 
                type="text" 
                id="email" 
                name="email" 
                value={user?.email || "your email"} 
                onChange={handleChangeEmail}
            />
            <button>Edit</button>
        </div>
            
      </FormGroup>

      <FormGroup className="formgroup">
        <Label htmlFor="region">Region</Label>
        <Input type="select" id="region" name="region" />
      </FormGroup>

      <FormGroup className="formgroup">
        <Label htmlFor="gameStyle">Game style</Label>
        <Input type="select" id="gameStyle" name="gameStyle" />
      </FormGroup>
    </div>
  );
}

export default Account;
import { IoClose } from "react-icons/io5";
import "./account.css";
import { useEffect, useState } from "react";
import { Form, FormGroup, Label, Input, FormText, Button } from 'reactstrap';

function Account() {
    const [user, setUser] = useState(null);
    const [editUserName, setEditUserName] = useState(false);
    const [editMail, setEditMail] = useState(false);

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

    const handleSave = async (field) => {
      const storedUser = JSON.parse(localStorage.getItem("user"));

      if (storedUser[field] === user[field]) return;

      await fetch("/api/updateProfile.php", {
          method: "POST",
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify({
              field,
              value: user[field],
              id: storedUser.id
          })
      });

      localStorage.setItem("user", JSON.stringify(user));

      if (field === "username") setEditUserName(false);
      if (field === "email") setEditMail(false);
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
                value={user?.username || ""}
                disabled={!editUserName} 
                onChange={handleChangeUsername}
            />
            {!editUserName ? (
              <button onClick={() => setEditUserName(true)}>Edit</button>
            ) : (
              <button onClick={() => { handleSave("username"); setEditUserName(false); }}>Save</button>
            )}
        </div>
      </FormGroup>

      <FormGroup className="formgroup">
        <Label htmlFor="email">Email address</Label>
        <div>
            <Input 
                type="text" 
                id="email" 
                name="email" 
                value={user?.email || ""} 
                disabled={!editMail}
                onChange={handleChangeEmail}
            />
            {!editMail ? (
              <button onClick={() => setEditMail(true)}>Edit</button>
            ) : (
              <button onClick={() => { handleSave("email"); setEditMail(false); }}>Save</button>
            )}
        </div>
            
      </FormGroup>

      <FormGroup className="formgroup">
        <Label htmlFor="region">Region</Label>
        <Input type="select" id="region" name="region" />
      </FormGroup>

      <FormGroup className="formgroup">
        <Label htmlFor="gameStyle">Game style</Label>
        <Input type="select" id="gameStyle" name="gameStyle">
          <option>Both</option>
          <option>Chill/Casual</option>
          <option>Competitive</option>
        </Input>
      </FormGroup>
    </div>
  );
}

export default Account;
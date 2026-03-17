import { IoClose } from "react-icons/io5";
import "./containerOption.css";
import Account from "../account/Account";
import Friends from "../friends/Friends";
import Privacy from "../privacy/Privacy";
import { useState } from "react";


function ContainerOption({ title, icon, close }) {

  const components = {
    "account": <Account />,
    "friends": <Friends />,
    "privacy": <Privacy />
  };

  const [selectedOption, setSelectedOption] = useState(null);


  return (

    <div className="boxContainer">
      <div className="headerContainer">
        <h1 className="titleHeader">{title}</h1>
        <div className="rightHeader">
          {icon && <img src={icon} alt="User Avatar" className="avatarHeader" />}
          <IoClose className="closeIcon" onClick={close} />
        </div>
      </div>


      <div className="contentContainer">
        <div className="profile-content">
          <div className="profile-options">
            <div className="container-avatar">
              <img
                src="/img/User-avatar.png"
                alt="User avatar"
                className="avatarProfile"
              />
              <button className="changeAvatar-btn">Change Avatar</button>
            </div>
          </div>

          <div className="configuration-options">
            <div className="optionsList">
              <button className="option-btn" onClick={() => setSelectedOption("account")}>
                Account Settings
              </button>
              <button className="option-btn" onClick={() => setSelectedOption("friends")}>
                Friends Management
              </button>
              <button className="option-btn" onClick={() => setSelectedOption("privacy")}>
                Privacy Settings
              </button>
            </div>

            <div className="deleteAccount-container">
              <button className="option-btn deleteAccountBtn">Delete Account</button>
            </div>
          </div>
        </div>

        <div className="contentSelectedOption">
          {selectedOption && components[selectedOption]}
        </div>
      </div>
    </div>

  );
}

export default ContainerOption;
function Profile() {
  return (
    <>
        <div className="profile">
            <div className="profile-header">
                <h1>My Profile</h1>
                <img
                    src="/img/closeProfile.png"
                    alt="close profile"
                    className="closeProfile-btn"
                />
            </div>

            <div className="generalContainerProfile">
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
                        <div>
                            <button className="option-btn">Account Settings</button>
                            <button className="option-btn">Friends Management</button>
                            <button className="option-btn">Privacy Settings</button>
                        </div>

                        <div>
                            <button className="deleteAccount-btl">Delete Account</button>
                        </div>
                    </div>
                </div>

                <div className="selected-optionConf">
                    
                </div>
                
            </div>
        </div>
    </>
  );
}

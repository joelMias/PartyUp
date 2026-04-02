import { IoClose } from "react-icons/io5";
import "./friends.css";
import { useEffect, useState } from "react";


function Friends() {
  
  const [friends, setFriends] = useState([]);

  useEffect( () => {
    fetch("/api/getFriends.php")
    .then(res => res.json())
    .then(data => setFriends(data))
    .catch(err => console.log(err));
  }, []);

  return (
    <div>
      <div className="container-friendsNow">
        <h2>Friends List ( {friends.filter(friend => friend.state == "friends").length} )</h2>
      </div>
      <div className="container-blockedFriends">
      
      </div>
    </div>
  );
}

export default Friends;
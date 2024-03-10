import React, { useState, useEffect } from "react";
import { List, ListItem, ListItemText, Button } from "@mui/material";
import {
  getFetchFriendsEndpointEndpoint,
  getRemoveFriendEndpoint,
} from "../../../constants/endpoints";
import { User } from "./Types";

const CurrentFriends = () => {
  const [friends, setFriends] = useState<User[]>([]);

  useEffect(() => {
    const getFriends = async () => {
      const response = await fetch(getFetchFriendsEndpointEndpoint());
      const responseJson = await response.json();
      setFriends(responseJson);
    };
    getFriends();
  }, []);

  const removeFriend = async (userId: string) => {
    await fetch(getRemoveFriendEndpoint(userId));
    setFriends((prevFriends) =>
      prevFriends.filter((friend) => friend.userId !== userId)
    );
  };

  return (
    <List className="modal-content">
      {friends.length === 0 ? (
        <ListItem sx={{ justifyContent: "center" }}>No friends</ListItem>
      ) : (
        friends.map((friend) => (
          <ListItem key={friend.userId} sx={{ justifyContent: "space-between" }}>
            <ListItemText primary={`${friend.first_name} ${friend.last_name}`} />
            <Button
              variant="contained"
              color="secondary"
              onClick={() => removeFriend(friend.userId)}
            >
              Remove Friend
            </Button>
          </ListItem>
        ))
      )}
    </List>
  );
};

export default CurrentFriends;

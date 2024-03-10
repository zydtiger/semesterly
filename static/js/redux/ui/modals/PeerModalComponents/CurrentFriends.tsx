import React, { useState, useEffect } from "react";
import { List, ListItem, ListItemText, Button } from "@mui/material";
import {
  getFetchFriendsEndpointEndpoint,
  getRemoveFriendEndpoint,
} from "../../../constants/endpoints";
import { User } from "./Types";

/**
 * This is the modal that pops up when a new news post has been published. It displays
 * the text of the news post, which is created and edited in the Django admin panel.
 */
const CurrentFriends = () => {
  const [friends, setFriends] = useState<User[]>([]);

  const removeFriend = async (userId: string) => {
    const response = await fetch(getRemoveFriendEndpoint(userId));
    setFriends(friends.filter((friend) => friend.userId !== userId));
  };

  useEffect(() => {
    const getFriends = async () => {
      const response = await fetch(getFetchFriendsEndpointEndpoint());
      const responseJson = await response.json();
      setFriends(responseJson);
    };
    getFriends();
  }, []);

  console.log(friends);

  return (
    <List className="modal-content">
      {friends.length === 0 ? (
        <ListItem style={{ display: "flex", justifyContent: "center" }}>
          No friends
        </ListItem>
      ) : (
        friends.map((friend) => (
          <ListItem
            key={friend.userId}
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <ListItemText primary={friend.first_name + friend.last_name} />
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

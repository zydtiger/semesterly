import React, { useState, useEffect } from "react";
import { List, ListItem, ListItemText, Button } from "@mui/material";
import { getFriendRequestsSentEndpoint } from "../../../constants/endpoints";
import { User } from "./Types";

/**
 * This is the modal that pops up when a new news post has been published. It displays
 * the text of the news post, which is created and edited in the Django admin panel.
 */
const RequestsSent = () => {
  const [usersRequested, setUsersRequested] = useState<User[]>([]);

  useEffect(() => {
    const getFriendRequestsSent = async () => {
      const response = await fetch(getFriendRequestsSentEndpoint());
      const responseJson = await response.json();
      console.log(responseJson);
      setUsersRequested(responseJson);
    };
    getFriendRequestsSent();
  }, []);

  const withdrawFriendRequest = () => {
    console.log("withdraw friend request");
  };

  return (
    <List className="modal-content">
      {usersRequested.length === 0 ? (
        <ListItem style={{ display: "flex", justifyContent: "center" }}>
          No requests sent
        </ListItem>
      ) : (
        usersRequested.map((user) => (
          <ListItem
            key={user.username}
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <ListItemText primary={`${user.first_name} ${user.last_name}`} />
            <Button
              variant="contained"
              color="secondary"
              onClick={() => withdrawFriendRequest()}
            >
              Withdraw
            </Button>
          </ListItem>
        ))
      )}
    </List>
  );
};

export default RequestsSent;

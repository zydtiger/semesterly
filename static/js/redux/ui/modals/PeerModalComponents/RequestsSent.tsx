import React, { useState, useEffect } from "react";
import { List, ListItem, ListItemText, Button } from "@mui/material";
import {
  getFriendRequestsSentEndpoint,
  getWithdrawFriendRequestEndpoint,
} from "../../../constants/endpoints";
import { User } from "./Types";
import Cookie from "js-cookie";

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
      setUsersRequested(responseJson);
    };
    getFriendRequestsSent();
  }, []);

  const withdrawFriendRequest = async (userId: String) => {
    await fetch(getWithdrawFriendRequestEndpoint(userId), {
      headers: {
        "X-CSRFToken": Cookie.get("csrftoken"),
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      credentials: "include",
    });
    const newUsersRequested = usersRequested.filter((user) => user.userId !== userId);
    setUsersRequested(usersRequested.filter((user) => user.userId !== userId));
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
              onClick={() => withdrawFriendRequest(user.userId)}
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

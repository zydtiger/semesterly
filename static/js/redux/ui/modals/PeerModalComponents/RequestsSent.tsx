import React, { useState, useEffect } from "react";
import { List, ListItem, ListItemText, Button } from "@mui/material";
import {
  getFriendRequestsSentEndpoint,
  getWithdrawFriendRequestEndpoint,
} from "../../../constants/endpoints";
import { User } from "./Types";
import Cookie from "js-cookie";

const RequestsSent = () => {
  const [usersRequested, setUsersRequested] = useState<User[]>([]);

  useEffect(() => {
    const fetchFriendRequestsSent = async () => {
      const response = await fetch(getFriendRequestsSentEndpoint());
      const responseJson = await response.json();
      setUsersRequested(responseJson);
    };
    fetchFriendRequestsSent();
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
    setUsersRequested((users) => users.filter((user) => user.userId !== userId));
  };

  return (
    <List className="modal-content">
      {usersRequested.length === 0 ? (
        <ListItem style={{ justifyContent: "center" }}>No requests sent</ListItem>
      ) : (
        usersRequested.map((user) => (
          <ListItem key={user.username} style={{ justifyContent: "space-between" }}>
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

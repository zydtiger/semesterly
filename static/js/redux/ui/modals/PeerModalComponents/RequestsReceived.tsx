import React, { useState, useEffect } from "react";
import { List, ListItem, ListItemText, Button, Grid } from "@mui/material";
import {
  getAcceptFriendRequestEndpoint,
  getFriendRequestsReceivedEndpoint,
  getRejectFriendRequestEndpoint,
} from "../../../constants/endpoints";
import { User } from "./Types";

const RequestsReceived = () => {
  const [usersRequesting, setUsersRequesting] = useState<User[]>([]);

  useEffect(() => {
    const fetchFriendRequestsReceived = async () => {
      const response = await fetch(getFriendRequestsReceivedEndpoint());
      const responseJson = await response.json();
      setUsersRequesting(responseJson);
    };
    fetchFriendRequestsReceived();
  }, []);

  const handleFriendRequest = async (friendRequestId: string, action: string) => {
    const endpoint =
      action === "accept"
        ? getAcceptFriendRequestEndpoint(friendRequestId)
        : getRejectFriendRequestEndpoint(friendRequestId);
    await fetch(endpoint);
    setUsersRequesting((users) =>
      users.filter((user) => user.friendRequestId !== friendRequestId)
    );
  };

  return (
    <List className="modal-content">
      {usersRequesting.length === 0 ? (
        <ListItem style={{ justifyContent: "center" }}>No requests received</ListItem>
      ) : (
        usersRequesting.map((user) => (
          <ListItem key={user.username} style={{ justifyContent: "space-between" }}>
            <Grid container spacing={2}>
              <Grid item xs={2}>
                <ListItemText primary={`${user.first_name} ${user.last_name}`} />
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => handleFriendRequest(user.friendRequestId, "accept")}
                >
                  Accept
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => handleFriendRequest(user.friendRequestId, "reject")}
                >
                  Ignore
                </Button>
              </Grid>
            </Grid>
          </ListItem>
        ))
      )}
    </List>
  );
};

export default RequestsReceived;

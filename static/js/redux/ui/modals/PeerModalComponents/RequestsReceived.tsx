import React, { useState, useEffect } from "react";
import { List, ListItem, ListItemText, Button, Grid } from "@mui/material";
import {
  getAcceptFriendRequestEndpoint,
  getFriendRequestsReceivedEndpoint,
  getRejectFriendRequestEndpoint,
} from "../../../constants/endpoints";
import { User } from "./Types";

/**
 * This is the modal that pops up when a new news post has been published. It displays
 * the text of the news post, which is created and edited in the Django admin panel.
 */
const RequestsReceived = () => {
  const [usersRequesting, setUsersRequesting] = useState<User[]>([]);

  useEffect(() => {
    const getFriendRequestsSent = async () => {
      const response = await fetch(getFriendRequestsReceivedEndpoint());
      const responseJson = await response.json();
      setUsersRequesting(responseJson);
    };
    getFriendRequestsSent();
  }, []);

  const acceptFriendRequest = async (friendRequestId: string) => {
    const response = await fetch(getAcceptFriendRequestEndpoint(friendRequestId));
    setUsersRequesting(
      usersRequesting.filter((user) => user.friendRequestId !== friendRequestId)
    );
  };

  const ignoreFriendRequest = async (friendRequestId: string) => {
    const response = await fetch(getRejectFriendRequestEndpoint(friendRequestId));
    setUsersRequesting(
      usersRequesting.filter((user) => user.friendRequestId !== friendRequestId)
    );
  };

  return (
    <List className="modal-content">
      {usersRequesting.length === 0 ? (
        <ListItem style={{ display: "flex", justifyContent: "center" }}>
          No requests received
        </ListItem>
      ) : (
        usersRequesting.map((user) => (
          <ListItem
            key={user.username}
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <Grid container spacing={2}>
              <Grid item xs={2}>
                <ListItemText primary={`${user.first_name} ${user.last_name} `} />
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => acceptFriendRequest(user.friendRequestId)}
                >
                  Accept
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => ignoreFriendRequest(user.friendRequestId)}
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

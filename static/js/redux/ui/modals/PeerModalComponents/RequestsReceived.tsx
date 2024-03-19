import React, { useState, useEffect } from "react";
import {
  List,
  ListItem,
  ListItemText,
  Button,
  Grid,
  CircularProgress,
} from "@mui/material";
import {
  getAcceptFriendRequestEndpoint,
  getFriendRequestsReceivedEndpoint,
  getRejectFriendRequestEndpoint,
} from "../../../constants/endpoints";
import { User } from "./Types";

const RequestsReceived = () => {
  const [usersRequesting, setUsersRequesting] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFriendRequestsReceived = async () => {
      try {
        const response = await fetch(getFriendRequestsReceivedEndpoint());
        const responseJson = await response.json();
        setUsersRequesting(responseJson);
      } catch (error) {
        console.error("Error fetching friend requests received:", error);
      } finally {
        setLoading(false);
      }
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

  const renderContent = () => {
    if (loading) {
      return (
        <ListItem style={{ justifyContent: "center" }}>
          <CircularProgress />
        </ListItem>
      );
    }

    if (usersRequesting.length === 0) {
      return (
        <ListItem style={{ justifyContent: "center" }}>No requests received</ListItem>
      );
    }

    return usersRequesting.map((user) => (
      <ListItem key={user.username}>
        <Grid container spacing={2}>
          <Grid item xs={7}>
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
    ));
  };

  return <List>{renderContent()}</List>;
};

export default RequestsReceived;

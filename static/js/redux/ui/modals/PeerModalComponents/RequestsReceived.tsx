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
import { FriendRequest, User } from "./Types";

const RequestsReceived = () => {
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFriendRequestsReceived = async () => {
      try {
        const response = await fetch(getFriendRequestsReceivedEndpoint());
        const responseJson = await response.json();
        setFriendRequests(responseJson);
      } catch (error) {
        console.error("Error fetching friend requests received:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFriendRequestsReceived();
  }, []);

  const handleFriendRequest = async (friendRequestId: number, action: string) => {
    const endpoint =
      action === "accept"
        ? getAcceptFriendRequestEndpoint(friendRequestId)
        : getRejectFriendRequestEndpoint(friendRequestId);
    await fetch(endpoint);
    setFriendRequests((currentFriendRequests) =>
    currentFriendRequests.filter((fr) => fr.friendRequestId !== friendRequestId)
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

    if (friendRequests.length === 0) {
      return (
        <ListItem style={{ justifyContent: "center" }}>No requests received</ListItem>
      );
    }

    return friendRequests.map((fr) => (
      <ListItem key={fr.friendRequestId}>
        <Grid container spacing={2}>
          <Grid item xs={7}>
            <ListItemText primary={`${fr.sender.first_name} ${fr.sender.last_name}`} />
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => handleFriendRequest(fr.friendRequestId, "accept")}
            >
              Accept
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => handleFriendRequest(fr.friendRequestId, "reject")}
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

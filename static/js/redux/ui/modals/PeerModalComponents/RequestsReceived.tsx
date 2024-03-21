import React, { useState, useEffect } from "react";
import {
  List,
  ListItem,
  ListItemText,
  Button,
  Grid,
  CircularProgress,
  Avatar,
  Box,
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
        <Grid container spacing={4} justifyContent="center">
          <Grid item>
            <Avatar
              src={fr.img_url}
              alt={`${fr.sender.first_name} ${fr.sender.last_name}`}
              sx={{ width: 40, height: 40 }}
            />
          </Grid>
          <Grid item width="40%">
            <ListItemText
              primary={`${fr.sender.first_name} ${fr.sender.last_name}`}
              primaryTypographyProps={{
                fontSize: "1.4rem",
                fontWeight: "bold",
              }}
            />
            <ListItemText primary={`${fr.sender.major} ${fr.sender.class_year}`} />
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

  return (
    <List sx={{ display: "flex", justifyContent: "center" }}>{renderContent()}</List>
  );
};

export default RequestsReceived;

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
  getFriendRequestsSentEndpoint,
  getRejectFriendRequestEndpoint,
  getWithdrawFriendRequestEndpoint,
} from "../../../constants/endpoints";
import { FriendRequest } from "./Types";
import Cookie from "js-cookie";

const RequestsSent = () => {
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFriendRequestsSent = async () => {
      try {
        const response = await fetch(getFriendRequestsSentEndpoint());
        const responseJson = await response.json();
        setFriendRequests(responseJson);
      } catch (error) {
        console.error("Error fetching friend requests sent:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFriendRequestsSent();
  }, []);

  const withdrawFriendRequest = async (friendRequest: FriendRequest) => {
    await fetch(getRejectFriendRequestEndpoint(friendRequest.friendRequestId));
    setFriendRequests((currFriendRequests) =>
      currFriendRequests.filter(
        (fr) => fr.friendRequestId !== friendRequest.friendRequestId
      )
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
      return <ListItem style={{ justifyContent: "center" }}>No requests sent</ListItem>;
    }

    return friendRequests.map((fr) => (
      <ListItem key={fr.friendRequestId}>
        <Grid container spacing={2} justifyContent="center">
          <Grid item>
            <Avatar
              src={fr.img_url}
              alt={`${fr.receiver.first_name} ${fr.receiver.last_name}`}
              sx={{ width: 40, height: 40 }}
            />
          </Grid>
          <Grid item width="40%">
            <ListItemText
              primary={`${fr.receiver.first_name} ${fr.receiver.last_name}`}
              primaryTypographyProps={{
                fontSize: "1.4rem",
                fontWeight: "bold",
              }}
              sx={{ display: "flex", alignItems: "center" }}
            />
            <ListItemText
              primary={`${fr.receiver.major} ${fr.receiver.class_year}`}
              sx={{ display: "flex", alignItems: "center" }}
            />
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => withdrawFriendRequest(fr)}
            >
              Withdraw
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

export default RequestsSent;

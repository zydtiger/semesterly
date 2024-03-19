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
        <Grid container>
          <Grid item xs={7}>
            <ListItemText
              primary={`${fr.receiver.first_name} ${fr.receiver.last_name}`}
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

  return <List>{renderContent()}</List>;
};

export default RequestsSent;

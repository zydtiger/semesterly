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
  getWithdrawFriendRequestEndpoint,
} from "../../../constants/endpoints";
import { User } from "./Types";
import Cookie from "js-cookie";

const RequestsSent = () => {
  const [usersRequested, setUsersRequested] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFriendRequestsSent = async () => {
      try {
        const response = await fetch(getFriendRequestsSentEndpoint());
        const responseJson = await response.json();
        setUsersRequested(responseJson);
      } catch (error) {
        console.error("Error fetching friend requests sent:", error);
      } finally {
        setLoading(false);
      }
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

  const renderContent = () => {
    if (loading) {
      return (
        <ListItem style={{ justifyContent: "center" }}>
          <CircularProgress />
        </ListItem>
      );
    }

    if (usersRequested.length === 0) {
      return <ListItem style={{ justifyContent: "center" }}>No requests sent</ListItem>;
    }

    return usersRequested.map((user) => (
      <ListItem key={user.username}>
        <Grid container>
          <Grid item xs={7}>
            <ListItemText primary={`${user.first_name} ${user.last_name}`} />
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => withdrawFriendRequest(user.userId)}
            >
              Withdraw
            </Button>
          </Grid>
        </Grid>
      </ListItem>
    ));
  };

  return <List className="modal-content">{renderContent()}</List>;
};

export default RequestsSent;

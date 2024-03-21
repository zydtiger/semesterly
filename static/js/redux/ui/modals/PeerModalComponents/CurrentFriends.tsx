import React, { useState, useEffect } from "react";
import {
  List,
  ListItem,
  ListItemText,
  Button,
  CircularProgress,
  Grid,
  Avatar,
} from "@mui/material";
import {
  getFetchFriendsEndpointEndpoint,
  getRemoveFriendEndpoint,
} from "../../../constants/endpoints";
import { User } from "./Types";

const CurrentFriends = () => {
  const [friends, setFriends] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getFriends = async () => {
      try {
        const response = await fetch(getFetchFriendsEndpointEndpoint());
        const responseJson = await response.json();
        setFriends(responseJson);
      } catch (error) {
        console.error("Error fetching friends:", error);
      } finally {
        setLoading(false);
      }
    };
    getFriends();
  }, []);

  const removeFriend = async (userId: string) => {
    await fetch(getRemoveFriendEndpoint(userId));
    setFriends((prevFriends) =>
      prevFriends.filter((friend) => friend.userId !== userId)
    );
  };

  const renderContent = () => {
    if (loading) {
      return (
        <ListItem sx={{ justifyContent: "center" }}>
          <CircularProgress />
        </ListItem>
      );
    }

    if (friends.length === 0) {
      return <ListItem sx={{ justifyContent: "center" }}>No friends</ListItem>;
    }

    return friends.map((friend) => (
      <ListItem key={friend.userId}>
        <Grid container spacing={2} justifyContent="center">
          <Grid item>
            <Avatar
              src={friend.img_url}
              alt={`${friend.first_name} ${friend.last_name}`}
              sx={{ width: 40, height: 40 }}
            />
          </Grid>
          <Grid item width="40%">
            <ListItemText
              primary={`${friend.first_name} ${friend.last_name}`}
              primaryTypographyProps={{
                fontSize: "1.4rem",
                fontWeight: "bold",
              }}
              sx={{ display: "flex", alignItems: "center" }}
            />
            <ListItemText
              primary={`${friend.major} ${friend.class_year}`}
              sx={{ display: "flex", alignItems: "center" }}
            />
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => removeFriend(friend.userId)}
            >
              Remove Friend
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

export default CurrentFriends;

import React, { useState, useEffect } from "react";
import { List, ListItem, ListItemText, Button, Grid } from "@mui/material";

const users = [{ name: "Kiron Deb" }, { name: "Jacky Wang" }];

/**
 * This is the modal that pops up when a new news post has been published. It displays
 * the text of the news post, which is created and edited in the Django admin panel.
 */
const RequestsReceived = () => {
  const acceptFriendRequest = () => {
    console.log("accept friend request");
  };

  const ignoreFriendRequest = () => {
    console.log("remove friend request");
  };

  return (
    <List className="modal-content">
      {users.map((user, index) => (
        <ListItem
          key={user.name}
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <Grid container spacing={2}>
            <Grid item xs={2}>
              <ListItemText primary={user.name} />
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => acceptFriendRequest()}
              >
                Accept
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => ignoreFriendRequest()}
              >
                Ignore
              </Button>
            </Grid>
          </Grid>
        </ListItem>
      ))}
    </List>
  );
};

export default RequestsReceived;

import React, { useState, useEffect } from "react";
import { List, ListItem, ListItemText, Button } from "@mui/material";

const users = [{ name: "Kiron Deb" }, { name: "Jacky Wang" }];
/**
 * This is the modal that pops up when a new news post has been published. It displays
 * the text of the news post, which is created and edited in the Django admin panel.
 */
const CurrentFriends = () => {
  const removeFriend = () => {
    console.log("Remove friend functionality here");
  };

  return (
    <List className="modal-content">
      {users.map((user, index) => (
        <ListItem
          key={user.name}
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <ListItemText primary={user.name} />
          <Button variant="contained" color="secondary" onClick={() => removeFriend()}>
            Remove Friend
          </Button>
        </ListItem>
      ))}
    </List>
  );
};

export default CurrentFriends;

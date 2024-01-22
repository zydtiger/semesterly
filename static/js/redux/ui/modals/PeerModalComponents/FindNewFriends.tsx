import React, { useState, useEffect } from "react";
import { List, ListItem, ListItemText, Button, TextField, Box } from "@mui/material";

const users = [{ name: "Kiron Deb" }, { name: "Jacky Wang" }];

/**
 * This is the modal that pops up when a new news post has been published. It displays
 * the text of the news post, which is created and edited in the Django admin panel.
 */
const FindNewFriends = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sendFriendRequest = () => {
    console.log("Send friend request");
  };

  return (
    <Box className="modal-content">
      <TextField
        fullWidth
        label="Search Users"
        variant="outlined"
        value={searchTerm}
        onChange={handleSearchChange}
        margin="normal"
      />
      <List>
        {filteredUsers.map((user, index) => (
          <ListItem
            key={user.name}
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <ListItemText primary={user.name} />
            <Button
              variant="contained"
              color="secondary"
              onClick={() => sendFriendRequest()}
            >
              Send Request
            </Button>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default FindNewFriends;

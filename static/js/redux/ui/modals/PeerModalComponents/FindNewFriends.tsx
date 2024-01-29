import React, { useState, useEffect } from "react";
import {
  List,
  ListItem,
  ListItemText,
  Button,
  TextField,
  Box,
  CircularProgress,
  Typography,
} from "@mui/material";
import { getSearchFriendsEndpoint } from "../../../constants/endpoints";

interface User {
  name: string;
}

interface UsersListProps {
  users: User[];
}

const users = [{ name: "Kiron Deb" }, { name: "Jacky Wang" }];

const FindNewFriends = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredUsers([]);
      setIsSearching(false);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      // Send Axios request here
      const response = await fetch(getSearchFriendsEndpoint(searchTerm));
      const data = await response.json();
      console.log(data);

      setFilteredUsers(
        users.filter((user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
      setIsSearching(false);
    }, 500); // 500 ms delay

    setIsSearching(true);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <Box>
      <TextField
        fullWidth
        label="Search Users"
        variant="outlined"
        value={searchTerm}
        onChange={handleSearchChange}
        margin="normal"
      />
      {isSearching && searchTerm !== "" ? (
        <CircularProgress />
      ) : filteredUsers.length > 0 ? (
        <List className="modal-content">
          {filteredUsers.map((user, index) => (
            <ListItem
              key={user.name}
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <ListItemText primary={user.name} />
              <Button
                variant="contained"
                color="secondary"
                onClick={() => console.log("Send friend request functionality")}
              >
                Send Request
              </Button>
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography style={{ textAlign: "center", marginTop: "20px" }}>
          No users found
        </Typography>
      )}
    </Box>
  );
};

export default FindNewFriends;

import React, { useState, useEffect } from "react";
import { List, ListItem, ListItemText, Button, TextField, Box } from "@mui/material";

interface User {
  name: string;
}

interface UsersListProps {
  users: User[];
}

const users = [{ name: "Kiron Deb" }, { name: "Jacky Wang" }];

const UsersListWithSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredUsers([]);
      setIsSearching(false);
      return null;
    }

    const delayDebounceFn = setTimeout(() => {
      // Send Axios request here
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
        <div>Searching...</div>
      ) : (
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
                onClick={() => console.log("Remove friend functionality here")}
              >
                Remove Friend
              </Button>
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default UsersListWithSearch;

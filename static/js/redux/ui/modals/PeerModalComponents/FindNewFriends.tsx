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
import {
  getSearchFriendsEndpoint,
  getSendFriendRequestEndpoint,
  getWithdrawFriendRequestEndpoint,
} from "../../../constants/endpoints";
import Cookie from "js-cookie";

interface SearchResultUser {
  email: string;
  first_name: string;
  last_name: string;
  img_url: string;
  username: string;
  userId: string;
}

const FindNewFriends = () => {
  const [searchResults, setSearchResults] = useState<SearchResultUser[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [requestSent, setRequestSent] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    if (searchTerm === "") {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      /**
       * Example response:
       * [ { email: "kirondeb02@gmail.com", first_name: "Kiron", last_name: "Deb",
       *     img_url: "https://lh3.googleusercontent.com/a/ACg8ocJTtumXV_mOMdhpxSaKeV7R,
       *     username: "kirondeb02", userId: 1  } ]
       */

      const response = await fetch(getSearchFriendsEndpoint(searchTerm));
      const responseJson = await response.json();
      setSearchResults(responseJson);

      setIsSearching(false);
    }, 500); // 500 ms delay

    setIsSearching(true);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSendOrWithdrawRequest = async (userId: string) => {
    if (!requestSent[userId]) {
      // send request
      await fetch(getSendFriendRequestEndpoint(userId), {
        headers: {
          "X-CSRFToken": Cookie.get("csrftoken"),
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "POST",
        credentials: "include",
      });
    } else {
      // withdraw request
      await fetch(getWithdrawFriendRequestEndpoint(userId), {
        headers: {
          "X-CSRFToken": Cookie.get("csrftoken"),
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "POST",
        credentials: "include",
      });
    }
    // Simulating request sending, update the state to indicate the request is being sent
    setRequestSent((prevStatus) => ({
      ...prevStatus,
      [userId]: !prevStatus[userId],
    }));
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
      ) : searchResults.length > 0 ? (
        <List className="modal-content">
          {searchResults.map((user) => (
            <ListItem
              key={user.userId}
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <ListItemText primary={`${user.first_name} ${user.last_name}`} />
              <Button
                variant="contained"
                color={requestSent[user.userId] ? "primary" : "secondary"}
                onClick={() => handleSendOrWithdrawRequest(user.userId)}
              >
                {requestSent[user.userId] ? "Withdraw Request" : "Send Request"}
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

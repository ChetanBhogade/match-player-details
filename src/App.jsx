import { useEffect, useState } from "react";
import axios from "axios";
import CustomAppBar from "./components/CustomAppBar";
import {
  Avatar,
  Card,
  CardContent,
  CardMedia,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";
import "./App.css";
import moment from "moment";
import { SportsFootball } from "@mui/icons-material";

const sortListOfObjects = (list, property, isAscending = true) =>
  list &&
  list.sort((a, b) => {
    const one = parseFloat(a[property]);
    const two = parseFloat(b[property]);
    return isAscending ? one - two : two - one;
  });

function App() {
  const [playerDetails, setPlayerDetails] = useState([]);
  const [searchText, setSearchText] = useState("");

  const fetchPlayerDetails = () => {
    axios
      .get("https://api.npoint.io/20c1afef1661881ddc9c")
      .then((response) => {
        return response.data;
      })
      .then((playerData) => {
        console.log("player data: ", playerData);
        setPlayerDetails(playerData?.playerList);
      })
      .catch((error) => {
        console.log("got an error: ", error);
      });
  };

  const getFilteredList = (list, keywords) => {
    return list.filter((item) => {
      return (
        item?.TName?.includes(keywords) || item?.PFName?.includes(keywords)
      );
    });
  };

  const handleSearchTextChange = (event) => {
    setSearchText(event.target.value);
  };

  useEffect(() => {
    fetchPlayerDetails();
  }, []);

  return (
    <>
      <div>
        <CustomAppBar
          searchText={searchText}
          handleSearchTextChange={handleSearchTextChange}
        />
        <Typography variant="h3" sx={{ ml: 2 }} gutterBottom>
          Players List
        </Typography>

        <Divider />
        <div className="container">
          <Grid rowSpacing={4} container spacing={2}>
            {sortListOfObjects(
              getFilteredList(playerDetails, searchText),
              "Value",
              false
            )?.map((player) => {
              return (
                <Grid key={player?.Id} item md={3}>
                  <Card sx={{ maxWidth: 345 }}>
                    <CardMedia
                      sx={{ height: 140 }}
                      image={`/player-images/${player?.Id}.jpg`}
                      title="green iguana"
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
                        {player?.PFName}
                      </Typography>
                      <Typography
                        gutterBottom
                        variant="subtitle1"
                        component="div"
                      >
                        {player?.SkillDesc}
                      </Typography>
                      <Typography
                        gutterBottom
                        variant="subtitle2"
                        component="div"
                      >
                        Player Value: ${player?.Value}
                      </Typography>
                      <Typography variant="subtitle1" color="text.primary">
                        Upcoming Matches
                      </Typography>
                      <Divider />
                      <List>
                        {player?.UpComingMatchesList?.map((match) => {
                          const userTimezone = new Date().getTimezoneOffset();
                          return (
                            match?.CCode &&
                            match?.VsCCode && (
                              <ListItem key={match?.VsTID}>
                                <ListItemAvatar>
                                  <Avatar>
                                    <SportsFootball />
                                  </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                  primary={`${match?.CCode} Vs. ${match?.VsCCode}`}
                                  secondary={moment(match?.MDate)
                                    .utcOffset(userTimezone)
                                    .format("DD-MM-YYYY h:mm:ss a")}
                                />
                              </ListItem>
                            )
                          );
                        })}
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </div>
      </div>
    </>
  );
}

export default App;

import CloseIcon from "@mui/icons-material/Close";
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Chip,
  Divider,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  TextField,
} from "@mui/material";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getChapterData,
  getChapterRegionData,
  getEventsData,
  getRegions,
} from "../../backend/FirestoreCalls";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import SignOutButton from "../../components/SignOutButton/SignOutButton";
import styles from "./Dashboard.module.css";
import DateSelection from "./DateSelection/DateSelection";

const Dashboard = () => {
  const [chapterData, setChapterData] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [openDateSelection, setOpenDateSelection] = useState(false);
  const [startDate, setStartDate] = useState(new Date("1970-01-01"));
  const [endDate, setEndDate] = useState(new Date());
  const [regions, setRegions] = useState([]);
  const [selectedRegions, setSelectedRegions] = useState([]);
  const [allChapters, setAllChapters] = useState([]);
  const [filteredChapters, setFilteredChapters] = useState([]);
  const [selectedChapters, setSelectedChapters] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [info, setInfo] = useState({
    events: 0,
    participants: 0,
    contactHours: 0,
    volunteers: 0,
    volunteerHours: 0,
    attendees: 0,
  });
  const navigate = useNavigate();

  //Fetches all member data within chapter
  useEffect(() => {
    getChapterData()
      .then((chapter) => {
        setChapterData(chapter);
        getEventsData()
          .then((events) => {
            const eventList = events.map((e) => {
              return e.event;
            });
            setEvents(eventList);
          })
          .catch((error) => {
            setError(true);
          })
          .finally(() => {
            setLoading(false);
          });
      })
      .catch((error) => {
        setError(true);
      });
  }, []);

  useEffect(() => {
    getRegions()
      .then((region) => {
        setRegions(region);
      })
      .catch((error) => {
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    getChapterRegionData()
      .then((chapters) => {
        setAllChapters(chapters);
        setFilteredChapters(chapters);
      })
      .catch((error) => {
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const selectedChapterNames = selectedChapters.map(
      (chapter) => chapter.label
    );
    const filteredEventsByChapter = events.filter((event) =>
      selectedChapterNames.includes(event.chapter)
    );

    const dateFilteredEvents = filteredEventsByChapter.filter(
      (event) =>
        event.startDate >= startDate.toISOString().split("T")[0] &&
        event.endDate <= endDate.toISOString().split("T")[0]
    );
    const eventsInfo = dateFilteredEvents.reduce(
      (acc, event) => {
        acc.events += 1;
        acc.participants += parseInt(event?.participantsServed || 0);
        acc.contactHours += parseInt(event?.contactHours || 0);
        acc.volunteers += parseInt(event?.volunteers || 0);
        acc.volunteerHours += parseInt(event?.volunteerHours || 0);
        acc.attendees += parseInt(event?.attendees || 0);

        return acc;
      },
      {
        events: 0,
        participants: 0,
        contactHours: 0,
        volunteers: 0,
        volunteerHours: 0,
        attendees: 0,
      }
    );
    setInfo(eventsInfo);
  }, [selectedChapters, startDate, endDate]);
  const options = Object.entries(filteredChapters).flatMap(([group, items]) =>
    items.map((label) => ({ group, label }))
  );

  const handleSelectAll = () => {
    setSelectAll((prev) => {
      if (!prev) setSelectedChapters([...options]);
      else setSelectedChapters([]);
      return !prev;
    });
  };

  return (
    <div>
      <div className={styles.header}>
        <h1>Chapter Details</h1>
        <SignOutButton />
      </div>
      <NavigationBar />
      <div className={styles.gridContainer}>
        {loading ? (
          "Loading Data"
        ) : error ? (
          "Error fetching data"
        ) : (
          <div className={styles.innerGrid}>
            <div className={styles.mainPanel}>
              <div className={styles.dateSelection}>
                <div className={styles.dateRange}>
                  {dayjs(startDate).format("MM/DD/YYYY")} -{" "}
                  {dayjs(endDate).format("MM/DD/YYYY")}
                </div>
                <Button
                  variant="outlined"
                  className={styles.dateButton}
                  onClick={() => setOpenDateSelection(true)}
                >
                  Select Date Range
                </Button>
              </div>

              <div className={styles.displayInfo}>
                <div>NUMBER OF EVENTS</div>
                <div>{info.events}</div>
                <div>ATTENDEES</div>
                <div>{info.attendees}</div>
                <div>PARTICIPANTS SERVED</div>
                <div>{info.participants}</div>
                <div>CONTACT HOURS</div>
                <div>{info.contactHours}</div>
                <div>VOLUNTEERS</div>
                <div>{info.volunteers}</div>
                <div>VOLUNTEER HOURS</div>
                <div>{info.volunteerHours}</div>
              </div>
              <div className={styles.selectionContainer}>
                <div className={styles.selectionHeader}>
                  <h2>Chapters</h2>
                  <FormControl
                    sx={{
                      width: "50%",
                      fontFamily: "'Source Serif 4', serif",
                    }}
                  >
                    <InputLabel
                      size="small"
                      htmlFor="region-label"
                      sx={{
                        fontFamily: "'Source Serif 4', serif",
                      }}
                    >
                      Filter Region
                    </InputLabel>
                    <Select
                      inputProps={{
                        id: "region-label",
                      }}
                      label="Filter Region"
                      value={selectedRegions}
                      multiple
                      size="small"
                      onChange={(event) => {
                        setSelectedRegions(event.target.value);
                        if (event.target.value.length === 0) {
                          setFilteredChapters(allChapters);
                        } else {
                          const filteredRegions = Object.keys(allChapters)
                            .filter((key) => event.target.value.includes(key))
                            .reduce((acc, key) => {
                              acc[key] = allChapters[key];
                              return acc;
                            }, {});
                          setFilteredChapters(filteredRegions);
                        }
                      }}
                      renderValue={(selected) => (
                        <Box
                          sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 0.5,
                            height: "35px",
                            maxHeight: "50px",
                            overflow: "auto",
                          }}
                        >
                          {selected.map((value) => (
                            <Chip key={value} label={value} />
                          ))}
                        </Box>
                      )}
                      sx={{
                        "& .MuiSelect-select": {
                          paddingRight: 4,
                          paddingLeft: 2,
                          paddingTop: 1,
                          paddingBottom: 1,
                          textAlign: "center",
                        },
                      }}
                      className={styles.select}
                    >
                      {regions.map((region) => (
                        <MenuItem key={region} value={region}>
                          {region}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
                <Autocomplete
                  multiple
                  disableClearable
                  filterSelectedOptions
                  isOptionEqualToValue={(option, value) =>
                    option.label === value.label
                  }
                  options={options}
                  groupBy={(option) => option.group}
                  getOptionLabel={(option) => option.label}
                  value={selectedChapters}
                  onChange={(event, newValue, reason) => {
                    if (
                      reason === "selectOption" &&
                      newValue.length === options.length
                    )
                      setSelectAll(true);
                    setSelectedChapters(newValue);
                  }}
                  renderTags={() => null}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Search Chapters"
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  )}
                  PaperComponent={(paperProps) => {
                    const { children, ...restPaperProps } = paperProps;
                    return (
                      <Paper {...restPaperProps}>
                        <Box
                          onMouseDown={(e) => e.preventDefault()} // prevent blur
                          pl={1.5}
                          py={0.5}
                        >
                          <FormControlLabel
                            onClick={(e) => {
                              e.preventDefault(); // prevent blur
                              handleSelectAll();
                            }}
                            label="Select all"
                            control={
                              <Checkbox
                                id="select-all-checkbox"
                                checked={selectAll}
                              />
                            }
                          />
                        </Box>
                        <Divider />
                        {children}
                      </Paper>
                    );
                  }}
                />

                <div className={styles.selectionHeader}>
                  <h3>Selected Chapters</h3>
                  <Button
                    variant="outlined"
                    className={styles.clearButton}
                    onClick={() => {
                      setSelectedChapters([]);
                      setSelectAll(false);
                    }}
                  >
                    Clear All
                  </Button>
                </div>
                <Box
                  mt={2}
                  style={{
                    height: "200px",
                    overflow: "auto",
                    marginTop: "0",
                  }}
                >
                  <List
                    sx={{
                      paddingTop: "0",
                    }}
                  >
                    {selectedChapters.map((chapter) => (
                      <ListItem key={chapter.label}>
                        <ListItemText primary={chapter.label} />
                        <ListItemSecondaryAction>
                          <IconButton
                            edge="end"
                            aria-label="delete"
                            onClick={() => {
                              const updatedChapters = selectedChapters.filter(
                                (item) => item.label !== chapter.label
                              );
                              setSelectedChapters(updatedChapters);
                              setSelectAll(false);
                            }}
                          >
                            <CloseIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                </Box>
              </div>
            </div>
          </div>
        )}
      </div>
      <DateSelection
        open={openDateSelection}
        handleClose={() => {
          setOpenDateSelection(!openDateSelection);
        }}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
      />
    </div>
  );
};

export default Dashboard;

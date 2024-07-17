import { useEffect, useState } from "react";
import Axios from "../../../Config/axios";
import man from "../../../../src/assets/Gender/man.png";
import woman from "../../../../src/assets/Gender/woman.png";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField,
  Typography,
  Grid,
  Avatar,
  Container,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { toast } from "react-toastify";

const initialvalue = {
  firstName: "",
  lastName: "",
  age: "",
  Gender: "",
  address: "",
  email: "",
  phone: "",
  designation: "",
  role: { name: "" },
  createdAtIST: "",
};

const Profile = () => {
  const [user, setUser] = useState(initialvalue);
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [originalUser, setOriginalUser] = useState(initialvalue);

  useEffect(() => {
    Axios.get("admin/get-user")
      .then((response) => {
        const userData = response.data?.user || initialvalue;
        setUser(userData);
        setOriginalUser(userData);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const handleEdit = () => setIsEditing(true);

  const handleSave = () => {
    Axios.put("admin/update-user", user)
      .then((response) => {
        // setUser(response.data.user);
        // setOriginalUser(response.data.user);
        setIsEditing(false);
        toast.success("Profile Updated");
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to update profile");
      });
  };

  const handleCancel = () => {
    setUser(originalUser);
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  return (
    <>
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Box
        >
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Account Information
          </Typography>
          <Grid container spacing={2} justifyContent="center">
            <Grid item xs={12} md={4}>
              <Box
                sx={{
                  p: 2,
                  textAlign: "center",
                  borderColor: "lightgrey",
                  borderStyle: "solid",
                  borderWidth: "1px",
                  borderRadius: "5px",
                }}
              >
                <Avatar
                  alt="User Icon"
                  src={user.Gender.toLowerCase() === "male" ? man : woman}
                  sx={{ width: 100, height: 100, mx: "auto" }}
                />
                <Typography variant="h6" component="h2" sx={{ mt: 2 }}>
                  {user.firstName}
                </Typography>
                <Button
                  variant="text"
                  color="primary"
                  startIcon={
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height={20}
                      viewBox="0 0 24 24"
                      width={20}
                      fill="#387ADF"
                    >
                      <path d="M0 0h24v24H0V0z" fill="none" />
                      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                    </svg>
                  }
                  onClick={handleEdit}
                >
                  Edit Profile
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={toggleModal}
                  sx={{ my: 2 }}
                >
                  Forgot Password?
                </Button>
              </Box>
            </Grid>

            <Grid item xs={12} md={8}>
              <Box
                sx={{
                  p: 2,
                  borderColor: "lightgrey",
                  borderStyle: "solid",
                  borderWidth: "1px",
                  borderRadius: "5px",
                }}
              >
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Full Name:
                      </TableCell>
                      <TableCell>
                        {isEditing ? (
                          <Box>
                            <TextField
                              name="firstName"
                              label="First Name"
                              value={user.firstName}
                              onChange={handleChange}
                              variant="outlined"
                              size="small"
                              fullWidth
                              margin="dense"
                              sx={{ mb: 1 }}
                            />
                            <TextField
                              name="lastName"
                              label="Last Name"
                              value={user.lastName}
                              onChange={handleChange}
                              variant="outlined"
                              size="small"
                              fullWidth
                              margin="dense"
                            />
                          </Box>
                        ) : (
                          `${user.firstName} ${user.lastName}`
                        )}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Designation:
                      </TableCell>
                      <TableCell>
                        {isEditing ? (
                          <TextField
                            name="designation"
                            label="Designation"
                            value={user.designation}
                            onChange={handleChange}
                            variant="outlined"
                            size="small"
                            fullWidth
                            margin="dense"
                            sx={{ mb: 1 }}
                          />
                        ) : (
                          user.designation
                        )}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ fontWeight: "bold" }}>Phone:</TableCell>
                      <TableCell>
                        {isEditing ? (
                          <TextField
                            name="phone"
                            label="Phone"
                            value={user.phone}
                            onChange={handleChange}
                            variant="outlined"
                            size="small"
                            fullWidth
                            margin="dense"
                          />
                        ) : (
                          user.phone
                        )}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ fontWeight: "bold" }}>Role:</TableCell>
                      <TableCell>
                        {isEditing ? (
                          <TextField
                            name="role.name"
                            label="Role"
                            value={user.role?.name}
                            variant="outlined"
                            size="small"
                            fullWidth
                            margin="dense"
                            disabled
                          />
                        ) : (
                          user.role?.name
                        )}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ fontWeight: "bold" }}>Email:</TableCell>
                      <TableCell>
                        {isEditing ? (
                          <TextField
                            name="email"
                            label="Email"
                            value={user.email}
                            onChange={handleChange}
                            variant="outlined"
                            size="small"
                            fullWidth
                            margin="dense"
                          />
                        ) : (
                          user.email
                        )}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ fontWeight: "bold" }}>Gender:</TableCell>
                      <TableCell>
                        {isEditing ? (
                          <FormControl
                            fullWidth
                            variant="outlined"
                            size="small"
                            margin="dense"
                          >
                            <InputLabel>Gender</InputLabel>
                            <Select
                              name="Gender"
                              value={user.Gender}
                              onChange={handleChange}
                              label="Gender"
                            >
                              <MenuItem value="Male">Male</MenuItem>
                              <MenuItem value="Female">Female</MenuItem>
                            </Select>
                          </FormControl>
                        ) : (
                          user.Gender
                        )}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ fontWeight: "bold" }}>Age:</TableCell>
                      <TableCell>
                        {isEditing ? (
                          <TextField
                            name="age"
                            label="Age"
                            value={user.age}
                            onChange={handleChange}
                            variant="outlined"
                            size="small"
                            fullWidth
                            margin="dense"
                          />
                        ) : (
                          user.age
                        )}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Address:
                      </TableCell>
                      <TableCell>
                        {isEditing ? (
                          <TextField
                            name="address"
                            label="Address"
                            value={user.address}
                            onChange={handleChange}
                            variant="outlined"
                            size="small"
                            fullWidth
                            margin="dense"
                          />
                        ) : (
                          user.address
                        )}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        Created At:
                      </TableCell>
                      <TableCell>{user.createdAtIST}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
                {isEditing && (
                  <Grid
                    container
                    spacing={2}
                    justifyContent="flex-end"
                    sx={{ mt: 2 }}
                  >
                    <Grid item>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSave}
                      >
                        Save
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={handleCancel}
                      >
                        Cancel
                      </Button>
                    </Grid>
                  </Grid>
                )}
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>

      <Dialog open={isModalOpen} onClose={toggleModal}>
        <DialogTitle>Forgot Password ?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            If you need assistance or have forgotten your password, please reach
            out to our administration team. They are available to provide you
            with the necessary support and guidance to resolve any issues you
            might be facing. For further details, contact the administration
            team at [abcdefg@xyz.com].
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={toggleModal} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Profile;

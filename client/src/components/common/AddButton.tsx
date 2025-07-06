import React from "react";
import { Grid, Button } from "@mui/material";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import { useSelector, useDispatch } from "react-redux";

import { openModal } from "../../reducers/modal";

interface AddButtonProps {
  show: boolean;
  setShow: (show: boolean) => void;
}

const AddButton: React.FC<AddButtonProps> = ({ show, setShow }) => {
  const dispatch = useDispatch();
  const { collapsed } = useSelector((state: any) => state.sidebar);

  return (
    <div>
      <Grid
        className="d-flex justify-content-end bg-white"
        style={{
          height: 60,
          padding: "11px 20px",
        }}>
        {/* <SearchBar setSearch={setSearch} /> */}
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => {
            setShow(!show);
            dispatch(openModal({ modalType: "create" }));
          }}>
          <PersonAddAlt1Icon />
        </Button>
      </Grid>
    </div>
  );
};

export default AddButton; 
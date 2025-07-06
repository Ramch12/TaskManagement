import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

interface LoaderProps {
  height?: number | string;
  top?: number | string;
}

const Loader: React.FC<LoaderProps> = ({ height, top }) => {
  return (
    <Box
      sx={{
        display: "flex",
        height: height ? height : "calc(100vh - 75px)",
        marginTop: top ? top : "0px",
      }}
      className="customLoader">
      <CircularProgress />
    </Box>
  );
};

export default Loader;
import { Button, ButtonProps, styled } from "@mui/material";

const PillButton = styled(Button)<ButtonProps>(props => {
  return ({
    color: props.color || "white",
    backgroundColor: "#00000",
    '&:hover': {
      backgroundColor: "#333333",
    },
    border: "1px solid #808080",
    borderRadius: "30px",
    height: "36px",
    marginRight: "10px",
  });
});

export default PillButton;
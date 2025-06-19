import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

export const FOOTER_HEIGHT = 60;

type FooterProps = {
  height?: number;
};

const Footer: React.FC<FooterProps> = ({ height = FOOTER_HEIGHT }) => {
  return (
    <AppBar position="fixed" sx={{ top: "auto", bottom: 0, display: "flex", justifyContent: "center", height: height }}>
      <Toolbar sx={{ justifyContent: "center" }}>
        <Typography variant="body2" component="div" sx={{ justifyContent: "center" }}>
          閲覧日時: {new Date().toLocaleString()}
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Footer;

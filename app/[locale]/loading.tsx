import { LinearProgress } from "@mui/material";

const Loading = () => {
  // return <LinearProgress />;
  return (
    <div className="loading-overlay">
      <LinearProgress />
    </div>
  );
};

export default Loading;

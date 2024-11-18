import { PuffLoader } from "react-spinners";

const Loader = ({ color = "#1dd8a0", size = 60, fullScreen = false }) => {
  return (
    <div
      className={`flex items-center justify-center ${
        fullScreen ? "h-screen" : "h-full"
      }`}
    >
      <PuffLoader color={color} size={size} />
    </div>
  );
};

export default Loader;

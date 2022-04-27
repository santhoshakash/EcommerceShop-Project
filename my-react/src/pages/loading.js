import { RotatingLines } from "react-loader-spinner";
export const Loading = () => {
  const style = {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  };
  return (
    <div style={style}>
      <RotatingLines strokeColor={"#216eee"} />
    </div>
  );
};

import ReactDOM from "react-dom";

export const ProtalTest: React.FC = () => {
  const c = ReactDOM.createPortal(
    <div
      style={{
        height: 50,
        width: 50,
        backgroundColor: "blue",
        position: "fixed",
        top: 200,
        left: 210,
      }}
      onMouseEnter={e => {
        console.log("c", e);
      }}
    ></div>,
    document.body
  );

  const b = ReactDOM.createPortal(
    <div
      style={{
        height: 100,
        width: 100,
        backgroundColor: "green",
        position: "fixed",
        top: 200,
        left: 100,
      }}
      onMouseEnter={e => {
        console.log("b", e);
      }}
    >
      {c}
    </div>,
    document.body
  );
  return (
    <div>
      <div
        style={{ height: 150, width: 150, backgroundColor: "red" }}
        onMouseEnter={e => {
          console.log("a", e);
        }}
      ></div>
      {b}
    </div>
  );
};

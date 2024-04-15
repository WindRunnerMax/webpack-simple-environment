export const MouseEnterTest: React.FC = () => {
  return (
    <div>
      <div
        style={{ height: 150, width: 150, backgroundColor: "red" }}
        onMouseEnter={e => {
          console.log("a enter", e);
        }}
        onMouseLeave={e => {
          console.log("a leave", e);
        }}
      >
        <div
          style={{ height: 100, width: 100, backgroundColor: "green" }}
          onMouseEnter={e => {
            console.log("b enter", e);
          }}
          onMouseLeave={e => {
            console.log("b leave", e);
          }}
        >
          <div
            style={{ height: 50, width: 50, backgroundColor: "blue" }}
            onMouseEnter={e => {
              console.log("c enter", e);
            }}
            onMouseLeave={e => {
              console.log("c leave", e);
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

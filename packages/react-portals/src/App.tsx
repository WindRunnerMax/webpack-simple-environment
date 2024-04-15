import { MouseEnterTest } from "./components/mouse-enter-test";
import { ProtalTest } from "./components/protal-test";
import { TriggerSimple } from "./components/trigger-simple";

function App() {
  return (
    <div>
      <MouseEnterTest />
      <div style={{ width: "100%", height: 20 }}></div>
      <ProtalTest />
      <div style={{ width: "100%", height: 20 }}></div>
      <TriggerSimple
        duration={200}
        popup={() => (
          <div style={{ height: 100, width: 100, backgroundColor: "green" }}>
            <TriggerSimple
              popup={() => <div style={{ height: 50, width: 50, backgroundColor: "blue" }}></div>}
              duration={200}
            >
              <div style={{ paddingTop: 20 }}>Hover</div>
            </TriggerSimple>
          </div>
        )}
      >
        <div style={{ height: 150, width: 150, backgroundColor: "red" }}></div>
      </TriggerSimple>
    </div>
  );
}

export default App;

import { CounterNormal } from "./counter-normal";
import { CounterNative } from "./counter-native";
import { CounterCallback } from "./counter-callback";
import "./styles.css";

interface Props {}

const App: React.FC<Props> = (props) => {
  return (
    <div>
      <div>Hooks事件绑定</div>
      <CounterNormal />
      <div>原生事件绑定</div>
      <CounterNative />
      <div>useCallback</div>
      <CounterCallback />
    </div>
  );
};

export default App;

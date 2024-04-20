import "./styles.css";

import { CounterCallback } from "./counter-callback";
import { CounterNative } from "./counter-native";
import { CounterNormal } from "./counter-normal";

interface Props {}

const App: React.FC<Props> = () => {
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

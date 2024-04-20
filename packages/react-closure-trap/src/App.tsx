import { BindEventCount } from "./bind-event";
import { MultiCount } from "./multi-count";
import { RefCount } from "./use-ref";

const App: React.FC = () => {
  return (
    <div>
      <MultiCount />
      <hr />
      <BindEventCount />
      <hr />
      <RefCount />
      <hr />
    </div>
  );
};

export default App;

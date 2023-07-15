import { FC } from "react";
import { Empty } from "@arco-design/web-react";
import style from "./index.module.scss";
import { cs } from "laser-utils";

export const App: FC = () => {
  return (
    <div className={cs(style.container)}>
      <Empty></Empty>
    </div>
  );
};

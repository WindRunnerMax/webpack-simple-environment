import { FC } from "react";
import { Empty } from "@arco-design/web-react";
import style from "./index.module.scss";

export const App: FC = () => {
  return (
    <div className={style.container}>
      <Empty></Empty>
    </div>
  );
};

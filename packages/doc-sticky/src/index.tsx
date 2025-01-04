import type { FC } from "react";
import { Fragment } from "react";
import ReactDOM from "react-dom";

import { Anchor } from "./components/anchor";
import { Paragraph } from "./components/paragraph";
import { Table } from "./components/table";
import styles from "./styles/index.m.scss";

const App: FC = () => {
  return (
    <Fragment>
      <div className={styles.container}>
        <div className={styles.doc} data-doc>
          <Paragraph />
          <Paragraph />
          <Paragraph />
          <Paragraph />
          <Paragraph />
          <Table />
          <Paragraph />
          <Paragraph />
          <Paragraph />
        </div>
        <div className={styles.anchor}>
          <Anchor />
        </div>
      </div>
      <footer className={styles.footer}>footer</footer>
    </Fragment>
  );
};

if (history.scrollRestoration) {
  history.scrollRestoration = "manual";
}

ReactDOM.render(<App />, document.getElementById("root"));

import { Button } from "@arco-design/web-react";
import { useEffect, useRef } from "react";
import React from "react";
import ReactDOM from "react-dom";
import type { Options } from "sucrase";
import { transform as transformCode } from "sucrase";

const defaultTransformOptions: Options = { transforms: ["jsx"], production: true };

const App: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const code = `
        <Button type='primary' onClick={() => alert(111)}>Primary</Button>
    `;

    // transform: babel @swc/wasm-web sucrase
    const { code: compiledCode } = transformCode(`return (${code});`, defaultTransformOptions);
    console.log(compiledCode);
    if (ref.current) {
      const el = ref.current;
      const sandbox: Record<string, unknown> = {
        React,
        Button,
      };
      // sandbox: window proxy iframe
      // xss: js-xss
      const withCode = `with(sandbox) { ${compiledCode} }`;
      console.log(withCode);
      // no-with: ...keys ...values
      const Components = new Function("sandbox", withCode)(sandbox);
      // SSR: ReactDOMServer.renderToStaticMarkup + ReactDOM.hydrate
      ReactDOM.render(Components, el);
    }
  }, []);

  return (
    <>
      <div ref={ref}></div>
    </>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));

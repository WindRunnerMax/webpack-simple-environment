declare module "copy-webpack-plugin";

declare module "*.module.scss" {
  const classes: { [key: string]: string };
  export default classes;
}

declare module "*.m.scss" {
  const classes: { [key: string]: string };
  export default classes;
}

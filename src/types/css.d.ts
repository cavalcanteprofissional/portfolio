declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

declare module '*?raw' {
  const content: string;
  export default content;
}

declare module '*.json?raw' {
  const content: string;
  export default content;
}
export const CodeElement = (props) => {
  return (
    <p {...props.attributes}>
      <code>{props.children}</code>
    </p>
  );
};

export const Leaf = (props) => {
  const styles = {
    fontWeight: props.leaf.bold ? "bold" : "normal",
    fontStyle: props.leaf.italic ? "italic" : "normal",
    textDecorationLine: (() => {
      let style = "";
      if (props.leaf.underline) {
        style += "underline ";
      }
      if (props.leaf.strikethrough) {
        style += "line-through ";
      }
      return style;
    })(),
    textAlign: props.leaf.align ? props.leaf.align : "left",
  };

  return (
    <span {...props.attributes} style={styles}>
      {props.children}
    </span>
  );
};

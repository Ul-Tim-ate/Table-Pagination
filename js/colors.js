const colorWordToHexCode = (wordColor) => {
  switch (wordColor) {
    case "blue":
      return "#0000FF";
    case "green":
      return "#008000";
    case "red":
      return "#FF0000";
    case "brown":
      return "#A52A2A";
    default:
      return wordColor;
  }
};

export default colorWordToHexCode;

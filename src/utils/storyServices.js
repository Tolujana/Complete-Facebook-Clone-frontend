let currentElement;

const removeButton = (ref) => {
  if (ref == undefined) {
    return "";
  } else if (ref.current.scrollLeft < 10) {
    return "removeLeftbutton";
  } else if (currentElement.scrollLeft == 220) {
    return "removeRightbutton";
  }
};

module.exports = { currentElement, removeButton };

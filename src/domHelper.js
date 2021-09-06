export default class DomHelper {
  static createElement(selector, classNames) {
    const element = document.createElement(selector);

    // If classNames was passed in at all
    if (classNames !== undefined) {
      // if it's an array of names, add them all
      if (Array.isArray(classNames)) {
        for (let i = 0; i < classNames.length; i++) {
          element.classList.add(classNames[i]);
        }
      }
      // otherwise it's just a string of one name
      else {
        element.classList.add(classNames);
      }
    }
    return element;
  }
}

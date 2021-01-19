export default function create(el, classNames, child, parent, ...dataAttr) {
  const element = document.createElement(el);
  if (classNames) element.classList.add(...classNames.split(' '));

  if (child && Array.isArray(child)) {
    child.forEach((childElement) => childElement && element.appendChild(childElement));
  } else if (child && typeof child === 'object') element.appendChild(child);
  else if (child && typeof child === 'string') element.innerHTML = child;
  if (parent) parent.appendChild(element);
  if (dataAttr.length) {
    dataAttr.forEach(([attrName, attrValue]) => {
      if (attrValue === '') element.setAttribute(attrName, '');
      if (attrName.match(/style|draggable|src|muted/)) element.setAttribute(attrName, attrValue);
      else element.dataset[attrName] = attrValue;
    });
  }
  return element;
}

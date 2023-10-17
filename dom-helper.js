/**
 * Attach the provided event handler to all nodes in the given NodeList.
 * @param {NodeList} list NodeList of nodes to add event handler to
 * @param {string} event Event
 * @param {Function} func Event handler
 */
function addEventListenerList(list, event, func) {
    for (let node of list) {
        node.addEventListener(event, func);
    }
};
function removeEventListenerList(list, event, func) {
    for (let node of list) {
        node.removeEventListener(event, func);
    }
}

### Dropdown Menu (Basic)

```css
.dropdown-menu .dropdown-container,
.dropdown-menu .dropdown-items {
    display: flex;
    flex-direction: column;
}
.dropdown-menu .dropdown-parent,
.dropdown-menu .dropdown-child {
    --btn-width: 200px;
    width: var(--btn-width);
}
.dropdown-menu .dropdown-items-container {
    visibility: hidden;
    position: absolute;
}
.dropdown-menu .dropdown-items-container.visible {
    visibility: visible;
    position: static;
}
```

```html
<nav class="dropdown-menu">
    <ul class="dropdown-container">
        <li>
            <button class="dropdown-parent" data-dropdown-target="my-items">Dropdown</button>
        </li>
        <li class="dropdown-items-container" id="my-items">
            <ul class="dropdown-items">
                <li><button class="dropdown-child">Item 1</button></li>
                <li><button class="dropdown-child">Item 2</button></li>
                <li><button class="dropdown-child">Item 3</button></li>
            </ul>
        </li>
    </ul>
</nav>
<nav class="dropdown-menu">
    <ul class="dropdown-container">
        <li>
            <button class="dropdown-parent" data-dropdown-target="my-items2">Dropdown</button>
        </li>
        <li class="dropdown-items-container" id="my-items2">
            <ul class="dropdown-items">
                <li><button class="dropdown-child">Item 1</button></li>
                <li><button class="dropdown-child">Item 2</button></li>
                <li><button class="dropdown-child">Item 3</button></li>
            </ul>
        </li>
    </ul>
</nav>
```

```js
(() => {
    function expandDropdown(dropdownParent) {
        const targetId = dropdownParent.dataset.dropdownTarget;
        const target = document.getElementById(targetId);
        target.classList.toggle('visible');
    }

    const dropdownParents = document.querySelectorAll('.dropdown-parent');
    domHelper.addEventListenerList(dropdownParents, 'click', (e) => {
        const dropdownParent = e.target;
        expandDropdown(dropdownParent);
    });
})();
```

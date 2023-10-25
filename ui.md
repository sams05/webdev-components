### Boilerplate

Apply `boilerplate.css` and `dom-helper.js`

```js
import * as domHelper from `dom-helper.js`;
```

### Dropdown Menu

Adapted from https://www.youtube.com/watch?v=S-VeYcOCFZw

Using `@starting-style` to transition on display:
- https://developer.chrome.com/en/blog/new-in-chrome-117/#exit-entry-animations
- https://drafts.csswg.org/css-transitions-2/#defining-before-change-style
- https://chromestatus.com/feature/4515377717968896
- https://www.youtube.com/watch?v=y8CYSwHXVNE&t=636s

For browsers that don't support `@starting-style`, change to only using opacity to hide and transition the menu.
1. Move the rules inside @starting-style to .dropdown-menu
2. Remove all styling related to display
    - `&.active{display: block;}`
    - `.dropdown-menu{display: none; transition: display 0.5s;}`

```css
nav {
    display: flex;
}
.dropdown {
    position: relative;
    opacity: 0.8;
    &:has(.dropdown-menu.active) {
        opacity: 1;
    }
    .dropdown-menu {
        position: absolute;
        left: 0;
        /* +.25rem for some additional spacing below the button */
        top: calc(100% + 0.25rem);
        padding: 0.75rem;
        border-radius: 0.25rem;
        background-color: white;
        box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.1);

        display: none;
        transition: opacity 0.5s ease-in-out, transform 0.5s ease-in-out, display 0.5s;

        &.active {
            @starting-style {
                opacity: 0;
                transform: translateY(-10px);
                /* 
                translateY(-10px) momentarily blocks the button, so use pointer-events: none
                so that the button remains clickable.
                */
                pointer-events: none;
            }
            display: block;
            opacity: 1;
            transform: translateY(0);
            pointer-events: auto;
        }
    }
}
```

```html
<nav>
    <div class="dropdown js-dropdown">
        <button class="js-dropdown-btn" data-dropdown-menu-target="my-menu">Information</button>
        <div id="my-menu" class="dropdown-menu js-dropdown-menu">
            <!-- Dropdown content -->
            Content
        </div>
    </div>
    <div class="dropdown js-dropdown">
        <button class="js-dropdown-btn" data-dropdown-menu-target="my-menu2">Information</button>
        <div id="my-menu2" class="dropdown-menu js-dropdown-menu">
            <!-- Dropdown content -->
            Content
        </div>
    </div>
</nav>
```

```js
document.addEventListener('click', (e) => {
    const isDropdownBtn = e.target.matches('.js-dropdown-btn');
    if (!isDropdownBtn && e.target.closest('.js-dropdown') !== null) {
        // Do nothing if already in dropdown
        return;
    }
    let currentDropdownMenu;
    if (isDropdownBtn) {
        currentDropdownMenu = document.getElementById(e.target.dataset.dropdownMenuTarget);
        // Hide or show dropdown
        currentDropdownMenu.classList.toggle('active');
    }
    // Close all other dropdown menus
    document.querySelectorAll('.js-dropdown-menu.active').forEach((dropdownMenu) => {
        if (dropdownMenu === currentDropdownMenu) {
            return;
        }
        dropdownMenu.classList.remove('active');
    });
});
```

### Image Slider

Adapted from https://www.youtube.com/watch?v=9HcxHDS2w1s

```css
.carousel {
    width: 60vw;
    height: 30vw;
    border: 2px solid black;
    position: relative;
}
.carousel-slide {
    position: absolute;
    inset: 0;
    opacity: 0;
    transition: 200ms opacity ease-in-out;
    /* Newly inactive slide will not transition until the newly active slide transitioned */
    transition-delay: 200ms;
    > img {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center;
    }
    &.active {
        /* Setting opacity to show the active slide */
        opacity: 1;
        z-index: 1;
        /* Newly active slide will immediately transition */
        transition-delay: 0ms;
    }
}
/* ||| Buttons */
.carousel-btn {
    position: absolute;
    /* Set top and transform to vertically center the buttons */
    top: 50%;
    &.prev {
        left: 1rem;
    }
    &.next {
        right: 1rem;
    }
    transform: translateY(-50%);
    z-index: 2;

    border: none;
    border-radius: 0.25rem;
    padding: 0 0.5rem;
    background: none;
    cursor: pointer;
    font-family: inherit;
    font-size: 4rem;
    color: rgba(255, 255, 255, 0.5);
    background-color: rgba(0, 0, 0, 0.1);
    &:is(:hover, :focus) {
        color: white;
        background-color: rgba(0, 0, 0, 0.2);
    }
    &:focus-visible {
        outline: 1px solid black;
    }
}
```

```html
<div class="carousel">
    <button type="button" class="carousel-btn prev" data-carousel-btn="prev">&lArr;</button>
    <button type="button" class="carousel-btn next" data-carousel-btn="next">&rArr;</button>
    <ul class="carousel-slides">
        <li class="carousel-slide active">
            <img src="https://picsum.photos/800/400?random=1" alt="" />
        </li>
        <li class="carousel-slide">
            <img src="https://picsum.photos/800/400?random=2" alt="" />
        </li>
        <li class="carousel-slide">
            <img src="https://picsum.photos/800/400?random=3" alt="" />
        </li>
    </ul>
</div>
```

```js
const btns = document.querySelectorAll('[data-carousel-btn]');
domHelper.addEventListenerList(btns, 'click', (e) => {
    const btn = e.currentTarget;
    const offset = btn.dataset.carouselBtn === 'next' ? 1 : -1;
    const slides = btn.closest('.carousel').querySelector('.carousel-slides');
    const activeSlide = slides.querySelector('.active');
    let newIndex = [...slides.children].indexOf(activeSlide) + offset;
    if (newIndex < 0) {
        // Wrap to the last slide
        newIndex = slides.children.length - 1;
    }
    if (newIndex >= slides.children.length) {
        // Wrap to the first slide
        newIndex = 0;
    }
    slides.children[newIndex].classList.add('active');
    activeSlide.classList.remove('active');
});
```

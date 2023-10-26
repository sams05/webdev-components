### Boilerplate

Apply `boilerplate.css` and `dom-helper.js`

```js
import * as domHelper from `dom-helper.js`;
```

### Dropdown Menu

Adapted from https://www.youtube.com/watch?v=S-VeYcOCFZw

Using `@starting-style` to transition on display:

-   https://developer.chrome.com/en/blog/new-in-chrome-117/#exit-entry-animations
-   https://drafts.csswg.org/css-transitions-2/#defining-before-change-style
-   https://chromestatus.com/feature/4515377717968896
-   https://www.youtube.com/watch?v=y8CYSwHXVNE&t=636s

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

### Rudder

```css
/* ||| Menu */
.rudder-menu {
    --rudder-menu-width: 100vw;
    --rudder-main-btn-dim: 60px;
    --rudder-sides: calc((3 / 4) * var(--rudder-main-btn-dim));

    /* Spacing calculations */
    --rudder-menu-children: 3; /* left, main, right */
    --rudder-menu-available-space: calc(
        var(--rudder-menu-width) - var(--rudder-main-btn-dim) - 2 * var(--rudder-sides)
    );
    /* Get unit spacing as if we are spacing evenly with flexbox: 2 units on each side of an element */
    --rudder-even-space-unit: calc(var(--rudder-menu-available-space) / (2 * var(--rudder-menu-children)));

    /* Menu should stretch across the bottom of the screen */
    width: var(--rudder-menu-width);
    position: fixed;
    bottom: 20px;

    display: flex;
    align-items: center;
    justify-content: center;
}
/* ||| Rudder left and right */
.rudder-menu {
    .rudder-left {
        transform: translateX(calc(-2 * var(--rudder-even-space-unit)));
    }
    .rudder-right {
        transform: translateX(calc(2 * var(--rudder-even-space-unit)));
    }
}
.rudder-menu .rudder-main {
    display: flex;
    justify-content: center;
    background-color: var(--blue);
    border-radius: calc((1 / 2) * var(--rudder-main-btn-dim));
    width: var(--rudder-main-btn-dim);

    transition: width 1s ease-in-out;

    :where(.rudder-main-menu-left, .rudder-main-menu-right) {
        display: none; /* Change to display: flex when active */
    }

    &.active {
        width: 100%;
    }

    &.active :where(.rudder-main-menu-left.flex, .rudder-main-menu-right.flex) {
        display: flex;
    }
}
/* ||| Button */
.rudder-menu button {
    width: var(--rudder-main-btn-dim);
    height: var(--rudder-main-btn-dim);
    padding: 0;
    border-radius: 50%;
    border: none;
}
.rudder-menu svg {
    width: 100%;
    height: auto;
}
.rudder-menu :where(.rudder-left, .rudder-right) button {
    width: var(--rudder-sides);
    height: var(--rudder-sides);
}
```

```html
<div class="rudder-menu">
    <div class="rudder-left">
        <button type="button">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <title>account-circle</title>
                <path
                    d="M12,19.2C9.5,19.2 7.29,17.92 6,16C6.03,14 10,12.9 12,12.9C14,12.9 17.97,14 18,16C16.71,17.92 14.5,19.2 12,19.2M12,5A3,3 0 0,1 15,8A3,3 0 0,1 12,11A3,3 0 0,1 9,8A3,3 0 0,1 12,5M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12C22,6.47 17.5,2 12,2Z"
                />
            </svg>
        </button>
    </div>
    <div class="rudder-main" id="rudder-main">
        <div class="rudder-main-menu-left">
            <button type="button">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <title>account-circle</title>
                    <path
                        d="M12,19.2C9.5,19.2 7.29,17.92 6,16C6.03,14 10,12.9 12,12.9C14,12.9 17.97,14 18,16C16.71,17.92 14.5,19.2 12,19.2M12,5A3,3 0 0,1 15,8A3,3 0 0,1 12,11A3,3 0 0,1 9,8A3,3 0 0,1 12,5M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12C22,6.47 17.5,2 12,2Z"
                    />
                </svg>
            </button>
            <button type="button">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <title>account-circle</title>
                    <path
                        d="M12,19.2C9.5,19.2 7.29,17.92 6,16C6.03,14 10,12.9 12,12.9C14,12.9 17.97,14 18,16C16.71,17.92 14.5,19.2 12,19.2M12,5A3,3 0 0,1 15,8A3,3 0 0,1 12,11A3,3 0 0,1 9,8A3,3 0 0,1 12,5M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12C22,6.47 17.5,2 12,2Z"
                    />
                </svg>
            </button>
        </div>
        <button type="button" id="rudder-main-menu-central-btn">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <title>plus</title>
                <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
            </svg>
        </button>
        <div class="rudder-main-menu-right">
            <button type="button">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <title>account-circle</title>
                    <path
                        d="M12,19.2C9.5,19.2 7.29,17.92 6,16C6.03,14 10,12.9 12,12.9C14,12.9 17.97,14 18,16C16.71,17.92 14.5,19.2 12,19.2M12,5A3,3 0 0,1 15,8A3,3 0 0,1 12,11A3,3 0 0,1 9,8A3,3 0 0,1 12,5M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12C22,6.47 17.5,2 12,2Z"
                    />
                </svg>
            </button>
            <button type="button">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <title>account-circle</title>
                    <path
                        d="M12,19.2C9.5,19.2 7.29,17.92 6,16C6.03,14 10,12.9 12,12.9C14,12.9 17.97,14 18,16C16.71,17.92 14.5,19.2 12,19.2M12,5A3,3 0 0,1 15,8A3,3 0 0,1 12,11A3,3 0 0,1 9,8A3,3 0 0,1 12,5M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12C22,6.47 17.5,2 12,2Z"
                    />
                </svg>
            </button>
        </div>
    </div>
    <div class="rudder-right">
        <button type="button">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <title>account-circle</title>
                <path
                    d="M12,19.2C9.5,19.2 7.29,17.92 6,16C6.03,14 10,12.9 12,12.9C14,12.9 17.97,14 18,16C16.71,17.92 14.5,19.2 12,19.2M12,5A3,3 0 0,1 15,8A3,3 0 0,1 12,11A3,3 0 0,1 9,8A3,3 0 0,1 12,5M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12C22,6.47 17.5,2 12,2Z"
                />
            </svg>
        </button>
    </div>
</div>
```

```js
(() => {
    function toggleRudderMain() {
        const rudderMain = document.getElementById('rudder-main');
        rudderMain.classList.toggle('active');
        setTimeout(() => {
            const left = document.querySelector('.rudder-main-menu-left');
            const right = document.querySelector('.rudder-main-menu-right');
            left.classList.toggle('flex');
            right.classList.toggle('flex');
        }, 1000);
    }

    const rudderCentralBtn = document.getElementById('rudder-main-menu-central-btn');
    rudderCentralBtn.addEventListener('click', (e) => toggleRudderMain());
})();
```

### Image Slider

Adapted from https://www.youtube.com/watch?v=9HcxHDS2w1s

### Issues

- Can make `switchSlide(slides, markers, offset)` more reusable by refactoring to use slides and markers as nodelists. This will reduce the dependency on the html code

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
/* ||| Markers */
.carousel-markers {
    position: absolute;
    bottom: 1rem;
    /* Horizontally center the markers */
    left: 50%;
    transform: translateX(-50%);
    z-index: 2;

    display: flex;
    gap: 1rem;

    .carousel-marker-btn {
        height: 1rem;
        width: 1rem;
        border: 0;
        border-radius: 50%;
        padding: 0;

        background-color: rgba(255, 255, 255, 0.5);
        box-shadow: 0px 0px 5px 1px black;
        &:active {
            box-shadow: inset 0 0 5px 2px rgb(0, 0, 0);
        }

        &.active {
            background-color: rgba(255, 255, 255, 1);
        }
    }
}
```

```html
<div class="carousel">
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
    <!-- Generate with javascript
            <ul class="carousel-markers">
                <li class="carousel-marker">
                    <button class="carousel-marker-btn active"></button>
                </li>
                <li class="carousel-marker">
                    <button class="carousel-marker-btn"></button>
                </li>
                <li class="carousel-marker">
                    <button class="carousel-marker-btn"></button>
                </li>
            </ul>
            -->
    <button type="button" class="carousel-btn prev" data-carousel-btn="prev">&lArr;</button>
    <button type="button" class="carousel-btn next" data-carousel-btn="next">&rArr;</button>
</div>
```

```js
(() => {
    function createCarouselMarker(isActive = false) {
        const li = document.createElement('li');
        li.classList.add('carousel-marker');
        const btn = document.createElement('button');
        btn.classList.add('carousel-marker-btn');
        if (isActive) {
            btn.classList.add('active');
        }
        btn.addEventListener('click', (e) => {
            // Get reference of target slide btn
            const targetSlideBtn = e.currentTarget;

            // Get reference of active slide btn and get array of marker btns
            const markerBtns = [...targetSlideBtn.closest('.carousel').querySelectorAll('.carousel-marker-btn')];
            const activeSlideBtn = markerBtns.find((btn) => btn.matches('.active'));

            // Compare indices of the btns to get offset
            const offset = markerBtns.indexOf(targetSlideBtn) - markerBtns.indexOf(activeSlideBtn);

            const slides = targetSlideBtn.closest('.carousel').querySelector('.carousel-slides');
            const markers = targetSlideBtn.closest('.carousel').querySelector('.carousel-markers');
            switchSlide(slides, markers, offset);
        });
        li.append(btn);
        return li;
    }

    function createCarouselMarkers(numSlides) {
        const ul = document.createElement('ul');
        ul.classList.add('carousel-markers');
        for (let i = 0; i < numSlides; i++) {
            const li = i === 0 ? createCarouselMarker(true) : createCarouselMarker();
            ul.append(li);
        }
        return ul;
    }

    /**
     * Switch the slides by the offset.
     * @param {HTMLElement} slides Container whose direct children are slides of the slider
     * @param {HTMLElement} markers Container whose direct children are list items containing marker buttons
     * @param {Number} offset Amount of slides to shift over
     */
    function switchSlide(slides, markers, offset) {
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

        // Reminder: ul.markers > li.marker > button.marker-btn[.active]?
        const activeMarkerBtn = markers.querySelector('.active');
        const newMarker = markers.children[newIndex];
        const newMarkerBtn = newMarker.firstElementChild;
        newMarkerBtn.classList.add('active');
        activeMarkerBtn.classList.remove('active');
    }

    // Add carousel markers into the DOM
    // ul.markers > li.marker > button.marker-btn[.active]?
    const carousels = document.querySelectorAll('.carousel');
    carousels.forEach((carousel) => {
        const slides = carousel.querySelector('.carousel-slides');
        const numSlides = slides.childElementCount;
        const carouselMarkers = createCarouselMarkers(numSlides);
        carousel.append(carouselMarkers);
    });

    const btns = document.querySelectorAll('[data-carousel-btn]');
    domHelper.addEventListenerList(btns, 'click', (e) => {
        const btn = e.currentTarget;
        const offset = btn.dataset.carouselBtn === 'next' ? 1 : -1;
        const slides = btn.closest('.carousel').querySelector('.carousel-slides');
        const markers = btn.closest('.carousel').querySelector('.carousel-markers');
        switchSlide(slides, markers, offset);
    });

    // Start autoplay
    carousels.forEach((carousel) => {
        const slides = carousel.querySelector('.carousel-slides');
        const markers = carousel.querySelector('.carousel-markers');
        setInterval(switchSlide, 5000, slides, markers, 1);
    });
})();
```

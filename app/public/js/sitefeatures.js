export default {
  hamburger: () => {
    /* DATA - (dt) //////////////////////////////////////// */
    let onOff = false;
  
    /* ELEMENTS - (els) //////////////////////////////////////// */
    const header = document.querySelector('header');
    const hamburger = document.getElementById('hamburger');
    hamburger.tabIndex = 0;
    hamburger.setAttribute('role', 'button');
    const hamburgerLines = document.querySelectorAll('#hamburger span');
    const slideout = document.getElementById('slideout');
    const overlay = document.getElementById('overlay');
    slideout.style.paddingBlockStart = `calc(${header.offsetHeight}px + var(--gutter))`;
    const lastMenuItem = slideout.querySelector('li:last-of-type a');
  
    /* FUNCTIONS - (fx) //////////////////////////////////////// */
    const setSlideoutTabindex = (value) => {
      slideout.querySelectorAll('a, button').forEach(el => el.setAttribute('tabindex', value));
    };
  
    const toggleSlideout = () => {
      slideout.classList.toggle('open');
      hamburgerLines.forEach(line => line.classList.toggle('change'));
      overlay.style.display = onOff ? 'none' : 'block';
      setSlideoutTabindex(onOff ? '-1' : '0');
      onOff = !onOff;
    };
  
    /* EVENT HANDLERS - (eh) //////////////////////////////////////// */  
    if (hamburger) {
      window.addEventListener('resize', () => slideout.style.paddingBlockStart = `calc(${header.offsetHeight}px + var(--gutter))`);
      hamburger.addEventListener('click', toggleSlideout);
      hamburger.addEventListener('keydown', event => {
        if (['Enter', 'NumpadEnter', 'Space'].includes(event.code)) {
          event.preventDefault();
          toggleSlideout();
        }
        if (event.code === 'Tab' && event.shiftKey && slideout.classList.contains('open')) {
          toggleSlideout();
        }
      });
      overlay.addEventListener('click', toggleSlideout);
    }
  
    // Set tabindex on slideout child elements when page loads
    setSlideoutTabindex('-1');
  
    slideout.addEventListener('focusin', () => {
      if (!slideout.classList.contains('open')) {
        slideout.querySelector('a, button').focus();
      }
    });
  
    lastMenuItem.addEventListener('keydown', event => {
      if (event.code === 'Tab' && !event.shiftKey) {
        toggleSlideout();
      }
    });    
  },  

  skipLink: () => {
  /* ELEMENTS - (els) //////////////////////////////////////// */
    const skipLink = document.querySelector('.skip-link');
    const mainContent = document.querySelector('#main-content');

    /* FUNCTIONS - (fx) //////////////////////////////////////// */
    const scrollToMainContent = (event) => {
      event.preventDefault();
      const yOffset = -0; // adjust this value to match your layout
      const y = mainContent.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
      mainContent.setAttribute('tabindex', '-1');
      mainContent.focus();
      mainContent.addEventListener('blur', () => {
        mainContent.removeAttribute('tabindex');
      }, { once: true });
    }

    /* EVENT HANDLERS - (eh) //////////////////////////////////////// */
    if (skipLink) {
      skipLink.addEventListener('click', scrollToMainContent);
    }  
  },
};
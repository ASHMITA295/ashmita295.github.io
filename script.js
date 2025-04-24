document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Element Selection ---
    const menuToggle = document.querySelector('.menu-toggle');
    const navList = document.querySelector('.nav-list');
    const navLinks = document.querySelectorAll('.nav-list a');
    // Select sections within main and the footer if it has an ID for highlighting
    const sections = document.querySelectorAll('main > section[id], footer[id]');
    const navElement = document.querySelector('nav'); // Reference to the nav bar itself
    const currentYearSpan = document.getElementById('current-year');
    const elementsToAnimate = document.querySelectorAll('.animate-on-scroll');

    // --- Mobile Menu Toggle ---
    if (menuToggle && navList) {
        menuToggle.addEventListener('click', () => {
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', !isExpanded);
            navList.classList.toggle('active');

            // Toggle hamburger/close icon
            const icon = menuToggle.querySelector('i');
            if (navList.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // --- Smooth Scroll & Close Mobile Menu on Link Click ---
    if (navLinks.length > 0 && navElement) {
        navLinks.forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);

                if (targetElement) {
                    const navHeight = navElement.offsetHeight;
                    // Calculate position, compensating for sticky nav height and adding a small buffer
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight - 10;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }

                // Close mobile menu if it's open after clicking a link
                if (navList && navList.classList.contains('active')) {
                    menuToggle.setAttribute('aria-expanded', 'false');
                    navList.classList.remove('active');
                    // Reset icon
                    const icon = menuToggle.querySelector('i');
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });
        });
    }

    // --- Close Mobile Menu on Click Outside ---
    if (menuToggle && navList) {
        document.addEventListener('click', (e) => {
            // Check if the click is outside the nav element AND the menu is active
            if (!e.target.closest('nav') && navList.classList.contains('active')) {
                menuToggle.setAttribute('aria-expanded', 'false');
                navList.classList.remove('active');
                // Reset icon
                const icon = menuToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // --- Active Navigation Link Highlighting on Scroll ---
    const activateNavLink = () => {
        if (!navElement || sections.length === 0 || navLinks.length === 0) return; // Exit if elements are missing

        let currentSectionId = '';
        const scrollPosition = window.pageYOffset;
        const navHeight = navElement.offsetHeight;
        // Adjust the trigger point (e.g., activate when section top is 150px from viewport top)
        const offsetThreshold = navHeight + 50;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - offsetThreshold;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            // Check if scroll position is within the section's bounds
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = sectionId;
            }
        });

        // Special case: If scrolled near the bottom, activate the last section's link
        if ((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight - 50 && sections.length > 0) {
             currentSectionId = sections[sections.length - 1].getAttribute('id');
        }


        // Update active class on links
        navLinks.forEach(link => {
            link.classList.remove('active-link');
            // Check if the link's href matches the current section ID (including '#')
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active-link');
            }
        });
    };

    // Attach scroll listener if sections exist
    if (sections.length > 0) {
        window.addEventListener('scroll', activateNavLink);
        activateNavLink(); // Initial check on page load
    }


    // --- Scroll Animations using Intersection Observer ---
    if ('IntersectionObserver' in window && elementsToAnimate.length > 0) {
        const observerOptions = {
            root: null, // Observe relative to the viewport
            rootMargin: '0px',
            threshold: 0.1 // Trigger when 10% of the element is visible
        };

        const observerCallback = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    observer.unobserve(entry.target); // Stop observing once animated to save resources
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);

        elementsToAnimate.forEach(el => observer.observe(el));
    } else {
        // Fallback for older browsers or if no elements to animate: just show them
        elementsToAnimate.forEach(el => el.classList.add('animated'));
    }


    // --- Update Footer Year ---
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

}); // End of DOMContentLoaded
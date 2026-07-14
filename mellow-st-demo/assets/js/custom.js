(function ($) {
    "use strict";

    // ===============================
    // GLOBAL HELPERS
    // ===============================
    function getOffset() {
        return $('#tc-header-global').outerHeight() || 85;
    }

    function setHeaderSpacing() {
        const headerHeight = $('#tc-header-global.fixed-top').outerHeight() || 0;
        $('body').css('padding-top', headerHeight + 'px');
    }

    // ===============================
    // HEADER
    // ===============================
    // Body top padding
    function initHeaderSpacing() {
        setHeaderSpacing();
        $(window).on('resize', function () {
            setHeaderSpacing();
        });
    }

    // Header menu color classes
    function initStickyHeader() {
        function headerSticky() {
            const windowPos = window.scrollY;
            const header = $('.tc-header');

            if (windowPos > 20) {
                header.addClass("tc-header--sticky");
                $('.default-nav-on-scroll')
                    .addClass("tc-menu-default")
                    .removeClass("tc-menu-alt");

                $('.alt-nav-on-scroll')
                    .addClass("tc-menu-alt")
                    .removeClass("tc-menu-default");
            } else {
                header.removeClass("tc-header--sticky");

                $('.default-nav-on-load')
                    .addClass("tc-menu-default")
                    .removeClass("tc-menu-alt");

                $('.alt-nav-on-load')
                    .addClass("tc-menu-alt")
                    .removeClass("tc-menu-default");
            }
        }
        headerSticky();
        let ticking = false;
        $(window).on('scroll', function () {
            if (!ticking) {
                requestAnimationFrame(function () {
                    headerSticky();
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    // ===============================
    // MENU
    // ===============================
    // Mobile menu
    function initResponsiveMenu() {
        $("#tc-menu-button").on("click", function () {
            $("#mainNavbar").stop(true, true).slideToggle(300);
            $(this).toggleClass("active");
        });

        $("#mainNavbar a").on("click", function (e) {
            if ($(window).width() <= 991) {
                if ($(this).parent().hasClass("dropdown")) return;

                $("#mainNavbar").stop(true, true).slideUp(300);
                $("#tc-menu-button").removeClass("active");
            }
        });
    }

    // Menu dropdown
    function initDropdownMenu() {
        $(document).on("click", ".dropdown-holder", function (e) {
            if ($(window).width() < 992) {
                e.preventDefault();

                $(this)
                    .siblings(".dropdown-menu")
                    .stop(true, true)
                    .slideToggle(250);
            }
        });
    }

    // ===============================
    // CONTACT FORM
    // ===============================
    function initContactForm() {
        if ($("#contactform").length && $.fn.validate) {
            $("#contactform").validate({
                submitHandler: function (form) {
                    $.ajax({
                        type: "POST",
                        url: $(form).attr("action"),
                        data: $(form).serialize(),
                        beforeSend: function () {
                            $("#result").html("Sending...");
                        },
                        success: function (response) {
                            $("#result").html(response);
                            form.reset();
                        },
                        error: function () {
                            $("#result").html("Something went wrong!");
                        }
                    });

                    return false;
                }
            });
            $('#contactform #message').val('');
        }
    }

    // ===============================
    // SWIPERS
    // ===============================
    function initSwipers() {
        // Testimonial
        document.querySelectorAll('.tc-testimonial-default').forEach(function (el) {
            new Swiper(el, {
                slidesPerView: 1,
                loop: true,
                speed: 600,
                autoplay: {
                    delay: 7000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true
                },
                pagination: {
                    el: el.querySelector('.swiper-pagination.tc-testimonial__dots'),
                    clickable: true
                },
                navigation: {
                    nextEl: el.querySelector('.swiper-button-next.tc-testimonial__next'),
                    prevEl: el.querySelector('.swiper-button-prev.tc-testimonial__prev')
                }
            });
        });

        // Testimonial center slide
        document.querySelectorAll('.tc-testimonial-center').forEach(function (el) {
            new Swiper(el, {
                slidesPerView: 1,
                loop: true,
                centeredSlides: false,
                spaceBetween: 20,
                speed: 600,
                autoplay: {
                    delay: 5000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true
                },
                pagination: {
                    el: el.querySelector('.swiper-pagination.tc-testimonial__dots'),
                    clickable: true
                },
                navigation: {
                    nextEl: el.querySelector('.swiper-button-next.tc-testimonial__next'),
                    prevEl: el.querySelector('.swiper-button-prev.tc-testimonial__prev')
                },
                breakpoints: {
                    992: {
                        slidesPerView: 'auto',
                        centeredSlides: true,
                        spaceBetween: 30
                    }
                }
            });
        });

        // Image carousel
        document.querySelectorAll('.tc-image-carousel').forEach(function (el) {
            new Swiper(el, {
                slidesPerView: 6,
                spaceBetween: 30,
                loop: true,
                speed: 600,
                autoplay: {
                    delay: 3000,
                    disableOnInteraction: false
                },
                breakpoints: {
                    0: { slidesPerView: 2 },
                    768: { slidesPerView: 3 },
                    1024: { slidesPerView: 4 },
                    1200: { slidesPerView: 6 }
                }
            });
        });
    }

    // ===============================
    // PORTFOLIO
    // ===============================
    function initPortfolio() {
        const $fitRowsGrid = $('.tc-portfolio-fitrows');
        const $masonryGrid = $('.tc-portfolio-masonry');

        $fitRowsGrid.each(function () {
            const $grid = $(this);
            $grid.imagesLoaded(function () {
                $grid.isotope({
                    itemSelector: '.tc-portfolio-item',
                    layoutMode: 'fitRows'
                });
            });
        });

        $masonryGrid.each(function () {
            const $grid = $(this);
            $grid.imagesLoaded(function () {
                $grid.isotope({
                    itemSelector: '.tc-portfolio-item',
                    masonry: {
                        columnWidth: '.tc-portfolio-item',
                        percentPosition: true
                    }
                });
            });
        });

        $('.tc-filter-nav').on('click', 'a', function (e) {
            e.preventDefault();
            const selector = $(this).data('filter') || '*';
            $('.tc-filter-nav a').removeClass('active');
            $(this).addClass('active');
            $fitRowsGrid.isotope({ filter: selector });
            $masonryGrid.isotope({ filter: selector });
        });
    }

    // ===============================
    // NAVIGATION
    // ===============================
    function initSmoothScroll() {
        const navSelector = '.tc-scroll-nav .nav-link, .tc-scroll-link';
        $(document).on('click', navSelector, function (e) {
            const target = $(this).attr('href');
            if (!target || target === "#" || !target.startsWith("#")) return;
            if ($(target).length) {
                e.preventDefault();
                const offsetTop = $(target).offset().top - getOffset();
                $('html, body').stop().animate({
                    scrollTop: offsetTop
                }, 600, function () {
                    history.replaceState(
                        null,
                        null,
                        window.location.pathname + window.location.search
                    );
                });
                $('.tc-scroll-nav .nav-link').removeClass('active');
                $(`.tc-scroll-nav .nav-link[href="${target}"]`)
                    .addClass('active');
            }
        });
    }

    function initActiveLinks() {
        const sections = document.querySelectorAll('section[id]');
        let currentActiveId = '';
        function updateActiveLink(id) {
            if (window.innerWidth >= 992) {
                const links = $('#tc-header-global .nav-link');
                links.removeClass('active');
                $(`#tc-header-global .nav-link[href="#${id}"]`)
                    .addClass('active')
                    .closest('.dropdown')
                    .find('.nav-link.dropdown-toggle')
                    .addClass('active');
            }
        }

        function checkActiveSection() {
            const scrollPos = $(window).scrollTop();
            const viewportMid = scrollPos + ($(window).height() / 2);
            const offset = getOffset();
            sections.forEach(section => {
                const top = $(section).offset().top - offset;
                const bottom = top + $(section).outerHeight();
                if (viewportMid >= top && viewportMid < bottom) {
                    const id = section.getAttribute('id');
                    if (currentActiveId !== id) {
                        currentActiveId = id;
                        updateActiveLink(id);
                    }
                }
            });
        }
        let ticking = false;
        function handleScroll() {
            if (!ticking) {
                requestAnimationFrame(function () {
                    checkActiveSection();
                    ticking = false;
                });
                ticking = true;
            }
        }
        $(window).on('scroll resize', handleScroll);
        checkActiveSection();
    }

    // ===============================
    // CURSOR
    // ===============================
    function initThemeCursor() {
        var customCursor = $('.tc-cursor-wrapper');
        if (!customCursor.length) return;
        const e = document.querySelector(".tc-cursor"),
            t = document.querySelector(".tc-cursor");

        if (!e || !t) return;
        let o = false;
        window.addEventListener('mousemove', function (s) {
            if (!o) {
                t.style.transform = "translate(" + s.clientX + "px, " + s.clientY + "px)";
            }
            e.style.transform = "translate(" + s.clientX + "px, " + s.clientY + "px)";
        });
        $("body").on("mouseenter", "a, button, [type=submit], [type=button], .tc-pointer", function () {
            e.classList.add("tc-cursor-hover");
            t.classList.add("tc-cursor-hover");
        });
        $("body").on("mouseleave", "a, button, [type=submit], [type=button], .tc-pointer", function () {
            if (!$(this).closest(".tc-pointer").length) {
                e.classList.remove("tc-cursor-hover");
                t.classList.remove("tc-cursor-hover");
            }
        });
        e.style.visibility = "visible";
        t.style.visibility = "visible";
    }

    // ===============================
    // COUNTER
    // ===============================
    function initCounter() {
        let counted = false;

        function runCounter() {
            $('.counter').each(function () {
                const $this = $(this);
                const target = parseInt($this.data('target'), 10);
                $({ countNum: 0 }).animate(
                    { countNum: target },
                    {
                        duration: 2000,
                        easing: 'swing',
                        step: function () {
                            $this.text(Math.floor(this.countNum));
                        },
                        complete: function () {
                            $this.text(target);
                        }
                    }
                );
            });
        }

        function checkCounter() {
            const $stats = $('.tc-stats');
            if (!$stats.length) return;
            const sectionTop = $stats.offset().top;
            const scrollTop = $(window).scrollTop();
            const windowHeight = $(window).height();
            if (!counted && scrollTop + windowHeight > sectionTop) {
                runCounter();
                counted = true;
            }
        }

        $(window).on('scroll', checkCounter);
        checkCounter();
    }

    // ===============================
    // PAGE LOAD
    // ===============================
   function initPageLoad() {
        const hash = window.location.hash;
        if (hash && document.querySelector(hash)) {
        setTimeout(function () {
            const offsetTop = $(hash).offset().top - getOffset();
            $('html, body').stop().animate({
                scrollTop: offsetTop
            }, 600);
        }, 300);
        }

        $('.tc-preloader').delay(400).fadeOut(500);
    }
        // ===============================
    // INIT
    // ===============================
    $(document).ready(function () {
        initHeaderSpacing();
        initResponsiveMenu();
        initDropdownMenu();
        initContactForm();
        initSwipers();
        initSmoothScroll();
        initActiveLinks();
        initCounter();
        initThemeCursor();
    });

    $(window).on('load', function () {
        initStickyHeader();
        initPortfolio();
        initPageLoad();
    });

})(jQuery);
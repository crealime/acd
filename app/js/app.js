window.addEventListener('load', function () {
	const html = document.documentElement
	const body = document.querySelector('body')
	const header = document.querySelector('.header')
	const main = document.querySelector('.main')
	const headerLiExpand = document.querySelector('.header__li-expand')
	const headerUlLi = document.querySelectorAll('.header__catalog>ul>li')
	const headerMenu = document.querySelector('.header__menu')
	const headerMenuBox = document.querySelector('.header__menu-box')
	const headerCatalog = document.querySelector('.header__catalog')
	const headerCatalogArr = headerLiExpand.querySelector('.header__catalog i')
	const headerBurger = document.querySelector('.header__burger')
	const overlay = document.querySelector('.overlay')
	const headerBurgerOpen = document.querySelector('.header__burger .fa-bars')
	const headerBurgerClose = document.querySelector('.header__burger .fa-xmark')

	// Change main margin-top
	function changeMainMarginTop() {
		main.style.marginTop = header.offsetHeight + 'px'
	}

	changeMainMarginTop()
	window.addEventListener('resize', changeMainMarginTop)

	// Expand mobile menu
	function expandMobileMenu() {
		headerMenuBox.classList.toggle('header__menu-box_visible')
		headerBurgerOpen.classList.toggle('d-none')
		headerBurgerClose.classList.toggle('d-none')
		overlay.classList.toggle('overlay_visible')
		html.style.overflowY = html.style.overflowY !== 'hidden' ? 'hidden' : ''
	}

	headerBurger.addEventListener('click', () => {
		expandMobileMenu()
	})

	overlay.addEventListener('click', () => {
		expandMobileMenu()
	})

	// Expand ul in mobile menu
	headerLiExpand.addEventListener('click', ()=> {
		headerCatalog.classList.toggle('header__li-expanded')
		headerCatalogArr.classList.toggle('header__arr-rotate')
	});

	// Expand li in mobile menu
	headerUlLi.forEach((li) => {
		const link = li.querySelector('a')
		const clone = headerLiExpand.cloneNode(true)
		const arr = clone.querySelector('i')
		clone.classList.remove('d-none')
		clone.addEventListener('click', function() {
			li.classList.toggle('header__li-expanded')
			arr.classList.toggle('header__arr-rotate')
		});
		link.after(clone)
	});

	// Slider
	const swiper = new Swiper('.swiper', {
		loop: true,
		// autoHeight: true,
		navigation: {
			nextEl: '.swiper__button_next',
			prevEl: '.swiper__button_prev',
		}
	})


})




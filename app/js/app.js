window.addEventListener('load', function () {
	const headerLiExpand = document.querySelector('.header__li-expand')
	const headerUlLi = document.querySelectorAll('.header__catalog>ul>li')
	const headerMenu = document.querySelector('.header__menu')
	const headerCatalog = document.querySelector('.header__catalog')
	const headerCatalogArr = headerLiExpand.querySelector('.header__catalog i')
	const headerBurger = document.querySelector('.header__burger')
	const headerBurgerOpen = document.querySelector('.header__burger .fa-bars')
	const headerBurgerClose = document.querySelector('.header__burger .fa-xmark')

	// Expand mobile menu
	headerBurger.addEventListener('click', function () {
		headerMenu.classList.toggle('header__menu_visible')
		headerBurgerOpen.classList.toggle('d-none')
		headerBurgerClose.classList.toggle('d-none')
	})

	// Expand ul in mobile menu
	headerLiExpand.addEventListener('click', function() {
		headerCatalog.classList.toggle('header__li-expanded')
		headerCatalogArr.classList.toggle('header__arr-rotate')
	});

	// Expand li in mobile menu
	headerUlLi.forEach(function(li) {
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



})




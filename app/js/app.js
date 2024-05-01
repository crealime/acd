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
	const callPopup = document.querySelectorAll('.call-popup')
	const popup = document.querySelectorAll('.popup')
	const formAjax = document.querySelectorAll('.form-ajax')
	const popupClose = document.querySelectorAll('.popup__close')
	const warning = document.querySelector('.warning')
	const warningClose = document.querySelector('.warning__close')
	const warningLink = document.querySelector('.warning__link')

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
		html.style.overflowY = html.style.overflowY !== 'hidden' ? 'hidden' : 'auto'
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

	// Show/hide popup

	function showPopup(elem) {
		elem.classList.remove('d-none')
		setTimeout(() => {
			elem.classList.add('show')
		}, 100)
		setTimeout(() => {
			html.style.overflowY = 'hidden'
		}, 500)
	}
	function hidePopup(elem) {
		html.style.overflowY = 'auto'
		elem.classList.remove('show')
		setTimeout(() => {
			elem.classList.add('d-none')
		}, 600)
	}

	// Show/hide

	function show(elem) {
		elem.classList.remove('d-none')
		setTimeout(() => {
			elem.classList.add('show')
		}, 100)
	}
	function hide(elem) {
		elem.classList.remove('show')
		setTimeout(() => {
			elem.classList.add('d-none')
		}, 600)
	}

	callPopup.forEach(item => {
		item.addEventListener('click', function(e) {
			e.preventDefault()
			const id = this.href.split('#').pop()
			const thisPopup = document.getElementById(id)
			showPopup(thisPopup)
		})
	})

	popup.forEach(item => {
		item.addEventListener('click', (e) => {
			if (e.target.classList.contains('popup')) {
				hidePopup(e.target)
			}
		})
	})

	popupClose.forEach(item => {
		item.addEventListener('click', function (){
			hidePopup(this.closest('.popup'))
		})
	})

	function sendRequest(method, url, body = null) {
		const headers = {
			'Content-type': 'application/json; charset=UTF-8'
		}

		return fetch(url, {
			method,
			body: JSON.stringify(body),
			headers,
		}).then(response => {
			if (response.ok) {
				return response.json()
			}
			return response.text().then(error => {
				const e = new Error('Error!!!')
				e.data = error
				throw e
			})
		})
	}

	function resetAllForms() {
		document.querySelectorAll('.popup__input').forEach(item => {
			item.value = ''
		})
		document.querySelectorAll('.popup__textarea').forEach(item => {
			item.value = ''
		})
	}

	function showAlert(header = 'Test message!', body = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.') {
		const cAlert = document.querySelector('.custom-alert')
		const cAlertHeader = document.querySelector('.custom-alert__header ')
		const cAlertBody = document.querySelector('.custom-alert__body')
		cAlertHeader.innerText = header
		cAlertBody.innerText = body
		cAlert.classList.remove('d-none')
		setTimeout(() => {
			cAlert.classList.add('show')
		}, 1000)
		setTimeout(() => {
			cAlert.classList.remove('show')
			setTimeout(() => {
				cAlert.classList.add('d-none')
			}, 1000)
		}, 8000)
	}

	// Send form

	function sendForm() {
		formAjax.forEach(item => {
			item.onsubmit = function (e) {
				e.preventDefault()
				const that = this
				const formDate = serialize(this)
				const phpMail = 'mail.php'

				sendRequest('POST', phpMail, formDate)
					.then((response) => {
						resetAllForms()
						popup.forEach(item => {
							hidePopup(item)
						})
						Swal.fire({
							position: "center",
							icon: "success",
							title: formDate.сool,
							text: formDate.сool_message,
							timer: 5000
						});

						const action = that.querySelector('.popup').id

						switch(action) {
							case 'callback':
								dataLayer.push({
									'event': 'eEvent',
									'eAction': 'Recall'
								})
								console.log('Recall')
								break
							case 'consult':
								dataLayer.push({
									'event': 'eEvent',
									'eAction': 'Consultation'
								})
								console.log('Consultation')
								break
						}

					})
					.catch(err => {
							console.log(err)
							Swal.fire({
								position: "center",
								icon: "error",
								title: formDate.bad,
								text: formDate.bad_message,
								timer: 10000
							})
						}
					)
			}
		})
	}
	sendForm()

	// Serialize

	function serialize(form) {
		if (!form || form.nodeName !== "FORM") {
			return
		}
		let i, j,
			obj = {}
		for (i = 0; i < form.elements.length; i ++) {
			if (form.elements[i].name === "") {
				continue
			}
			switch (form.elements[i].nodeName) {
				case 'INPUT':
					switch (form.elements[i].type) {
						case 'text':
						case 'number':
						case 'hidden':
						case 'tel':
						case 'password':
						case 'button':
						case 'reset':
						case 'submit':
						case 'range':
							obj[form.elements[i].name] = form.elements[i].value
							break
						case 'checkbox':
						case 'radio':
							if (form.elements[i].checked) {
								obj[form.elements[i].name] = form.elements[i].value
							}
							break
						case 'file':
							break
					}
					break
				case 'TEXTAREA':
					obj[form.elements[i].name] = form.elements[i].value
					break
				case 'SELECT':
					switch (form.elements[i].type) {
						case 'select-one':
							obj[form.elements[i].name] = form.elements[i].value
							break
						case 'select-multiple':
							for (j = form.elements[i].options.length - 1; j >= 0; j = j - 1) {
								if (form.elements[i].options[j].selected) {
									obj[form.elements[i].name] = form.elements[i].options[j].value
								}
							}
							break
					}
					break
				case 'BUTTON':
					switch (form.elements[i].type) {
						case 'reset':
						case 'submit':
						case 'button':
							obj[form.elements[i].name] = form.elements[i].value
							break
					}
					break
			}
		}
		return obj
	}

	// Show warning

	function getCookie ( coo ) {
		const results = document.cookie.match ( '(^|;) ?' + coo + '=([^;]*)(;|$)' )

		if ( results )
			return decodeURI ( results[2] )
		else
			return null
	}

	const oncoo = getCookie('oncoo')
	const date = new Date(new Date().getTime() + 3600 * 24 * 7 * 1000)
	const dateEnd = date.toUTCString()

	if (!navigator.cookieEnabled || oncoo === '1') {

	}
	else {
		setTimeout(function() {
			show(warning)
		}, 5000)
	}

	function hideWarning() {
		hide(warning)
		document.cookie = "oncoo=1; path=/; expires=" + dateEnd
	}

	warningClose.addEventListener('click', () => {
		hideWarning()
	})
	warningLink.addEventListener('click', () => {
		hideWarning()
	})

	// Swal.fire({
	// 	title: 'Error!',
	// 	text: 'Do you want to continue',
	// 	icon: 'error',
	// 	confirmButtonText: 'Cool'
	// })
})




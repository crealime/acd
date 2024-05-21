window.addEventListener('load', function () {
	const formsProd = document.querySelectorAll('.form-prod')
	formsProd.forEach(form => {
		form.addEventListener('submit', event => {
			event.preventDefault()
		})
	})
})
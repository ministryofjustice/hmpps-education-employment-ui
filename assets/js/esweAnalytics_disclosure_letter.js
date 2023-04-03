$(() => {
  // Track disclosure letter
  const $btns = document.querySelectorAll('.govuk-button')
  $btns.forEach(btn => {
    if (btn.baseURI.indexOf('edit/housing') > 0) {
      const $btnLetter = $('.govuk-button[data-ga-category]')

      $btnLetter.on('click', () => {
        const $radios = document.querySelectorAll('.govuk-radios__item')
        $radios.forEach(rad => {
          if (rad.firstElementChild.checked) {
            if (typeof gtag === typeof Function) {
              gtag('event', 'eswe-disclosure-letter', {
                category: 'Disclosure letter',
                progress: rad.innerText,
              })
            }
          }
        })
      })
    }
  })
})
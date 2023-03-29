$(() => {
  // Track housing needs
  const $btns = document.querySelectorAll('.govuk-button')
  $btns.forEach(btn => {
    if (btn.baseURI.indexOf('edit/housing') > 0) {
      const $btnHousing = $('.govuk-button[data-ga-category]')

      $btnHousing.on('click', () => {
        const $radios = document.querySelectorAll('.govuk-radios__item')
        $radios.forEach(rad => {
          if (rad.firstElementChild.checked) {
            if (typeof gtag === typeof Function) {
              gtag('event', `Housing - ${rad.innerText}`, {
                category: 'eswe-housing',
                progress: rad.innerText,
              })
            }
          }
        })
      })
    }
  })
})

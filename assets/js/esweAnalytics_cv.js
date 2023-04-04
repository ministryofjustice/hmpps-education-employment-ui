$(() => {
  // Track cv and covering letter progress
  const $btns = document.querySelectorAll('.govuk-button')
  $btns.forEach(btn => {
    if (btn.baseURI.indexOf('edit/cv_and_covering_letter') > 0) {
      const $btnCv = $('.govuk-button[data-ga-category]')

      $btnCv.on('click', () => {
        const $radios = document.querySelectorAll('.govuk-radios__item')
        $radios.forEach(rad => {
          if (rad.firstElementChild.checked) {
            if (typeof gtag === typeof Function) {
              gtag('event', `CV and letter - ${rad.innerText}`, {
                event_category: 'button',
                event_label: rad.innerText,
                value: 1,
              })
            }
          }
        })
      })
    }
  })
})

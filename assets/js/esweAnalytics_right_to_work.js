$(() => {
  // Track right to work
  const $btns = document.querySelectorAll('.govuk-button')
  $btns.forEach(btn => {
    if (btn.baseURI.indexOf('right-to-work/new') > 0) {
      const $btnRightToWork = $('.govuk-button[data-ga-category]')

      $btnRightToWork.on('click', () => {
        const $radios = document.querySelectorAll('.govuk-radios__item')
        $radios.forEach(rad => {
          if (rad.firstElementChild.checked) {
            if (typeof gtag === typeof Function) {
              gtag('event', `Right to work - ${rad.innerText}`, {
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

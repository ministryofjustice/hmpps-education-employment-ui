$(() => {
  // Track change of work status
  const $btns = document.querySelectorAll('.govuk-button')
  $btns.forEach(btn => {
    if (btn.baseURI.indexOf('new-status') > 0) {
      const $btnWorkStatus = $('.govuk-button[data-ga-category]')

      $btnWorkStatus.on('click', () => {
        const $radios = document.querySelectorAll('.govuk-radios__item')
        $radios.forEach(rad => {
          if (rad.firstElementChild.checked) {
            if (typeof gtag === typeof Function) {
              gtag('event', `Work status - ${rad.innerText}`, {
                category: 'eswe-work-status',
                progress: rad.innerText,
              })
            }
          }
        })
      })
    }
  })
})

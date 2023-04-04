$(() => {
  // Track drug and alcohol dependency
  const $btns = document.querySelectorAll('.govuk-button')
  $btns.forEach(btn => {
    if (btn.baseURI.indexOf('manage-drugs-and-alcohol/update') > 0) {
      const $btnDrugAndAlcohol = $('.govuk-button[data-ga-category]')

      $btnDrugAndAlcohol.on('click', () => {
        const $radios = document.querySelectorAll('.govuk-radios__item')
        $radios.forEach(rad => {
          if (rad.firstElementChild.checked) {
            if (typeof gtag === typeof Function) {
              gtag('event', 'Drug and alcohol', {
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

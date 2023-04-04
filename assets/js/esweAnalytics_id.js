$(() => {
  // Track ID changes
  const $btns = document.querySelectorAll('.govuk-button')
  $btns.forEach(btn => {
    if (btn.baseURI.indexOf('edit/id') > 0) {
      const $btnId = $('.govuk-button[data-ga-category]')

      $btnId.on('click', () => {
        let progressStatus = ''
        let typeOfIdInPlace = ''

        const $radios = document.querySelectorAll('.govuk-radios__item')
        $radios.forEach(rad => {
          if (rad.firstElementChild.checked) {
            progressStatus = rad.innerText
          }
        })

        const $chks = document.querySelectorAll('.govuk-checkboxes__input')
        var idArray = []
        $chks.forEach(chk => {
          if (chk.checked) {
            idArray.push(chk.defaultValue)
          }
        })
        typeOfIdInPlace = idArray.length ? idArray.join(',') : ''

        if (progressStatus || typeOfIdInPlace) {
          if (typeof gtag === typeof Function) {
            gtag('event', `ID status - ${progressStatus}`, {
              category: 'eswe-id-change_event',
              progress: progressStatus,
              idInPlace: typeOfIdInPlace,
            })
          }
        }
      })
    }
  })
})

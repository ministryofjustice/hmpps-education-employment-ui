$(() => {
  // Track bank account progress
  const $btns = document.querySelectorAll('.govuk-button')
  $btns.forEach(btn => {
    if (btn.baseURI.indexOf('edit/bank_account') > 0) {
      const $btnBankAcct = $('.govuk-button[data-ga-category]')

      $btnBankAcct.on('click', () => {
        const $radios = document.querySelectorAll('.govuk-radios__item')
        $radios.forEach(rad => {
          if (rad.firstElementChild.checked) {
            if (typeof gtag === typeof Function) {
              gtag('event', 'eswe-bank-account', {
                category: 'Bank account status',
                progress: rad.innerText,
              })
            }
          }
        })
      })
    }
  })
})

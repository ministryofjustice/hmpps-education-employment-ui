$(() => {
  // Track email and phone number progress
  const $header = document.querySelector('h1')
  if ($header !== null && $header.textContent.startsWith('Email')) {
    const $btns = document.querySelectorAll('.govuk-button')

    $btns.forEach(btn => {
      if (btn.baseURI.indexOf('edit/email_or_phone') > 0) {
        const $btnEmailPhone = $('.govuk-button[data-ga-category]')

        $btnEmailPhone.on('click', () => {
          const $radios = document.querySelectorAll('.govuk-radios__item')
          $radios.forEach(rad => {
            if (rad.firstElementChild.checked) {
              if (typeof gtag === typeof Function) {
                gtag('event', `Email or phone - ${rad.innerText}`, {
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
  }
})

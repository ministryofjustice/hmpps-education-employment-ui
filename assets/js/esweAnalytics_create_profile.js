$(() => {
  // Track profile creation
  const $btns = document.querySelectorAll('.govuk-button')
  $btns.forEach(btn => {
    if (btn.baseURI.indexOf('check-answers') > 0) {
      const $btnProfile = $('.govuk-button[data-ga-category]')

      $btnProfile.on('click', () => {
        if (typeof gtag === typeof Function) {
          gtag('event', 'Profile created', {
            category: 'eswe-create-profile',
            progress: btn.innerText,
          })
        }
      })
    }
  })
})

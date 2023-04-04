$(() => {
  // Track ability to work status
  const $btns = document.querySelectorAll('.govuk-button')
  $btns.forEach(btn => {
    if (btn.baseURI.indexOf('ability-to-work/update') > 0) {
      const $btnAbilityToWork = $('.govuk-button[data-ga-category]')

      $btnAbilityToWork.on('click', () => {
        const $chks = document.querySelectorAll('.govuk-checkboxes__input')
        var abilityArray = []
        $chks.forEach(chk => {
          if (chk.checked) {
            abilityArray.push(chk.defaultValue)
          }
        })

        if (abilityArray.length) {
          if (typeof gtag === typeof Function) {
            gtag('event', 'Ability to work', {
              event_category: 'button',
              event_label: abilityArray.join(','),
              value: 1,
            })
          }
        }
      })
    }
  })
})

$(() => {
  // Track whether support is needed or not
  const $supportHeaders = document.querySelectorAll('h1')

  try {
    $supportHeaders.forEach(header => {
      // Track CV status
      if (header !== null && header.innerText.indexOf('CV') !== -1) {
        const $btnCv = $('.govuk-button[data-ga-category]')
        $btnCv.on('click', () => {
          const $radios = document.querySelectorAll('.govuk-radios__item')

          $radios.forEach(rad => {
            if (rad.firstElementChild.checked) {
              if (typeof gtag === typeof Function) {
                gtag('event', `CV and letter - ${rad.innerText}`, {
                  event_category: 'button click',
                  event_label: rad.innerText,
                })
              }
            }
          })
        })
      }

      // Track disclosure letters
      else if (header !== null && header.innerText.indexOf('Disclosure') !== -1) {
        const $btnLetter = $('.govuk-button[data-ga-category]')
        $btnLetter.on('click', () => {
          const $radLetter = document.querySelectorAll('.govuk-radios__item')
          $radLetter.forEach(rad => {
            if (rad.firstElementChild.checked) {
              if (typeof gtag === typeof Function) {
                gtag('event', `Disclosure letter - ${rad.innerText}`, {
                  event_category: 'button click',
                  event_label: rad.innerText,
                })
              }
            }
          })
        })
      }

      // Track housing needs
      else if (header !== null && header.innerText.indexOf('Housing') !== -1) {
        const $btnHousing = $('.govuk-button[data-ga-category]')
        $btnHousing.on('click', () => {
          const $radios = document.querySelectorAll('.govuk-radios__item')
          $radios.forEach(rad => {
            if (rad.firstElementChild.checked) {
              if (typeof gtag === typeof Function) {
                gtag('event', `Housing - ${rad.innerText}`, {
                  event_category: 'button',
                  event_label: rad.innerText,
                })
              }
            }
          })
        })
      }

      // Track drug and alcohol dependency
      else if (header !== null && header.innerText.indexOf('manage their drug or alcohol dependency') > 0) {
        const $btnDrugAndAlcohol = $('.govuk-button[data-ga-category]')
        $btnDrugAndAlcohol.on('click', () => {
          const $radiosDrugAndAlcohol = document.querySelectorAll('.govuk-radios__item')
          $radiosDrugAndAlcohol.forEach(rad => {
            if (rad.firstElementChild.checked) {
              if (typeof gtag === typeof Function) {
                gtag('event', 'Drug and alcohol', {
                  event_category: 'button click',
                  event_label: rad.innerText,
                })
              }
            }
          })
        })
      }

      // Track what might affect ability to work
      else if (header !== null && header.innerText.indexOf('ability to work') > 0) {
        const $btnWhatMightAffectAbilityToWork = $('.govuk-button[data-ga-category]')
        $btnWhatMightAffectAbilityToWork.on('click', () => {
          const $chksAbilityToWork = document.querySelectorAll('.govuk-checkboxes__input')
          let abilityAffected = ''

          $chksAbilityToWork.forEach(chk => {
            if (chk.checked) {
              abilityAffected = chk.defaultValue.toString().startsWith('None') ? 'No' : 'Yes'
            }
          })

          if (typeof gtag === typeof Function) {
            gtag('event', `Ability affected - ${abilityAffected}`, {
              event_category: 'button click',
              event_label: 'What affects ability to work',
            })
          }
        })
      }
    })
  } catch {}
})

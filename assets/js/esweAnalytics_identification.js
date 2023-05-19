$(() => {
  // Track whether support is needed or not
  const $supportHeaders = document.querySelectorAll('h1')

  try {
    $supportHeaders.forEach(header => {
      // Track ID status and type
      if (header !== null && header.innerText.indexOf('ID') !== -1) {
        const $btnId = $('.govuk-button[data-ga-category]')
        $btnId.on('click', () => {
          const $radios = document.querySelectorAll('.govuk-radios__item')
          $radios.forEach(rad => {
            if (rad.firstElementChild.checked) {
              const $chkIdsInplace = document.querySelectorAll('.govuk-checkboxes__input')
              let idArray = []

              $chkIdsInplace.forEach(chk => {
                if (chk.checked) {
                  idArray.push(chk.defaultValue)
                }
              })
              const typeOfIdsInPlace = `${idArray.length ? idArray.join(' ~ ') : 'Not set'}`

              if (typeof gtag === typeof Function) {
                gtag('event', `ID status - ${rad.innerText}`, {
                  event_category: 'button click',
                  event_label: typeOfIdsInPlace,
                })
              }
            }
          })
        })
      }

      // Track bank account status
      else if (header !== null && header.innerText.indexOf('Bank account') !== -1) {
        const $btnBankAcct = $('.govuk-button[data-ga-category]')

        $btnBankAcct.on('click', () => {
          const $radios = document.querySelectorAll('.govuk-radios__item')
          $radios.forEach(rad => {
            if (rad.firstElementChild.checked) {
              if (typeof gtag === typeof Function) {
                gtag('event', `Bank account - ${rad.innerText}`, {
                  category: 'button click',
                  event_label: rad.innerText,
                })
              }
            }
          })
        })
      }

      // Track email and phone number
      else if (header !== null && header.innerText.startsWith('Email address')) {
        const $btnEmailPhone = $('.govuk-button[data-ga-category]')
        $btnEmailPhone.on('click', () => {
          const $radios = document.querySelectorAll('.govuk-radios__item')
          $radios.forEach(rad => {
            if (rad.firstElementChild.checked) {
              if (typeof gtag === typeof Function) {
                gtag('event', `Email or phone - ${rad.innerText}`, {
                  event_category: 'button',
                  event_label: rad.innerText,
                })
              }
            }
          })
        })
      }

      // Track type of work offender is interested in
      else if (header !== null && header.innerText.startsWith('What type of work') > 0) {
        const $chkWorkOfInterest = document.querySelectorAll('.govuk-checkboxes__input')
        let idWorkArray = []

        $chkWorkOfInterest.forEach(chk => {
          if (chk.checked) {
            idWorkArray.push(chk.defaultValue)
          }
        })

        const typeOfWorkOfInterest = `${idWorkArray.length ? 'Yes' : 'Not set'}`

        if (typeof gtag === typeof Function) {
          gtag('event', `Work of interest - ${typeOfWorkOfInterest}`, {
            event_category: 'button click',
            event_label: typeOfWorkOfInterest,
          })
        }
      }
    })
  } catch {}
})

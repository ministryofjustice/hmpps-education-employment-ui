$(() => {
  // Track starting to complete a profile
  const $profileHeaders = document.querySelectorAll('h1')
  let eventTitle = ''
  try {
    $profileHeaders.forEach(header => {
      // Start of profile creation
      if (header !== null && header.innerText.indexOf('work profile') > 0) {
        const $tabs = document.querySelectorAll('.moj-sub-navigation__list li')
        $tabs.forEach(tab => {
          if (tab.innerText.indexOf('Overview') !== -1) {
            const $lnks = document.querySelectorAll('.govuk-notification-banner__link')
            $lnks.forEach(lnk => {
              if (lnk.id.indexOf('overview') !== -1) {
                const $lnkAssessment = $('#overview-assessment-link')
                $lnkAssessment.on('click', () => {
                  if (typeof gtag === typeof Function) {
                    gtag('event', 'Begin profile', {
                      event_category: 'link button',
                      event_label: $lnkAssessment[0].innerText,
                    })
                  }
                })
              }
            })
          }
        })
      }

      // Right to work in the UK
      else if (header !== null && header.innerText.indexOf('Right to work') !== -1) {
        const $btnRightToWork = $('.govuk-button')
        $btnRightToWork.on('click', () => {
          const $radRightToWork = document.querySelectorAll('.govuk-radios__item')
          $radRightToWork.forEach(rad => {
            if (rad.firstElementChild.checked) {
              eventTitle = rad.innerText === 'Yes' ? 'Right to work' : 'No right to work'
              if (typeof gtag === typeof Function) {
                gtag('event', eventTitle, {
                  event_category: 'button click',
                  event_label: rad.innerText,
                })
              }
            }
          })
        })
      }

      // Want support to get work
      else if (header !== null && header.innerText.indexOf('want support') > 0) {
        const $btnWantSupport = $('.govuk-button')
        $btnWantSupport.on('click', () => {
          const $radWantSupport = document.querySelectorAll('.govuk-radios__item')
          $radWantSupport.forEach(rad => {
            if (rad.firstElementChild.checked) {
              eventTitle = rad.innerText === 'Yes' ? 'Want support' : 'Support declined'
              if (typeof gtag === typeof Function) {
                gtag('event', eventTitle, {
                  event_category: 'button click',
                  event_label: rad.innerText,
                })
              }
            }
          })
        })
      }

      // Check your answers
      else if (header !== null && header.innerText.indexOf('Check your answers') !== -1) {
        const $btnCheckAnswers = $('.govuk-button')
        $btnCheckAnswers.on('click', () => {
          if (typeof gtag === typeof Function) {
            gtag('event', 'Profile created', {
              event_category: 'button click',
              event_label: $btnCheckAnswers[0].innerText,
            })
          }
        })
      }
    })
  } catch {}
})

$(() => {
  // Track filter status
  const $cohortHeaders = document.querySelectorAll('h1')

  try {
    $cohortHeaders.forEach(header => {
      if (header !== null && header.innerText.startsWith('Get someone ready to work')) {
        let selectedStatus = ''
        let $searchTerm = ''
        let eventName = ''
        const $radiosSelectionStatus = document.querySelectorAll('.govuk-radios__item')
        $radiosSelectionStatus.forEach(rad => {
          if (rad.firstElementChild.checked) {
            selectedStatus = rad.innerText
          }
        })

        eventName = `Filter by ${selectedStatus}`
        const $btnSearch = $('#searchButton')

        $btnSearch.on('click', () => {
          // const searchText = document.querySelector('#searchTerm')
          $searchTerm = $('#searchTerm')[0].value
          if (selectedStatus && $searchTerm) {
            eventName = `Filter - ${selectedStatus} and name`
          }

          if (typeof gtag === typeof Function) {
            gtag('event', eventName, {
              event_category: 'radio selection',
              event_label: `${selectedStatus} - ${$searchTerm}`,
            })
          }
        })

        if (typeof gtag === typeof Function) {
          gtag('event', eventName, {
            event_category: 'radio selection',
            event_label: selectedStatus,
          })
        }
      }
    })
  } catch {}
})

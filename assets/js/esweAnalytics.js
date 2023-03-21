$(() => {
  const $statusOptions = document.querySelectorAll('.govuk-radios__item')

  // Track change work status event
  const $btnStatusChange = document.querySelectorAll('.govuk-button')
  $btnStatusChange.forEach(btn => {
    if (btn.innerText === 'Update status') {
      const $radios = document.querySelectorAll('.govuk-radios__item')
      $radios.forEach(rad => {
        if (rad.firstElementChild.checked) {
          if (typeof gtag === typeof Function) {
            gtag('event', 'eswe-workStatus-change_event', {
              category: 'Change work status',
              action: rad.innerText,
            })
          }
        }
      })
    }
  })

  // Track ID changes
  const $id = document.querySelectorAll('.govuk-heading-l')
  let progressStatus
  let typeOfIdInPlace
  if ($id[0].innerText === 'ID') {
    const $radios = document.querySelectorAll('.govuk-radios__item')
    $radios.forEach(rad => {
      if (rad.firstElementChild.checked) {
        progressStatus = rad.innerText
      }
    })

    const $chks = document.querySelectorAll('.govuk-checkboxes__input')
    $chks.forEach(chk => {
      if (chk.checked) {
        typeOfIdInPlace = chk.defaultValue
      }
    })

    if (progressStatus || typeOfIdInPlace) {
      if (typeof gtag === typeof Function) {
        gtag('event', 'eswe-id-change_event', {
          category: 'ID progress status',
          progress: progressStatus,
          idInPlace: typeOfIdInPlace,
        })
      }
    }
  }

  // Track status filter in cohort list
  $statusOptions.forEach(statusSelected => {
    if (statusSelected.firstElementChild.checked) {
      if (typeof gtag === typeof Function) {
        gtag('event', 'eswe-cohortList-status-filter', {
          category: 'Cohort list',
          action: statusSelected.innerText,
        })
      }
    }
  })
})

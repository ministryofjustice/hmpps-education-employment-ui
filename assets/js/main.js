function cohortListFilterChange() {
  $('input[type="radio"][name="selectStatus"]').on('change', function (e) {
    document.location.href = '/wr/cohort-list?status=' + e.target.value
  })
}
function enablePrintLink() {
  $('#printLink').on('click', function (e) {
    window.print()
  })
}

cohortListFilterChange()
enablePrintLink()

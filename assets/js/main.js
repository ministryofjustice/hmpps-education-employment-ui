function cohortListFilterChange() {
  $('input[type="radio"][name="selectStatus"]').on('change', function (e) {
    document.location.href = '/?status=' + e.target.value
  })
}
cohortListFilterChange()

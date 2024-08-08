/*
Rules taken from: https://github.com/ministryofjustice/manage-hmpps-auth-accounts/blob/main/backend/services/paginationService.js

The pagination service only shows ten page links regardless of where the current page is pointed.
Rules:
  1) Show ten page links
  2) Show pages 5 before and after the current page
  3) Where there are less than 5 pages before the current page show the remaining
  4) Where there are more than 5 pages after the current page show the remaining
1 2 3 4 5 6 7 8 9 10
^
1 2 3 4 5 6 7 8 9 10
          ^
2 3 4 5 6 7 8 9 10 11
          ^
4 5 6 7 8 9 10 11 12 13
          ^
2 3 4 5 6 7 8 9 10 11
          ^
4 5 6 7 8 9 10 11 13 14
          ^
4 5 6 7 8 9 10 11 13 14
            ^
4 5 6 7 8 9 10 11 13 14
                ^
 */

import PagedResponse from '../data/domain/types/pagedResponse'
import PagedResponseNew from '../data/domain/types/pagedResponseNew'
import config from '../config'

interface PaginationLink {
  text: string
  href: string
  selected?: boolean
}

interface MojPaginationObject {
  results: {
    from: number
    to: number
    count: number
  }
  previous: PaginationLink
  next: PaginationLink
  items: [PaginationLink]
}

export default class PaginationService {
  constructor(private readonly paginationPageSize: number = config.paginationPageSize) {}

  public getPagination<T>(pageData: PagedResponse<T>, url: URL): MojPaginationObject {
    const urlForPage = (n: number) => {
      url.searchParams.set('page', String(n))
      return url.href
    }

    const previousPage = pageData.pageable.pageNumber <= 0 ? null : pageData.pageable.pageNumber
    const zeroBasedPage = pageData.pageable.pageNumber
    const resultsBeforeNow = zeroBasedPage * this.paginationPageSize

    // check there are more elements than the configured page size before displaying the "next" link
    const nextPage =
      resultsBeforeNow + this.paginationPageSize >= pageData.totalElements ? null : pageData.pageable.pageNumber + 2

    // calculate the range of 10 items to display in pagination
    const maxPageNumber =
      pageData.pageable.pageNumber < 6 ? 10 : Math.min(pageData.totalPages, pageData.pageable.pageNumber + 5)

    const minPageNumber =
      pageData.pageable.pageNumber < 6 ? 0 : Math.min(maxPageNumber - 10, pageData.pageable.pageNumber - 5)

    const items = [...Array(pageData.totalPages).keys()]
      .filter(n => n >= minPageNumber)
      .filter(n => n < maxPageNumber)
      .map(n => ({
        text: n + 1,
        href: urlForPage(n + 1),
        selected: n === pageData.pageable.pageNumber,
      })) as Array<unknown>
    return <MojPaginationObject>{
      results: {
        from: pageData.pageable.offset + 1,
        to: pageData.pageable.offset + pageData.numberOfElements,
        count: pageData.totalElements,
      },
      previous: previousPage && {
        text: 'Previous',
        href: urlForPage(previousPage),
      },
      next: nextPage && {
        text: 'Next',
        href: urlForPage(nextPage),
      },
      items,
    }
  }

  public getPaginationNew<T>(pageData: PagedResponseNew<T>, url: URL): MojPaginationObject {
    const urlForPage = (n: number) => {
      url.searchParams.set('page', String(n))
      return url.href
    }

    const previousPage = pageData.page.number <= 0 ? null : pageData.page.number
    const zeroBasedPage = pageData.page.number
    const resultsBeforeNow = zeroBasedPage * this.paginationPageSize

    // check there are more elements than the configured page size before displaying the "next" link
    const nextPage =
      resultsBeforeNow + this.paginationPageSize >= pageData.page.totalElements ? null : pageData.page.number + 2

    // calculate the range of 10 items to display in pagination
    const maxPageNumber = pageData.page.number < 6 ? 10 : Math.min(pageData.page.totalPages, pageData.page.number + 5)

    const minPageNumber = pageData.page.number < 6 ? 0 : Math.min(maxPageNumber - 10, pageData.page.number - 5)

    const items = [...Array(pageData.page.totalPages).keys()]
      .filter(n => n >= minPageNumber)
      .filter(n => n < maxPageNumber)
      .map(n => ({
        text: n + 1,
        href: urlForPage(n + 1),
        selected: n === pageData.page.number,
      })) as Array<unknown>
    return <MojPaginationObject>{
      results: {
        from: pageData.page.size * pageData.page.number + 1,
        to: pageData.page.size * pageData.page.number + pageData.content.length,
        count: pageData.page.totalElements,
      },
      previous: previousPage && {
        text: 'Previous',
        href: urlForPage(previousPage),
      },
      next: nextPage && {
        text: 'Next',
        href: urlForPage(nextPage),
      },
      items,
    }
  }
}

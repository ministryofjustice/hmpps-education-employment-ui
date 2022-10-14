import { Request, Response } from 'express'
import { ParsedQs } from 'qs'

export enum SortOrder {
  ascending = 'ascending',
  descending = 'descending',
  none = 'none',
}

export interface BuildSortUrlParams {
  query: ParsedQs
  sortField: string
  currentUrl: string
  defaultSort: string
  defaultOrder?: SortOrder
}

export const buildSortUrl = ({
  query,
  sortField,
  currentUrl,
  defaultSort,
  defaultOrder,
}: BuildSortUrlParams): string => {
  const { sort = defaultSort, order = defaultOrder || SortOrder.ascending } = query
  // Build new query string
  const newOrder = order === SortOrder.ascending ? SortOrder.descending : SortOrder.ascending
  const queryStringItems = {
    ...query,
    sort: sort !== sortField ? sortField : sort,
    order: sort !== sortField ? SortOrder.descending : newOrder,
  }
  // Build new url
  let redirectUrl = currentUrl.split('?')[0]
  Object.keys(queryStringItems).forEach((key, index) => {
    redirectUrl = !index
      ? `${redirectUrl}?${key}=${queryStringItems[key]}`
      : `${redirectUrl}&${key}=${queryStringItems[key]}`
  })
  // console.log(`redirectUrl: ${redirectUrl}`)
  return redirectUrl
}

export const handleSortMiddleware =
  (formFieldName: string, defaultSort: string, defaultOrder?: SortOrder) =>
  // eslint-disable-next-line @typescript-eslint/ban-types
  (req: Request, res: Response, next: Function): void => {
    // console.log(`req.body: ${req.body}`)
    if (req.body[formFieldName]) {
      res.redirect(
        buildSortUrl({
          query: req.query,
          sortField: req.body[formFieldName],
          currentUrl: req.originalUrl,
          defaultSort,
          defaultOrder,
        }),
      )
      return
    }
    next()
  }

import { NextFunction, Request, Response } from 'express'
import type { ParsedQs } from 'qs'

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
    order: sort !== sortField ? SortOrder.ascending : newOrder,
  }
  // Build new url
  let redirectUrl = currentUrl.split('?')[0]
  Object.keys(queryStringItems).forEach((key, index) => {
    redirectUrl = !index
      ? `${redirectUrl}?${key}=${queryStringItems[key]}`
      : `${redirectUrl}&${key}=${queryStringItems[key]}`
  })
  return redirectUrl
}
export const handleSortMiddleware =
  (formFieldName: string, defaultSort: string, defaultOrder?: SortOrder) =>
  (req: Request, res: Response, next: NextFunction): void => {
    console.log('MIDDLEWARE redirect')
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

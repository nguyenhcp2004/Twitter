import { Pagination } from './Tweet.requests'

export interface SearchQuey extends Pagination {
  content: string
}

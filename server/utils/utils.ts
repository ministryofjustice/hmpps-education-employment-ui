import { parse, parseISO } from 'date-fns'
import { TransformFnParams } from 'class-transformer'

function properCase(word: string): string {
  return word.length >= 1 ? word[0].toUpperCase() + word.toLowerCase().slice(1) : word
}

function isBlank(str: string): boolean {
  return !str || /^\s*$/.test(str)
}

/**
 * Converts a name (first name, last name, middle name, etc.) to proper case equivalent, handling double-barreled names
 * correctly (i.e. each part in a double-barreled is converted to proper case).
 * @param name name to be converted.
 * @returns name converted to proper case.
 */
function properCaseName(name: string): string {
  return isBlank(name) ? '' : name.split('-').map(properCase).join('-')
}

export function convertToTitleCase(sentence: string): string {
  return isBlank(sentence) ? '' : sentence.split(' ').map(properCaseName).join(' ')
}

const slashSeparatedDatePattern = /^\d{2}\/\d{2}\/\d{4}$/

/**
 * Parses a date in either ISO format (e.g. 2020-01-30T01:01:01.123Z)
 * or as a slash separated date (e.g. 30/01/2020) assuming UTC to avoid
 * dates drifting when parsing a BST date.
 * @param val date to be parsed.
 * @returns parsed date.
 */
export function parseUTCDate(val: string): Date {
  if (RegExp(slashSeparatedDatePattern).test(val)) return parse(`${val} Z`, 'dd/MM/yyyy X', new Date())
  return val ? parseISO(val) : undefined
}

export function transformUTCDate(params: TransformFnParams): Date {
  return parseUTCDate(params.value)
}

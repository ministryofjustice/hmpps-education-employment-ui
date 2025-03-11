import * as crypto from 'crypto'

/**
 * Generate a consistent hash from a given string
 * @param input - The input string to hash
 * @returns The hashed value as a hexadecimal string
 */
export default function generateHash(input: string): string {
  return crypto.createHash('sha256').update(input).digest('hex')
}

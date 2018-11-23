export function kabobify(str: string): string {
  return str.replace(/\W/gi, '-').toLocaleLowerCase();
}

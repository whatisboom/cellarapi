declare module 'rand-token' {
  export function uid(size: number): string;
  export function suid(
    size: number,
    epoch?: number,
    prefixLength?: number
  ): string;
  export function generate(size: number, chars?: string[]): string;
  export function generator(options: any): Function;
}

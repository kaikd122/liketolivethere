export function pluralise(args: {
  count: number;
  singular: string;
  plural: string;
}): string {
  return args.count === 1 ? args.singular : args.plural;
}

export function onlyUnique(value: any, index: number, self: any[]) {
  return self.indexOf(value) === index;
}

import {
  uniqueNamesGenerator,
  adjectives,
  animals,
  Config,
  NumberDictionary,
} from "unique-names-generator";

export default function generateUsername(): string {
  const numberDictionary = NumberDictionary.generate({ min: 1, max: 9999 });
  const config: Config = {
    dictionaries: [adjectives, animals, numberDictionary],
    style: "capital",
    separator: "",
  };
  return uniqueNamesGenerator(config);
}

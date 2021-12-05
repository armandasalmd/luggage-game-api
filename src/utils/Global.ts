export const isEmpty = (object: any): boolean => {
  return (
    object === undefined ||
    object === null ||
    object === 0 ||
    object === "" ||
    (typeof object === "object" && Object.keys(object).length === 0)
  );
};

export const getEmptyPropertyKeys = (obj: object, allowEmptyString?: boolean): string[] => {
  const keys: string[] = [];

  for (const prop in obj) {
    if (isEmpty(obj[prop])) {
      if (allowEmptyString && typeof obj[prop] === "string") {
        continue;
      }

      keys.push(prop);
    }
  }

  return keys;
};

export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function getEmptyErrors(obj: object): object {
  const emptyProps = getEmptyPropertyKeys(obj);

  if (emptyProps.length > 0) {
    const resultBody = {
      errors: {}
    };

    for (const prop of emptyProps) {
      resultBody.errors[prop] = `${capitalize(prop)} is required`;
    }

    return resultBody;
  } else {
    return null;
  }
}
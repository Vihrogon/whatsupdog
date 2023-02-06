/**
 * JSOS (JavaScript Object Schema)
 *
 * Validate js objects against js objects
 */

import {
  assert,
  assertEquals,
  assertFalse,
  assertThrows,
} from "https://deno.land/std@0.172.0/testing/asserts.ts";

type Data = { [key: string]: unknown };

interface Result {
  ok: boolean;
  data: Data;
}

interface Property {
  message: string;
  type: "object" | "boolean" | "string" | "number" | null;
}

interface ObjectProperty extends Property {
  type: "object";
  match: JSOS | null;
}

interface BooleanProperty extends Property {
  type: "boolean";
  match: boolean | null;
}

interface StringProperty extends Property {
  type: "string";
  match: [string | null, string | null] | null;
}

interface NumberProperty extends Property {
  type: "number";
  match: [number | null, number | null] | null;
}

interface NullProperty extends Property {
  type: null;
  match: null;
}

type JSOSProperty =
  | ObjectProperty
  | BooleanProperty
  | StringProperty
  | NumberProperty
  | NullProperty;

/**
 * JavaScript Object Schema
 */
export interface JSOS {
  [key: string]: JSOSProperty;
}

/**
 * TODO
 * @param schema
 * @returns {boolean}
 */
function isValidSchema(schema: JSOS) {
  if (
    schema === null || typeof schema !== "object" || !Object.keys(schema).length
  ) return false;
  for (const key in schema) {
    if (
      schema[key] === null ||
      typeof schema[key] !== "object" ||
      Object.keys(schema[key]).length !== 3 ||
      !("message" in schema[key]) ||
      typeof schema[key].message !== "string" ||
      !("type" in schema[key]) ||
      typeof schema[key].type !== "string" ||
      !("match" in schema[key])
    ) return false;
    switch (schema[key].type) {
      case "object": {
        const node = schema[key] as ObjectProperty;
        if (node.match === null) break;
        if (
          typeof node.match === "object" &&
          !isValidSchema(node.match)
        ) return false;
        break;
      }
      case "boolean":
        if (schema[key].match === null) break;
        if (typeof schema[key].match !== "boolean") return false;
        break;
      case "string": {
        const node = schema[key] as StringProperty;
        if (node.match === null) break;
        if (
          !Array.isArray(node.match) ||
          node.match.length !== 2
        ) return false;
        if (node.match[0] === null) break;
        if (
          typeof node.match[0] === "string" &&
          (typeof node.match[1] === null || typeof node.match[1] === "string")
        ) {
          try {
            RegExp(node.match[0], node.match[1] || "");
          } catch (_error) {
            return false;
          }
        }
        break;
      }
      case "number": {
        const node = schema[key] as NumberProperty;
        if (node.match === null) break;
        if (
          !Array.isArray(node.match) ||
          node.match.length !== 2 ||
          (node.match[0] !== null &&
            typeof node.match[0] !== "number") ||
          (node.match[1] !== null &&
            typeof node.match[1] !== "number")
        ) return false;
        if (
          typeof node.match[0] === "number" &&
          typeof node.match[1] === "number" &&
          node.match[0] > node.match[1]
        ) return false;
        break;
      }
      case null:
        if (schema[key].match !== null) return false;
        break;
      default:
        return false;
    }
  }
  return true;
}

/**
 * Checks the validity of data against a js object schema
 * **Can throw** if supplied with invalid parameters!
 * There are some limitations:
 * - all keys must be unique
 * ---
 * @example
 * TODO
 */
export function validation(
  data: Data,
  schema: JSOS,
  result: Result = { ok: false, data: {} },
): Result {
  // TODO cosider fast vs constant time
  if (
    data === null || typeof data !== "object" ||
    schema === null || typeof schema !== "object" ||
    !isValidSchema(schema) ||
    result === null || typeof result !== "object"
  ) {
    throw new Error("Invalid paramaters");
  }

  for (const key in schema) {
    result.data[key] = schema[key].message;

    switch (schema[key].type) {
      case "object": {
        const node = schema[key] as ObjectProperty;
        if (!(key in data)) break;
        if (node.type !== null && typeof data[key] !== "object") break;
        if (
          node.match !== null &&
          Object.keys(node.match).length !==
            Object.keys(data[key] as Data).length
        ) {
          break;
        }

        delete result.data[key];

        if (node.match !== null) {
          const recursive = validation(data[key] as Data, node.match, result);
          // TODO consider nesting errors
          result.data = recursive.data;
        }

        break;
      }

      case "boolean": {
        const node = schema[key] as BooleanProperty;
        if (!(key in data)) break;
        if (node.type !== null && typeof data[key] !== "boolean") break;
        if (node.match !== null && node.match !== data[key]) {
          break;
        }

        delete result.data[key];

        break;
      }

      case "string": {
        const node = schema[key] as StringProperty;
        const prop = data[key] as string;
        if (!(key in data)) break;
        if (node.type !== null && typeof prop !== "string") break;
        if (
          node.match !== null &&
          node.match[0] !== null &&
          node.match[1] !== null &&
          typeof prop === "string" &&
          !RegExp(node.match[0], node.match[1]).test(prop)
        ) {
          break;
        }

        delete result.data[key];

        break;
      }

      case "number": {
        const node = schema[key] as NumberProperty;
        const prop = data[key] as number;
        if (!(key in data)) break;
        if (node.type !== null && typeof prop !== "number") break;

        if (
          node.match !== null &&
          node.match[0] !== null &&
          (typeof prop === "number" && node.match[0] > prop)
        ) {
          break;
        }
        if (
          node.match !== null &&
          node.match[1] !== null &&
          node.match[1] < prop
        ) {
          break;
        }

        delete result.data[key];

        break;
      }

      case null: {
        if (key in data) delete result.data[key];

        break;
      }

      default:
        break;
    }
  }

  if (!Object.keys(result.data).length) result.ok = true;

  return result;
}

const mockedObjectProperty: ObjectProperty = {
  message: "Object error",
  type: "object",
  match: {},
};
const mockedBooleanProperty: BooleanProperty = {
  message: "Boolean error",
  type: "boolean",
  match: true,
};
const mockedStringProperty: StringProperty = {
  message: "String error",
  type: "string",
  match: ["^test$", "i"],
};
const mockedNumberProperty: NumberProperty = {
  message: "Number error",
  type: "number",
  match: [0, 0],
};
const success = { ok: true, data: {} };

// TODO add better tests for isValidSchema()
Deno.test("isValidSchema() should return false with invalid schema", () => {
  // @ts-expect-error: must check for js compatibility
  assertFalse(isValidSchema(undefined));
  // @ts-expect-error: must check for js
  assertFalse(isValidSchema(null));
  assertFalse(isValidSchema({}));
  // @ts-expect-error: must check for js
  assertFalse(isValidSchema({ test: undefined }));
  // @ts-expect-error: must check for js
  assertFalse(isValidSchema({ test: null }));
  // @ts-expect-error: must check for js
  assertFalse(isValidSchema({ test: {} }));
});

Deno.test("isValidSchema() should return true with valid schema", () => {
  assert(isValidSchema({ boolean: mockedBooleanProperty }));
  assert(isValidSchema({ string: mockedStringProperty }));
  assert(isValidSchema({ number: mockedNumberProperty }));
  const schema = { object: mockedObjectProperty };
  schema.object.match = {};
  schema.object.match.boolean = mockedBooleanProperty;
  assert(isValidSchema(schema));
  schema.object.match.string = mockedStringProperty;
  assert(isValidSchema(schema));
  schema.object.match.number = mockedNumberProperty;
  assert(isValidSchema(schema));
});

// TODO add better tests for validation()
Deno.test("validation() should throws on invalid parameters", () => {
  assertThrows(() => {
    // @ts-expect-error: must check for js compatibility
    validation(undefined, {});
  });
  assertThrows(() => {
    // @ts-expect-error: must check for js compatibility
    validation(null, {});
  });
  assertThrows(() => {
    validation({}, {});
  });
  assertThrows(() => {
    // @ts-expect-error: must check for js compatibility
    validation([], {});
  });
  assertThrows(() => {
    // @ts-expect-error: must check for js compatibility
    validation(true, {});
  });
  assertThrows(() => {
    // @ts-expect-error: must check for js compatibility
    validation("test", {});
  });
  assertThrows(() => {
    // @ts-expect-error: must check for js compatibility
    validation(0, {});
  });
});

Deno.test("validation() should validate with valid parameters", () => {
  assertEquals(
    validation({ boolean: true }, { boolean: mockedBooleanProperty }),
    success,
  );
  assertEquals(
    validation({ string: "test" }, { string: mockedStringProperty }),
    success,
  );
  assertEquals(
    validation({ number: 0 }, { number: mockedNumberProperty }),
    success,
  );
  const schema = { object: mockedObjectProperty };
  schema.object.match = {
    boolean: mockedBooleanProperty,
    string: mockedStringProperty,
    number: mockedNumberProperty,
  };
  assertEquals(
    validation(
      { object: { boolean: true, string: "test", number: 0 } },
      schema,
    ),
    success,
  );
});

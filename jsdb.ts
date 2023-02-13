/**
 * JSDB (JavaScript Data Base )
 *
 * JSON file database with CRUD interface
 */

import {
  assert,
  assertThrows,
} from "https://deno.land/std@0.172.0/testing/asserts.ts";

type Data = { [key: string]: unknown };

interface Result {
  ok: boolean;
  data: Data;
}

/**
 * Creates a new file at the specified path and stringifies and writes the data to it
 */
export function create(path: string, data: Data): Result {
  if (
    typeof path !== "string" || !path.length ||
    typeof data !== "object" || !Object.keys(data).length
  ) {
    throw new Error("Invalid paramaters");
  }

  try {
    Deno.writeTextFileSync(
      `${Deno.env.get("DB")}/${path}.json`,
      JSON.stringify(data),
      { create: true },
    );
    return { ok: true, data };
  } catch (error) {
    return { ok: false, data: { error } };
  }
}

/**
 * Reads a file at the specified path and parses its contents
 */
export function read(path: string): Result {
  if (typeof path !== "string" || !path.length) {
    throw new Error("Invalid paramaters");
  }

  try {
    const data = Deno.readTextFileSync(`${Deno.env.get("DB")}/${path}.json`);
    const result = JSON.parse(data);
    return { ok: true, data: result };
  } catch (error) {
    return { ok: false, data: { error } };
  }
}

/**
 * Updates an existing file with the data
 */
export function update(path: string, data: Data): Result {
  if (
    typeof path !== "string" || !path.length ||
    typeof data !== "object" || !Object.keys(data).length
  ) {
    throw new Error("Invalid paramaters");
  }

  try {
    const file = read(path);
    if (!file.ok) {
      return { ok: false, data: { error: "no such file" } };
    }
    for (const key in data) {
      if (!(key in file.data)) {
        return { ok: false, data: { error: "invalid data" } };
      }
      file.data[key] = data[key];
    }
    return create(path, file.data);
  } catch (error) {
    return { ok: false, data: { error } };
  }
}

/**
 * Removes a file from the specified path
 */
export function remove(path: string): Result {
  if (
    typeof path !== "string" || !path.length
  ) {
    throw new Error("Invalid paramaters");
  }

  try {
    Deno.removeSync(`${Deno.env.get("DB")}/${path}.json`);
    return { ok: true, data: {} };
  } catch (error) {
    return { ok: false, data: { error } };
  }
}

// TODO better tests
const mockTypes = [
  undefined,
  null,
  false,
  0,
  "",
  {},
  [],
  new RegExp("test"),
  Symbol("test"),
];

const mockData = {
  email: "asd@asd.asd",
  password: "asdF123$",
  name: "asd",
  agreement: 1,
  confirmed: 0,
  authorization: "user",
  created: Date.now(),
  edited: Date.now(),
};

Deno.test("create(), read(), update() and remove() should throw with invalid parameters", () => {
  for (const type of mockTypes) {
    assertThrows(() => {
      // @ts-expect-error: must check that it throws
      create(type);
      // @ts-expect-error: must check that it throws
      read(type);
      // @ts-expect-error: must check that it throws
      update(type);
      // @ts-expect-error: must check that it throws
      remove(type);
      // @ts-expect-error: must check that it throws
      create(type, type);
      // @ts-expect-error: must check that it throws
      read(type, type);
      // @ts-expect-error: must check that it throws
      update(type, type);
      // @ts-expect-error: must check that it throws
      remove(type, type);
      // @ts-expect-error: must check that it throws
      create(type, type, type);
      // @ts-expect-error: must check that it throws
      read(type, type, type);
      // @ts-expect-error: must check that it throws
      update(type, type, type);
      // @ts-expect-error: must check that it throws
      remove(type, type, type);
    });
  }
});

Deno.test("create(), read(), update() and remove() should work with valid parameters", () => {
  Deno.env.set("DB", "./dev/.database");
  const created = create("test/test", mockData);
  assert(created.ok);
  const readed = read("test/test");
  assert(readed.ok);
  const updated = update("test/test", mockData);
  assert(updated.ok);
  const removed = remove("test/test");
  assert(removed.ok);
});

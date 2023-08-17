/**
 * JSTT ( JavaScript Tagged Template )
 *
 * Server Side Rendering ( SSR ) for HTML from tagged templates
 */

import {
  assert,
  equal,
} from "https://deno.land/std@0.172.0/testing/asserts.ts";

/**
 * JS Tagget Templates engine to parse strings into HTML
 * 
 * TODO example
 */
export function html(
  strings: TemplateStringsArray,
  ...values: unknown[]
): string {
  let result = strings[0];

  for (const [index, value] of values.entries()) {
    const stringValue = Array.isArray(value) ? value.join("") : String(value);
    result += stringValue + strings[index + 1];
  }

  return result;
}

Deno.test("html function returns a string", () => {
  const result = html`<div>test</div>`;
  assert(typeof result === "string");
});

Deno.test("html function interpolates values correctly", () => {
  const string = "test";
  const number = 0;
  const result = html`<div>${string} test ${number}</div>`;
  const expected = "<div>test test 0</div>";
  equal(result, expected);
});

Deno.test("html function handles arrays correctly", () => {
  const items = ["test1", "test2", "test3"];
  const result = html`<ul>${items.map((item) => html`<li>${item}</li>`)}</ul>`;
  const expected = "<ul><li>test1</li><li>test2</li><li>test3</li></ul>";
  equal(result, expected);
});

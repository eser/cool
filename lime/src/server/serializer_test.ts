// Copyright 2023 the cool authors. All rights reserved. MIT license.

import { serialize } from "./serializer.ts";
import { assert, assertEquals, assertSnapshot } from "../../tests/deps.ts";
import { deserialize, KEY } from "../runtime/deserializer.ts";
import { signal } from "@preact/signals-core";

Deno.test("serializer - primitives & plain objects", async (t) => {
  const data = {
    a: 1,
    b: "2",
    c: true,
    d: null,
    f: [1, 2, 3],
    g: { a: 1, b: 2, c: 3 },
  };
  const res = serialize(data);
  assert(!res.requiresDeserializer);
  assert(!res.hasSignals);
  await assertSnapshot(t, res.serialized);
  const deserialized = deserialize(res.serialized);
  assertEquals(deserialized, data);
});

Deno.test("serializer - bigint", async (t) => {
  const data = { a: 999999999999999999n };
  const res = serialize(data);
  assert(res.requiresDeserializer);
  assert(!res.hasSignals);
  await assertSnapshot(t, res.serialized);
  const deserialized = deserialize(res.serialized);
  assertEquals(deserialized, data);
});

Deno.test("serializer - Uint8Array", async (t) => {
  const data = { a: new Uint8Array([1, 2, 3]) };
  const res = serialize(data);
  assert(res.requiresDeserializer);
  assert(!res.hasSignals);
  await assertSnapshot(t, res.serialized);
  const deserialized = deserialize(res.serialized);
  assertEquals(deserialized, data);
});

Deno.test("serializer - signals", async (t) => {
  const data = {
    a: 1,
    b: signal(2),
  };
  const res = serialize(data);
  assert(res.requiresDeserializer);
  assert(res.hasSignals);
  await assertSnapshot(t, res.serialized);
  // deno-lint-ignore no-explicit-any
  const deserialized: any = deserialize(res.serialized, signal);
  assertEquals(typeof deserialized, "object");
  assertEquals(deserialized.a, 1);
  assertEquals(deserialized.b.value, 2);
  assertEquals(deserialized.b.peek(), 2);
});

Deno.test("serializer - multiple versions of @preact/signals-core", async (t) => {
  const data = {
    a: 1,
    b: signal(2),
  };
  const res = serialize(data);
  assert(res.requiresDeserializer);
  assert(res.hasSignals);
  await assertSnapshot(t, res.serialized);
  // deno-lint-ignore no-explicit-any
  const deserialized: any = deserialize(res.serialized, signal);
  assertEquals(typeof deserialized, "object");
  assertEquals(deserialized.a, 1);
  assertEquals(deserialized.b.value, 2);
  assertEquals(deserialized.b.peek(), 2);
});

Deno.test("serializer - magic key", async (t) => {
  const data = { [KEY]: "f", a: 1 };
  const res = serialize(data);
  assert(res.requiresDeserializer);
  assert(!res.hasSignals);
  await assertSnapshot(t, res.serialized);
  const deserialized = deserialize(res.serialized);
  assertEquals(deserialized, data);
});

Deno.test("serializer - circular reference objects", async (t) => {
  // deno-lint-ignore no-explicit-any
  const data: any = { a: 1 };
  data.b = data;
  const res = serialize(data);
  assert(res.requiresDeserializer);
  assert(!res.hasSignals);
  await assertSnapshot(t, res.serialized);
  const deserialized = deserialize(res.serialized);
  assertEquals(deserialized, data);
});

Deno.test("serializer - circular reference nested objects", async (t) => {
  // deno-lint-ignore no-explicit-any
  const data: any = { a: 1, b: { c: 2 } };
  data.b.d = data;
  const res = serialize(data);
  assert(res.requiresDeserializer);
  assert(!res.hasSignals);
  await assertSnapshot(t, res.serialized);
  const deserialized = deserialize(res.serialized);
  assertEquals(deserialized, data);
});

Deno.test("serializer - circular reference array", async (t) => {
  // deno-lint-ignore no-explicit-any
  const data: any = [1, 2, 3];
  data.push(data);
  const res = serialize(data);
  assert(res.requiresDeserializer);
  assert(!res.hasSignals);
  await assertSnapshot(t, res.serialized);
  // deno-lint-ignore no-explicit-any
  const deserialized: any = deserialize(res.serialized);
  assertEquals(deserialized, data);
  assertEquals(deserialized.length, 4);
});

Deno.test("serializer - multiple reference", async (t) => {
  // deno-lint-ignore no-explicit-any
  const data: any = { a: 1, b: { c: 2 } };
  data.d = data.b;
  const res = serialize(data);
  assert(res.requiresDeserializer);
  assert(!res.hasSignals);
  await assertSnapshot(t, res.serialized);
  const deserialized = deserialize(res.serialized);
  assertEquals(deserialized, data);
});

Deno.test("serializer - multiple reference signals", async (t) => {
  // deno-lint-ignore no-explicit-any
  const inner: any = { [KEY]: "x", x: 1 };
  inner.y = inner;
  const s = signal(inner);
  const data = { inner, a: s, b: { c: s } };
  const res = serialize(data);
  assert(res.requiresDeserializer);
  assert(res.hasSignals);
  await assertSnapshot(t, res.serialized);
  // deno-lint-ignore no-explicit-any
  const deserialized: any = deserialize(res.serialized, signal);
  assertEquals(deserialized.a.value, inner);
  assertEquals(deserialized.a.peek(), inner);
  assertEquals(deserialized.b.c.value, inner);
  assertEquals(deserialized.b.c.peek(), inner);
  deserialized.a.value = 2;
  assertEquals(deserialized.a.value, 2);
  assertEquals(deserialized.b.c.value, 2);
});

Deno.test("serializer - multiple reference in magic key", async (t) => {
  const inner = { foo: "bar" };
  // deno-lint-ignore no-explicit-any
  const literal: any = { [KEY]: "x", inner };
  const data = { literal, inner };
  const res = serialize(data);
  assert(res.requiresDeserializer);
  assert(!res.hasSignals);
  await assertSnapshot(t, res.serialized);
  // deno-lint-ignore no-explicit-any
  const deserialized: any = deserialize(res.serialized);
  assertEquals(deserialized, data);
});

Deno.test("serializer - multiple reference in signal", async (t) => {
  const inner = { foo: "bar" };
  const s = signal(inner);
  const data = { s, inner };
  const res = serialize(data);
  assert(res.requiresDeserializer);
  assert(res.hasSignals);
  await assertSnapshot(t, res.serialized);
  // deno-lint-ignore no-explicit-any
  const deserialized: any = deserialize(res.serialized, signal);
  assertEquals(deserialized.s.value, inner);
  assertEquals(deserialized.s.peek(), inner);
  assertEquals(deserialized.inner, inner);
});

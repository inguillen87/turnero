import { test } from 'node:test';
import assert from 'node:assert';
import { menu, helpLine } from './stateMachine.ts';

test('menu - returns correct menu with default app name', () => {
  const result = menu();
  assert.ok(result.includes('Turnero Pro'), 'Should contain default app name');
  assert.ok(result.includes('1) 📅 Reservar turno'));
  assert.ok(result.includes('2) 💰 Ver precios'));
  assert.ok(result.includes('3) 🔁 Cancelar'));
  assert.ok(result.includes('4) 👤 Mis turnos'));
  assert.ok(result.includes('5) 🧑‍💼 Hablar con humano'));
  assert.ok(result.includes('9) 📌 Menú'));
});

test('menu - returns correct menu with custom app name', () => {
  const customName = 'Mi Clinica';
  const result = menu(customName);
  assert.ok(result.includes(customName), 'Should contain custom app name');
  assert.ok(result.includes('1) 📅 Reservar turno'));
});

test('helpLine - returns correct help line', () => {
  const result = helpLine();
  assert.strictEqual(result, 'Tip: "9" menú, "0" volver.');
});

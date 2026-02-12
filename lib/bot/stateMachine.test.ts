import { test } from 'node:test';
import assert from 'node:assert';
import { menu, helpLine, handleMessage } from './stateMachine.ts';
import type { Session, BookingState } from './stateMachine.ts';

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

test('handleMessage - includes helpLine in responses', async () => {
    const session: Session = {
        state: 'HOME',
        updatedAt: Date.now(),
        history: []
    };

    // Test: 1 (Choose Service)
    const { reply: reply1, session: session1 } = await handleMessage("1", session);
    assert.ok(reply1.includes(helpLine()), 'Reply for "1" should include helpLine');
    assert.strictEqual(session1.state, 'CHOOSE_SERVICE', 'Session state should be CHOOSE_SERVICE');

    // Reset Session
    session.state = 'HOME';

    // Test: 2 (Precios)
    const { reply: reply2, session: session2 } = await handleMessage("2", session);
    assert.ok(reply2.includes(helpLine()), 'Reply for "2" should include helpLine');
    assert.strictEqual(session2.state, 'HOME', 'Session state should remain HOME');
});

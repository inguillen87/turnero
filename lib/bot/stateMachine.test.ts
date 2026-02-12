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

test('handleMessage - masks personal info in CANCEL_FLOW', async () => {
  const session: Session = {
      state: 'CANCEL_FLOW',
      updatedAt: Date.now(),
      history: []
  };

  // Case 1: Long input (DNI/Phone)
  const sensitiveInput = '11223344';
  const { reply: reply1, session: session1 } = await handleMessage(sensitiveInput, session);

  // Expect masking: "11****44"
  assert.ok(reply1.includes('11****44'), 'Reply should mask the input body');
  assert.ok(!reply1.includes('2233'), 'Reply should not contain the middle part of the sensitive input');
  assert.strictEqual(session1.state, 'HOME', 'Session state should return to HOME');

  // Case 2: Short input
  session.state = 'CANCEL_FLOW'; // Reset state
  const shortInput = '123';
  const { reply: reply2 } = await handleMessage(shortInput, session);

  // Expect full masking: "****"
  assert.ok(reply2.includes('****'), 'Reply should fully mask short input');
  assert.ok(!reply2.includes('123'), 'Reply should not contain the short input');
});

test('handleMessage - masks personal info in MY_APPTS', async () => {
  const session: Session = {
      state: 'MY_APPTS',
      updatedAt: Date.now(),
      history: []
  };

  const sensitiveInput = '99887766';
  const { reply, session: nextSession } = await handleMessage(sensitiveInput, session);

  // Expect masking: "99****66"
  assert.ok(reply.includes('99****66'), 'Reply should mask the input body in MY_APPTS');
  assert.ok(!reply.includes('8877'), 'Reply should not contain the middle part of the sensitive input');
  assert.strictEqual(nextSession.state, 'HOME', 'Session state should return to HOME');
});

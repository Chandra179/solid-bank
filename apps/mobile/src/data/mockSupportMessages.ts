export type SupportMessage = { id: string; body: string; sentAt: number };

// Standing in for a real support/ticketing backend. Unlike a live-chat
// widget (which needs an actual agent on the other end, and was
// deliberately left as a ComingSoon gap rather than faked), "send us a
// message and we'll get back to you" is something a mock layer can make
// genuinely real: the message really is captured, just not delivered
// anywhere outside this in-memory array.
let MESSAGES: SupportMessage[] = [];

export function submitSupportMessage(body: string): SupportMessage {
  const message: SupportMessage = { id: `msg_${MESSAGES.length + 1}`, body, sentAt: Date.now() };
  MESSAGES = [...MESSAGES, message];
  return message;
}
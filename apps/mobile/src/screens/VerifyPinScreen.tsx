import React, { useRef, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/navigation/types";

import { colors } from "../theme/colors";
import { IconChevronLeft } from "../components/icons";
import NumericKeypad from "../components/NumericKeypad";
import DigitEntry from "../components/DigitEntry";
import { useSessionStore } from "../store/session";
import { getPocket, adjustPocketBalance, adjustAccountBalance, recordTransaction } from "@/data";

const PIN_LENGTH = 6;

type Props = NativeStackScreenProps<RootStackParamList, "VerifyPin">;

// The step-up check ConfirmScreen was missing: money doesn't actually move
// until the PIN created during onboarding (SetPinScreen/ConfirmPinScreen)
// is re-entered here. Reuses the same DigitEntry + NumericKeypad pattern
// as PIN creation and OTP entry, so every security-sensitive input in the
// app looks and behaves the same way. This screen — not ConfirmScreen — now
// owns the actual submission, since PIN verification is the real last gate
// before money moves, not the review step before it.
export default function VerifyPinScreen({ navigation, route }: Props) {
  const { flow, contextId, contextLabel, amountMinor, feeMinor = 0 } = route.params;
  const storedPin = useSessionStore((s) => s.pin);
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const advancing = useRef(false);

  function submit() {
    setSubmitting(true);
    // Real implementation: POST /api/v1/transfers or /api/v1/topups here,
    // using amountMinor as-is (already integer minor units) and the
    // context's account/pocket/source id as the idempotency-key source —
    // see apps/api/internal/ledger's RecordEntry for the pattern this
    // would feed into. The server is the source of truth even though
    // AmountEntryScreen already checked the balance client-side — the
    // shadow ledger can be stale by the time this submits (see
    // apps/api/internal/reconciliation's whole reason for existing), so a
    // rejection here is a real, expected case, not just defensive coding.
    //
    // DEMO HOOK: since there's no real backend yet, enter exactly
    // "Rp 13.000" as the amount (back on AmountEntryScreen) to preview the
    // failure path — remove this once submit() calls a real endpoint that
    // can fail on its own.
    const shouldSimulateFailure = amountMinor === 1_300_000;

    setTimeout(() => {
      setSubmitting(false);
      if (shouldSimulateFailure) {
        navigation.navigate("MoneyMoveError", {
          reason:
            flow === "transfer"
              ? "The recipient's account couldn't be reached. Your balance hasn't changed."
              : "Your bank declined this top up. Your balance hasn't changed.",
        });
        return;
      }
      // This is the one place a "successful" money move actually touches
      // the mock data layer — previously every flow (including Add Money
      // via PocketDetail) only ever showed a convincing Success/Receipt
      // screen without changing any real balance, and the main account
      // balance/transaction list specifically were never touched by
      // anything (documented as a scope limitation in TODO.md until now).
      // `contextId` doubles as "does this money move target one of my own
      // pockets" — pocket ids (pocket_N) don't collide with
      // beneficiary/merchant/funding-source ids, so a successful
      // getPocket() lookup is enough to disambiguate "transfer to/from my
      // own pocket" (money moves between the pocket and the main balance)
      // from "transfer to an external beneficiary/merchant" or "top up
      // from an external source" (only the main balance moves).
      const targetPocket = contextId ? getPocket(contextId) : undefined;
      const strippedLabel = contextLabel.replace(/^(To|From) /, "");

      if (targetPocket) {
        if (flow === "transfer") {
          // Add Money (PocketDetailScreen / TransferScreen's "Your
          // Pockets" row): main balance -> pocket.
          adjustPocketBalance(targetPocket.id, amountMinor);
          adjustAccountBalance(-amountMinor);
          recordTransaction(`Transfer to ${targetPocket.name}`, -amountMinor, "Savings");
        } else if (flow === "withdraw") {
          // Withdraw: pocket -> main balance.
          adjustPocketBalance(targetPocket.id, -amountMinor);
          adjustAccountBalance(amountMinor);
          recordTransaction(`Withdraw from ${targetPocket.name}`, amountMinor, "Savings");
        }
      } else if (flow === "topup") {
        // External funding source -> main balance. No pocket involved, so
        // nothing but the account balance moves.
        adjustAccountBalance(amountMinor);
        recordTransaction(`Top up from ${strippedLabel}`, amountMinor);
      } else {
        // External beneficiary transfer, or a QRIS merchant pay (QrScanScreen
        // also uses flow: "transfer" — see its own comment on why) — main
        // balance only, no pocket to credit.
        adjustAccountBalance(-amountMinor);
        recordTransaction(strippedLabel, -amountMinor);
      }

      // QRIS pay is the only flow a fee can currently attach to (see
      // utils/fees.ts) — recorded as its own transaction line rather than
      // folded into the purchase amount above, so the transaction list
      // reads like a real statement (purchase, then a separate fee line)
      // instead of a total that silently doesn't match the "Amount"
      // Confirm/Receipt both showed.
      if (feeMinor > 0) {
        adjustAccountBalance(-feeMinor);
        recordTransaction("QRIS fee", -feeMinor, "Fees");
      }

      // Synthetic reference/timestamp standing in for what a real backend
      // response would return (an idempotency/transaction id + server
      // timestamp) — generated here, once, at the moment submission
      // actually succeeds, then carried through Success into Receipt so
      // both screens show the same fixed values rather than recomputing
      // "now" every time either screen renders.
      const reference = `TRX${Date.now().toString(36).toUpperCase()}`;
      navigation.replace("Success", { flow, contextLabel, amountMinor, feeMinor, reference, completedAt: Date.now() });
    }, 400);
  }

  function appendDigit(d: string) {
    if (advancing.current || submitting) return;
    setError(null);
    setPin((prev) => {
      if (prev.length >= PIN_LENGTH) return prev;
      const next = prev + d;
      if (next.length === PIN_LENGTH) {
        advancing.current = true;
        setTimeout(() => {
          if (!storedPin) {
            // Shouldn't be reachable — the auth-gated navigator in
            // App.tsx only lets an onboarded (and therefore PIN-having)
            // user reach this screen. Fails safe rather than silently
            // accepting any PIN if that invariant is ever broken.
            setError("No PIN is set up on this device. Go back and try again.");
            setPin("");
            advancing.current = false;
            return;
          }
          if (next === storedPin) {
            submit();
          } else {
            setError("Incorrect PIN. Try again.");
            setPin("");
            advancing.current = false;
          }
        }, 250);
      }
      return next;
    });
  }
  function backspace() {
    setError(null);
    setPin((prev) => prev.slice(0, -1));
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top", "bottom"]}>
      <View className="px-6 pb-2 pt-5">
        <Pressable
          onPress={() => navigation.goBack()}
          accessibilityLabel="Go back"
          accessibilityRole="button"
          className="h-10 w-10 items-center justify-center rounded-2xl bg-slate-100"
        >
          <IconChevronLeft size={20} color={colors.neutral700} />
        </Pressable>
      </View>

      <View className="px-6 pt-4" style={{ gap: 4 }}>
        <Text className="text-2xl font-semibold text-slate-900">Enter your PIN</Text>
        <Text className="text-body text-slate-500">
          Confirm it's you before this {flow === "transfer" ? "transfer" : flow === "withdraw" ? "withdrawal" : "top up"} goes through.
        </Text>
      </View>

      {/* See onboarding/PhoneEntryScreen for why this is top-anchored
          (fixed pt-12) rather than vertically centered in the leftover
          flex-1 space. */}
      <View className="items-center px-6 pt-12" style={{ gap: 12 }}>
        <DigitEntry length={PIN_LENGTH} value={pin} masked />
        {error ? <Text className="text-body font-medium text-red-600">{error}</Text> : null}
        {submitting ? <Text className="text-body font-medium text-slate-500">Confirming…</Text> : null}
      </View>

      <View className="flex-1" />

      <View className="px-6 pb-4">
        <NumericKeypad onDigit={appendDigit} onBackspace={backspace} />
      </View>
    </SafeAreaView>
  );
}

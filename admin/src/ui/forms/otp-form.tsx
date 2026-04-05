import {cn} from "@/cn/lib/utils.ts"
import {Button} from "@/cn/components/ui/button.tsx"
import {Field, FieldDescription, FieldGroup, FieldLabel,} from "@/cn/components/ui/field.tsx"
import {InputOTP, InputOTPGroup, InputOTPSlot,} from "@/cn/components/ui/input-otp.tsx"
import React, {useContext, useRef, useState} from "react";
import {OTPInputContext} from "input-otp"
import {Loader2Icon} from "lucide-react";
import {toast} from "sonner";

interface OTPFormProps extends React.HTMLAttributes<HTMLFormElement> {
    onVerify: (otp: string) => void | Promise<void>;
    onResend?: () => void;
    length: number;
}
export const OTPForm : React.FC<OTPFormProps> = ({className, onVerify, onResend, length = 4, ...props}) => {
    const inputOTPContext = useContext(OTPInputContext)
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [resendLoading, setResendLoading] = useState(false);
    const containerRef = useRef<HTMLDivElement | null>(null)

    const getOtpValue = () => {
        // Prefer reading the rendered slot elements inside the InputOTP container using local ref.
        try {
            const container = containerRef.current
            if (container) {
                const slots = Array.from(container.querySelectorAll('[data-slot="input-otp-slot"]'))
                if (slots.length > 0) {
                    return slots.map(s => (s.textContent ?? "").trim().slice(0,1)).slice(0, length).join("")
                }
            }
            // fallback to querying by id if ref isn't available for any reason
            if (typeof document !== "undefined") {
                const docContainer = document.getElementById("otp")
                if (docContainer) {
                    const slots = Array.from(docContainer.querySelectorAll('[data-slot="input-otp-slot"]'))
                    if (slots.length > 0) {
                        return slots.map(s => (s.textContent ?? "").trim().slice(0,1)).slice(0, length).join("")
                    }
                }
            }
        } catch (err) {
            // ignore DOM errors and fallback to context
        }
        // Fallback to context (maybe empty if called before provider is ready)
        const slotsCtx = inputOTPContext?.slots ?? []
        return slotsCtx.map((s: any) => s?.char ?? "").slice(0, length).join("")
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        const otp = getOtpValue()
        console.log("OTP: ", otp)
        if (otp.length !== length) {
            setError(`Enter the ${length}-digit code.`)
            toast.error("Please enter the complete OTP code.");
            return
        }
        try {
            setLoading(true)
            await onVerify?.(otp)
            toast.success("OTP verified successfully!");
        } catch (err: any) {
            toast.error("OTP verification failed.");
        } finally {
            setLoading(false)
        }
    }
    const handleResend = async () => {
        try {
            setError(null)
            setResendLoading(true)
            onResend && onResend()
        } catch (error: any) {
            setError(error.message ?? String(error))
        } finally {
            setResendLoading(false)
        }
    }

    return (
        <form className={cn(
            "w-full max-w-xl",
            className
        )}
              onSubmit={handleSubmit}
              {...props}
        >
            <FieldGroup>
                <div className="flex flex-col items-center gap-2 text-center">
                    <h1 className="text-xl font-bold">Enter OTP</h1>
                    <FieldDescription>
                        We sent a {length}-digit code to your email address and phone number.
                    </FieldDescription>
                </div>
                <Field>
                    <FieldLabel htmlFor="otp" className="sr-only">
                        OTP
                    </FieldLabel>
                    <div ref={containerRef}>
                        <InputOTP
                            maxLength={length}
                            id="otp"
                            required
                            containerClassName="gap-4 justify-center"
                        >
                            <InputOTPGroup
                                className="gap-2.5 *:data-[slot=input-otp-slot]:h-16 *:data-[slot=input-otp-slot]:w-12 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border *:data-[slot=input-otp-slot]:text-xl">
                                {Array.from({length}).map((_, i) => (
                                    <InputOTPSlot key={i} index={i}/>
                                ))}
                            </InputOTPGroup>
                        </InputOTP>
                    </div>
                    {
                        onResend && (
                            <FieldDescription className="text-center">
                                <span>Didn&apos;t receive the code?</span>
                                <Button type="button" variant={"link"} onClick={handleResend} disabled={loading || resendLoading}>
                                    {
                                        resendLoading ? <>
                                            <Loader2Icon className={"animate-spin"} /> Resending...
                                        </> : "Resend Code"
                                    }
                                </Button>
                            </FieldDescription>
                        )
                    }
                </Field>
                {error && (
                    <div className="text-sm text-destructive text-center">{error}</div>
                )}
                <Field>
                    <Button type="submit" disabled={loading}>{loading ? "Verifying..." : "Verify"}</Button>
                </Field>
            </FieldGroup>
        </form>
    )
}

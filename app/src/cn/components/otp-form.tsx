import {cn} from "@/cn/lib/utils"
import {Button} from "@/cn/components/ui/button"
import {Field, FieldDescription, FieldGroup, FieldLabel,} from "@/cn/components/ui/field"
import {InputOTP, InputOTPGroup, InputOTPSlot,} from "@/cn/components/ui/input-otp"
import React, {useContext, useState} from "react";
import {OTPInputContext} from "input-otp"
import {Loader2Icon} from "lucide-react";

interface OTPFormProps extends React.HTMLAttributes<HTMLFormElement> {
    onVerify: (otp: string) => void | Promise<void>;
    onResend: () => void;
    length: number;
}
export const OTPForm : React.FC<OTPFormProps> = ({className, onVerify, onResend, length = 4, ...props}) => {
    const inputOTPContext = useContext(OTPInputContext)
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [resendLoading, setResendLoading] = useState(false);

    const getOtpValue = () => {
        const slots = inputOTPContext?.slots ?? []
        // join chars in order; fallback to empty string for missing slots
        return slots.map((s: any) => s?.char ?? "").slice(0, length).join("")
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        const otp = getOtpValue()
        if (otp.length !== length) {
            setError(`Enter the ${length}-digit code.`)
            return
        }
        try {
            setLoading(true)
            await onVerify?.(otp)
        } catch (err: any) {
            setError(err?.message ?? String(err))
        } finally {
            setLoading(false)
        }
    }
    const handleResend = () => {
        try {
            setResendLoading(true)
            onResend && onResend()
        } catch (error: any) {
            setError(error.message ?? String(error))
        } finally {
            setLoading(false)
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

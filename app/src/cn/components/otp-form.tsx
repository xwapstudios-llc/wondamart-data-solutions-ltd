import {cn} from "@/cn/lib/utils"
import {Button} from "@/cn/components/ui/button"
import {Field, FieldDescription, FieldGroup, FieldLabel,} from "@/cn/components/ui/field"
import {InputOTP, InputOTPGroup, InputOTPSlot,} from "@/cn/components/ui/input-otp"
import React from "react";

export function OTPForm({className, ...props}: React.ComponentProps<"form">) {
    return (
        <form className={cn(
            "w-full max-w-xl",
            className
        )}
              {...props}
        >
            <FieldGroup>
                <div className="flex flex-col items-center gap-2 text-center">
                    <h1 className="text-xl font-bold">Enter OTP</h1>
                    <FieldDescription>
                        We sent a 4-digit code to your email address and phone number.
                    </FieldDescription>
                </div>
                <Field>
                    <FieldLabel htmlFor="otp" className="sr-only">
                        OTP
                    </FieldLabel>
                    <InputOTP
                        maxLength={6}
                        id="otp"
                        required
                        containerClassName="gap-4 justify-center"
                    >
                        <InputOTPGroup
                            className="gap-2.5 *:data-[slot=input-otp-slot]:h-16 *:data-[slot=input-otp-slot]:w-12 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border *:data-[slot=input-otp-slot]:text-xl">
                            <InputOTPSlot index={0}/>
                            <InputOTPSlot index={1}/>
                            <InputOTPSlot index={2}/>
                            <InputOTPSlot index={3}/>
                        </InputOTPGroup>
                    </InputOTP>
                    <FieldDescription className="text-center">
                        Didn&apos;t receive the code? <Button variant={"link"}>Resend</Button>
                    </FieldDescription>
                </Field>
                <Field>
                    <Button type="submit">Verify</Button>
                </Field>
            </FieldGroup>
        </form>
    )
}

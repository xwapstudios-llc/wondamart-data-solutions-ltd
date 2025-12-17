import React, {useState} from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/cn/components/ui/input.tsx";
import { Checkbox } from "@/cn/components/ui/checkbox.tsx";
import { Button } from "@/cn/components/ui/button.tsx";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/cn/components/ui/select.tsx";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/cn/components/ui/form.tsx";
import { AdminUser } from "@common/admin-api/user.ts";
import { Loader2Icon, DeleteIcon } from "lucide-react";
import type { UserInfoDocument, UserWalletDocument, AdminRoleClaims } from "@common/types/user";

const updateUserSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().optional(),
    phoneNumber: z.string().regex(/^(0|\+233|233)[25][0-9]{8}$/, "Invalid phone number format").optional(),
    referralCode: z.string().optional(),
    referredBy: z.string().optional(),
    balance: z.coerce.number().min(0).optional(),
    commission: z.coerce.number().min(0).optional(),
    role: z.string().optional(),
    isAdmin: z.boolean().optional(),
});

interface UpdateUserFormProps {
    user: UserInfoDocument;
    wallet?: UserWalletDocument;
    onDoneCallback?: () => void;
}

const UpdateUserForm: React.FC<UpdateUserFormProps> = ({ user, wallet, onDoneCallback }) => {
    const [loading, setLoading] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const form = useForm<z.infer<typeof updateUserSchema>>({
        resolver: zodResolver(updateUserSchema) as never,
        defaultValues: {
            firstName: user.firstName,
            lastName: user.lastName ?? "",
            phoneNumber: user.phoneNumber ?? "",
            referralCode: user.referralCode ?? "",
            referredBy: user.referredBy ?? "",
            balance: wallet?.balance ?? 0,
            commission: wallet?.commission ?? 0,
            role: user.role ?? "",
            isAdmin: !!user.isAdmin,
        },
    });

    const onSubmit = async (values: z.infer<typeof updateUserSchema>) => {
        setLoading(true);
        try {
            // Names
            if (values.firstName !== user.firstName) {
                await AdminUser.updateFirstName(user.id, values.firstName);
            }
            if ((values.lastName ?? "") !== (user.lastName ?? "")) {
                await AdminUser.updateLastName(user.id, values.lastName ?? "");
            }

            // Phone
            if ((values.phoneNumber ?? "") !== (user.phoneNumber ?? "")) {
                await AdminUser.updatePhoneNumber(user.id, values.phoneNumber ?? "");
            }

            // Referral fields
            if ((values.referralCode ?? "") !== (user.referralCode ?? "")) {
                await AdminUser.updateReferralCode(user.id, values.referralCode ?? "");
            }
            if ((values.referredBy ?? "") !== (user.referredBy ?? "")) {
                await AdminUser.updateReferredBy(user.id, values.referredBy ?? "");
            }

            // Wallet
            if (typeof values.balance === "number" && wallet && values.balance !== wallet.balance) {
                await AdminUser.updateBalance(user.id, values.balance);
            }
            if (typeof values.commission === "number" && wallet && values.commission !== wallet.commission) {
                await AdminUser.updateCommission(user.id, values.commission);
            }

            // Role / admin
            if (values.isAdmin && !user.isAdmin) {
                await AdminUser.makeAdmin(user.id);
            } else if (!values.isAdmin && user.isAdmin) {
                await AdminUser.revokeAdmin(user.id);
            }

            const allowedRoles: AdminRoleClaims[] = ["admin", "user", "manager"];
            if ((values.role ?? "") !== (user.role ?? "")) {
                if (values.role && allowedRoles.includes(values.role as AdminRoleClaims)) {
                    await AdminUser.changeAminRole(user.id, values.role as AdminRoleClaims);
                }
            }

            setLoading(false);
            if (onDoneCallback) onDoneCallback();
        } catch (err) {
            setLoading(false);
            console.error("Failed to update user:", err);
            form.setError("firstName", { message: "Failed to update user. Please try again." });
        }
    };

    const onDelete = async () => {
        setDeleting(true);
        try {
            await AdminUser.delete(user.id);
            setDeleting(false);
            if (onDoneCallback) onDoneCallback();
        } catch (err) {
            setDeleting(false);
            console.error("Failed to delete user:", err);
            form.setError("firstName", { message: "Failed to delete user. Please try again." });
        }
    };

    const handleNumberChange = (fieldOnChange: (v: unknown) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
        let raw = e.target.value;
        if (raw.length > 1 && raw.startsWith("0") && !raw.startsWith("0.")) {
            raw = raw.replace(/^0+/, '');
        }
        const num = raw === "" ? 0 : Math.max(0, Number(raw));
        fieldOnChange(num);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name={"firstName"}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name={"lastName"}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name={"phoneNumber"}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name={"referralCode"}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Referral Code</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name={"referredBy"}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Referred By</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-2 gap-2">
                    <FormField
                        control={form.control}
                        name={"balance"}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Wallet Balance (GHC)</FormLabel>
                                <FormControl>
                                    <Input type="number" value={field.value ?? ""} onChange={handleNumberChange(field.onChange)} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name={"commission"}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Commission (GHC)</FormLabel>
                                <FormControl>
                                    <Input type="number" value={field.value ?? ""} onChange={handleNumberChange(field.onChange)} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name={"isAdmin"}
                    render={({ field }) => (
                        <FormItem className="space-y-2">
                            <div className="flex items-center gap-2">
                                <FormControl>
                                    <Checkbox checked={!!field.value} onCheckedChange={(v) => field.onChange(Boolean(v))} />
                                </FormControl>
                                <FormLabel>Is Admin</FormLabel>
                            </div>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name={"role"}
                    render={({ field }) => (
                        <FormItem>
                            <div className={"flex items-center gap-2 "}>
                                <FormLabel>Role</FormLabel>
                                <FormControl>
                                    <Select value={field.value ?? ""} onValueChange={(val) => field.onChange(val)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="admin">Admin</SelectItem>
                                            <SelectItem value="manager">Manager</SelectItem>
                                            <SelectItem value="user">User</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                            </div>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex gap-2">
                    <Button variant={"outline"} type={"button"} onClick={onDelete} className={"text-destructive"}>
                        {deleting ? <><Loader2Icon className={"animate-spin"} /> Deleting...</> : <><DeleteIcon /> Delete</>}
                    </Button>

                    <Button className="ml-auto" type="submit" disabled={loading}>
                        {loading ? <><Loader2Icon className={"animate-spin"} /> Updating...</> : "Update User"}
                    </Button>
                </div>
            </form>
        </Form>
    );
};

export default UpdateUserForm;

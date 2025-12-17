import React, {useState} from "react";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {cn} from "@/cn/lib/utils";
import {Input} from "@/cn/components/ui/input";
import {Button} from "@/cn/components/ui/button";
import {useAppStore} from "@/lib/useAppStore";
import {Link, useNavigate} from "react-router-dom";
import {R} from "@/app/routes";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/cn/components/ui/form";
import LoadingView from "../components/views/LoadingView";
import ProfilePill from "@/ui/components/user/ProfilePill.tsx";

// ✅ Validation schema
const loginSchema = z.object({
    email: z.email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginValues = z.infer<typeof loginSchema>;

type LoginFormProps = React.HTMLAttributes<HTMLFormElement>;
const LoginForm: React.FC<LoginFormProps> = ({className, ...props}) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const {login, user, logout} = useAppStore();

    const form = useForm<LoginValues>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (values: LoginValues) => {
        setLoading(true);
        try {
            await login(values.email, values.password);
            if (user) navigate(R.app.index);
        } catch (err) {
            form.setError("password", {message: err as string});
            setLoading(false);
        }
    };

    return (
        <Form {...form}>
            <form
                className={cn("grid gap-6", className)}
                onSubmit={form.handleSubmit(onSubmit)}
                {...props}
            >
                {/* Social buttons */}
                {user ? (
                    <div className="space-y-4">
                        <ProfilePill />
                        <Button
                            className="w-full"
                            size={"lg"}
                            onClick={() => navigate(R.app.index)}
                        >
                            Continue
                        </Button>
                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => logout()}
                        >
                            Logout
                        </Button>
                    </div>
                ) : loading ? (
                    <LoadingView className="h-72"/>
                ) : (
                    <>
                        {/* Email */}
                        <FormField
                            control={form.control}
                            name="email"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="email"
                                            placeholder="m@example.com"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        {/* Password */}
                        <FormField
                            control={form.control}
                            name="password"
                            render={({field}) => (
                                <FormItem>
                                    <div className="flex items-center justify-between">
                                        <FormLabel>Password</FormLabel>
                                        <Link
                                            to={R.auth.forgotPassword}
                                            className="ml-auto text-sm underline-offset-4 hover:underline"
                                        >
                                            Forgot your password?
                                        </Link>
                                    </div>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="********"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        {/* Submit */}
                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full"
                        >
                            Login
                        </Button>
                    </>
                )}
            </form>
        </Form>
    );
};

export {LoginForm};

"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../../../../@/components/ui/form";
import { Input } from "../../../../@/components/ui/input";
import { Button } from "../../../../@/components/ui/button";
import { useState } from "react";
import axios, { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";
import { useToast } from "../../../../@/components/ui/use-toast";

export default function () {
    const otpSchema = z.object({
        code: z
            .string()
            .length(6, { message: "The length of OTP is 6 digits" }),
    });
    const form = useForm<z.infer<typeof otpSchema>>({
        resolver: zodResolver(otpSchema),
        defaultValues: {
            code: "",
        },
    });
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const { toast } = useToast();
    const router = useRouter();
    const param = useParams<{ username: string }>();
    async function onSubmit(values: z.infer<typeof otpSchema>) {
        setIsSubmitting(true);
        try {
            const response = await axios.post("/api/user/verify-user", {
                username: param.username,
                code: values.code,
            });
            if (response.data.statusCode == 200) {
                toast({
                    title: "Verified",
                    description: "Your account has been verified successfully",
                });
                router.replace(`/sign-in`);
            } else {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Unexpected input from client",
                });
            }
        } catch (error) {
            const axiosError = error as AxiosError;
            toast({
                variant: "destructive",
                title: "Error",
                description:
                    (axiosError?.response?.data as { data?: string })?.data ||
                    "Unexpected data",
            });
        } finally {
            setIsSubmitting(false);
        }
    }
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-2xl font-bold tracking-tight lg:text-4xl mb-6">
                        Verification with OTP
                    </h1>
                    <p className="mb-4">Enter the OTP sent to your email</p>
                </div>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-8"
                    >
                        <FormField
                            control={form.control}
                            name="code"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Verification Code</FormLabel>
                                    <FormControl>
                                        <Input placeholder="otp" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={isSubmitting}>
                            Submit
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    );
}

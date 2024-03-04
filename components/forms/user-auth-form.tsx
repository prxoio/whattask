"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import GoogleSignInButton from "../github-auth-button";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

import { useRouter } from "next/navigation";

const formSchema = z.object({
  email: z.string().email({ message: "Enter a valid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

type UserFormValue = z.infer<typeof formSchema>;

export default function UserAuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const defaultValues = {
    email: "",
    password: "",
  };
  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (data: UserFormValue) => {
    //firebase auth logic
    const { email, password } = data;
    setLoading(true);

    if (!data) {
      return null;
    }

    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      setSuccess(true);
      setLoading(false);
      return { id: user.uid, email: user.email, name: user.displayName };
    } catch (signInError: any) {
      if (signInError.code !== "auth/user-not-found") {
        console.error(signInError);
        try {
          const { user } = await createUserWithEmailAndPassword(
            auth,
            email,
            password,
          );
          setSuccess(true);
          setLoading(false);
          return { id: user.uid, email: user.email, name: user.displayName };
        } catch (createUserError) {
          console.error(createUserError);
          setLoading(false);
          return null;
        }
      }
    }
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-2 w-full"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Enter your email..."
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter your password..."
                    disabled={loading}
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {!success && (
            <Button
              disabled={loading}
              className="ml-auto w-full mt-5"
              type="submit"
            >
              Create Account
            </Button>
          )}

          {success && (
            <Button
              disabled={loading}
              className="ml-auto w-full mt-5"
              type="button"
              onClick={() => {
                router.push("/dashboard");
              }}
            >
              Success! Continue to Dashboard
            </Button>
          )}
        </form>
      </Form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <GoogleSignInButton />
    </>
  );
}

"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { IconBrandGithub, IconBrandGoogle } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { loginUser } from "@/helper/apiCommunicator";
import useChatStore from "@/store/userStore";
import { SparklesCore } from "@/components/ui/sparkles";
import { useEffect } from "react";

const FormSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

type FormData = z.infer<typeof FormSchema>;

export function LoginForm() {
  const router = useRouter();
  const { setUser } = useChatStore();

  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: FormData) {
    try {
      const result = await loginUser(data.email, data.password);

      if (result.token) {
        setUser({
          _id: result._id,
          name: result.name,
          email: result.email,
          pic: result.pic,
          isAdmin: result.isAdmin,
          token: result.token,
        });
        localStorage.setItem("token", result.token);
        localStorage.setItem("userInfo", JSON.stringify(result));

        router.push("/chat");
      } else {
        console.error("Login failed:", result.message);
      }
    } catch (error) {
      let errorMessage = "An unexpected error occurred. Please try again.";

      if (error instanceof Error) {
        errorMessage = error.message;
      }

      console.error("Login error:", errorMessage);
    }
  }

  return (
    <div className="relative max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-black dark:bg-black border-white overflow-hidden">
      <div className="absolute inset-0 w-full h-full pointer-events-none z-10">
        <SparklesCore
          id="tsparticlesLoginForm"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={100}
          className="w-full h-full"
          particleColor="#FFFFFF"
        />
      </div>

      <p className="text-gray-300 text-sm max-w-sm mt-2 dark:text-white z-20 relative">
        Login to chat app and get connected .....
      </p>
      <Form {...form}>
        <form
          className="my-8 relative z-20"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="mb-4">
                <FormLabel htmlFor="email" className="text-white">
                  Email Address
                </FormLabel>
                <FormControl>
                  <Input
                    id="email"
                    placeholder="projectmayhem@fc.com"
                    type="email"
                    {...field}
                  />
                </FormControl>
                <FormDescription>Enter your email address.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="mb-4">
                <FormLabel htmlFor="password" className="text-white">
                  Password
                </FormLabel>
                <FormControl>
                  <Input
                    id="password"
                    placeholder="••••••••"
                    type="password"
                    {...field}
                  />
                </FormControl>
                <FormDescription>Enter your password.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="bg-gradient-to-br from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
          >
            Sign up &rarr;
          </Button>
          <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />
        </form>
      </Form>
    </div>
  );
}

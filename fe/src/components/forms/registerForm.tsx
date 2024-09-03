"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
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
import { registerUser } from "@/helper/apiCommunicator";
import useChatStore from "@/store/userStore";
import { SparklesCore } from "@/components/ui/sparkles";

const FormSchema = z.object({
  name: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

type FormData = z.infer<typeof FormSchema>;

export function RegisterForm() {
  const { setUser } = useChatStore();
  const router = useRouter();

  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: FormData) {
    try {
      const result = await registerUser(data.name, data.email, data.password);

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
        console.error("Registration failed:", result.message);
      }
    } catch (error) {
      let errorMessage = "An unexpected error occurred. Please try again.";

      if (error instanceof Error) {
        errorMessage = error.message;
      }

      console.error("Registration error:", errorMessage);
    }
  }

  return (
    <div className="relative max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-black dark:bg-black border-white overflow-hidden">
      <div className="absolute inset-0 w-full h-full pointer-events-none z-10">
        <SparklesCore
          id="tsparticlesRegisterForm"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={100}
          className="w-full h-full"
          particleColor="#FFFFFF"
        />
      </div>

      <p className="text-gray-300 text-sm max-w-sm mt-2 dark:text-white z-20 relative">
        Register to access ur chat app and connect with others
      </p>
      <Form {...form}>
        <form
          className="my-8 relative z-20"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="mb-4">
                <FormLabel htmlFor="name" className="text-white">
                  Username
                </FormLabel>
                <FormControl>
                  <Input
                    id="name"
                    placeholder="yourusername"
                    {...field}
                    className="rounded-none border-black"
                  />
                </FormControl>
                <FormDescription>Choose a unique username.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
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
                    className="rounded-none border-black"
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
                    className="rounded-none border-black"
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
            Register &rarr;
          </Button>
        </form>
      </Form>
    </div>
  );
}

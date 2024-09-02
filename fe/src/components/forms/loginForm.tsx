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
import { loginUser } from "@/helper/apiCommunicator";
import useChatStore from "@/store/userStore";
import { useEffect } from "react";
import { userInfo } from "os";
import { log } from "console";
// import { useToast } from "@/components/hooks/use-toast"
// const { toast } = useToast()
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

  // useEffect(() => {
  //   const isToken: any = localStorage.getItem("token");
  //   if (isToken) {
  //     const loggedInUser = JSON.parse(localStorage.getItem("userInfo") ?? "{}");
  //     setUser({
  //       _id: loggedInUser._id,
  //       name: loggedInUser.name,
  //       email: loggedInUser.email,
  //       pic: loggedInUser.pic,
  //       isAdmin: loggedInUser.isAdmin,
  //       token: loggedInUser.token,
  //     });
  //     localStorage.setItem("token", loggedInUser.token);
  //     router.push("/chat");
  //   } else if (!isToken) {
  //     localStorage.clear();
  //   }
  // }, []);

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

        // toast({
        //   title: "Login Successful",
        //   description: "You have successfully logged in.",
        // });

        router.push("/chat");
      } else {
        // toast({
        //   title: "Login Failed",
        //   description: result.message || "An error occurred."
        // });
      }
    } catch (error) {
      let errorMessage = "An unexpected error occurred. Please try again.";

      if (error instanceof Error) {
        errorMessage = error.message;
      }

      console.error("Login error:", error);
      // toast({
      //   title: "Login Error",
      //   description: errorMessage
      // });
    }
  }

  return (
    <div className="flex justify-center items-center">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-1/2 space-y-5 ml-10"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg font-bold">Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="your.email@example.com"
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
              <FormItem>
                <FormLabel className="text-lg font-bold">Password</FormLabel>
                <FormControl>
                  <Input placeholder="••••••••" type="password" {...field} />
                </FormControl>
                <FormDescription>Choose a secure password.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
}

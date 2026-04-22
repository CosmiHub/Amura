
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { supabase } from "@/integrations/supabase/client";
import { ALLOWED_ADMINS } from "@/constants/admins";
import { useAuth } from "@/context/AuthContext";

export default function AuthPage() {
  const { user, isAdmin } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");

  useEffect(() => {
    if (user) {
      if (isAdmin()) {
        navigate("/dashboard");
      } else {
        navigate("/");
      }
    }
  }, [user, isAdmin, navigate]);

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  const [signupForm, setSignupForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    login: { email: "", password: "" },
    signup: { email: "", password: "", confirmPassword: "" },
  });

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignupForm((prev) => ({ ...prev, [name]: value }));
  };

  const validateLoginForm = () => {
    let valid = true;
    const newErrors = { ...errors.login };

    if (!loginForm.email.trim()) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginForm.email.trim())) {
      newErrors.email = "Email format is not valid";
      valid = false;
    } else {
      newErrors.email = "";
    }

    if (!loginForm.password) {
      newErrors.password = "Password is required";
      valid = false;
    } else {
      newErrors.password = "";
    }

    setErrors((prev) => ({ ...prev, login: newErrors }));
    return valid;
  };

  const validateSignupForm = () => {
    let valid = true;
    const newErrors = { ...errors.signup };

    if (!signupForm.email.trim()) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signupForm.email.trim())) {
      newErrors.email = "Email format is not valid";
      valid = false;
    } else {
      newErrors.email = "";
    }

    if (!signupForm.password) {
      newErrors.password = "Password is required";
      valid = false;
    } else if (signupForm.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      valid = false;
    } else {
      newErrors.password = "";
    }

    if (!signupForm.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
      valid = false;
    } else if (signupForm.password !== signupForm.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      valid = false;
    } else {
      newErrors.confirmPassword = "";
    }

    setErrors((prev) => ({ ...prev, signup: newErrors }));
    return valid;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateLoginForm() || loading) return;

    setLoading(true);
    try {
      const email = loginForm.email.trim();
      const password = loginForm.password;

      // 1. Check if it's an admin from ALLOWED_ADMINS
      const adminMatch = ALLOWED_ADMINS.find(
        (admin) => admin.email.trim().toLowerCase() === email.toLowerCase() && admin.password.trim() === password.trim()
      );
      
      if (adminMatch) {
        console.log("Admin login detected:", email);
        const adminUser = {
          email: adminMatch.email,
          username: adminMatch.username,
          isAdmin: true,
          id: `admin-${adminMatch.username}`
        };
        localStorage.setItem("adminUser", JSON.stringify(adminUser));
        toast({
          title: "Admin Login Successful",
          description: `Welcome back, ${adminMatch.username}!`,
        });
        // We need to reload to trigger AuthContext refresh or manually update context
        // For simplicity, we can reload or use window.location.href
        window.location.href = "/dashboard";
        return;
      }

      // 2. Otherwise try regular Supabase login
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) throw error;

      console.log("Login successful", data);

      toast({
        title: "Login Successful",
        description: "You have successfully logged in.",
      });
      navigate("/");
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        title: "Login Failed",
        description: error.message || "Unable to log in. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateSignupForm() || loading) return;

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: signupForm.email.trim(),
        password: signupForm.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth`,
          data: {
            email: signupForm.email.trim(),
          }
        }
      });

      if (error) throw error;

      console.log("Signup successful", data);

      // If no error, but no confirmation needed (email verification disabled)
      if (data?.user) {
        toast({
          title: "Signup Successful",
          description: "Your account has been created and you are now logged in.",
        });
        navigate("/");
      } else {
        toast({
          title: "Signup Successful",
          description: "Please check your email for verification instructions.",
        });
      }
    } catch (error: any) {
      console.error("Signup error:", error);
      toast({
        title: "Signup Failed",
        description: error.message || "Unable to sign up. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-800 py-12">
      <div className="max-w-md mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome to AMURA
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Sign in or create an account to register for events
          </p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <Tabs defaultValue={activeTab} onValueChange={(value) => setActiveTab(value as "login" | "signup")}>
              <TabsList className="grid grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <CardTitle className="text-2xl">Login</CardTitle>
                <CardDescription>
                  Enter your credentials to access your account
                </CardDescription>
              </TabsContent>
              
              <TabsContent value="signup">
                <CardTitle className="text-2xl">Create Account</CardTitle>
                <CardDescription>
                  Sign up to register for upcoming events
                </CardDescription>
              </TabsContent>
            </Tabs>
          </CardHeader>
          
          <CardContent>
            {activeTab === "login" ? (
              <form className="space-y-4" onSubmit={handleLogin}>
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    name="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={loginForm.email}
                    onChange={handleLoginChange}
                    className={errors.login.email ? "border-red-500" : ""}
                  />
                  {errors.login.email && (
                    <p className="text-red-500 text-sm">{errors.login.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <Input
                    id="login-password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={loginForm.password}
                    onChange={handleLoginChange}
                    className={errors.login.password ? "border-red-500" : ""}
                  />
                  {errors.login.password && (
                    <p className="text-red-500 text-sm">{errors.login.password}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Login"}
                </Button>
              </form>
            ) : (
              <form className="space-y-4" onSubmit={handleSignup}>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    name="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={signupForm.email}
                    onChange={handleSignupChange}
                    className={errors.signup.email ? "border-red-500" : ""}
                  />
                  {errors.signup.email && (
                    <p className="text-red-500 text-sm">{errors.signup.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={signupForm.password}
                    onChange={handleSignupChange}
                    className={errors.signup.password ? "border-red-500" : ""}
                  />
                  {errors.signup.password && (
                    <p className="text-red-500 text-sm">{errors.signup.password}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-confirm-password">Confirm Password</Label>
                  <Input
                    id="signup-confirm-password"
                    name="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={signupForm.confirmPassword}
                    onChange={handleSignupChange}
                    className={errors.signup.confirmPassword ? "border-red-500" : ""}
                  />
                  {errors.signup.confirmPassword && (
                    <p className="text-red-500 text-sm">{errors.signup.confirmPassword}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? "Creating Account..." : "Create Account"}
                </Button>
              </form>
            )}
          </CardContent>
          <CardFooter className="flex justify-center text-sm text-gray-500 dark:text-gray-400">
            {activeTab === "login" ? (
              <p>
                Don't have an account?{" "}
                <Button
                  variant="link"
                  className="p-0 h-auto font-semibold"
                  onClick={() => setActiveTab("signup")}
                >
                  Sign up
                </Button>
              </p>
            ) : (
              <p>
                Already have an account?{" "}
                <Button
                  variant="link"
                  className="p-0 h-auto font-semibold"
                  onClick={() => setActiveTab("login")}
                >
                  Login
                </Button>
              </p>
            )}
          </CardFooter>
        </Card>
      </div>
      <Toaster />
    </div>
  );
}

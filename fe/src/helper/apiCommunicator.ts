
const API_URL = "http://localhost:5000/api/user";

// Define types for request and response
interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest extends LoginRequest {
  username: string;
}

interface AuthResponse {
  pic: string;
  isAdmin: boolean;
  email: string;
  name: string;
  _id: string;
  success: any;
  // Define response fields based on your backend response
  token?: string;
  message?: string;
  user?: {
    id: string;
    email: string;
    username: string;
  };
}


export async function loginUser(email: string, password: string): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const result: AuthResponse = await response.json();
    if (!response.ok) {
      throw new Error(result.message || "Login failed");
    }
    return result;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
}

export async function registerUser(name: string,email: string, password: string): Promise<AuthResponse> {
  try {
    console.log("Hii");
    const response = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({name, email, password }),
    });

    const result: AuthResponse = await response.json();
    if (!response.ok) {
      console.log(result.message);
      throw new Error(result.message || "Registration failed");
      
    }
    return result;
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
}



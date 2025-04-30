"use client"

import type React from "react"
import { useState } from "react"
import { Eye, EyeOff, Lock, User } from "lucide-react"
import { Button } from "@/app/_components/ui/button"
import { useRouter } from "next/navigation"
import { configBackendConnection, endpoints } from "@/app/services/api";
import { toast } from "react-toastify";
import { saveToStorage } from "@/app/services/storage"

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const validateForm = () => {
    const newErrors = {
      username: "",
      password: "",
    };
    let isValid = true;

    if (!username.trim()) {
      newErrors.username = "Nome de usuário é obrigatório";
      isValid = false;
    }

    if (!password) {
      newErrors.password = "Senha é obrigatória";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        `${configBackendConnection.baseURL}/${endpoints.loginToken}`,
        {
          method: "POST",
          headers: configBackendConnection.headersDefault,
          body: JSON.stringify({
            username: username,
            password: password,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        saveToStorage({ token: data.token, image: data.image });
        router.push("/");
        toast.success("Login realizado com sucesso!");
      } else {
        toast.error("Usuário ou senha inválidos");
      }
    } catch (error) {
      toast.error("Erro ao conectar com o servidor")
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Login</h1>
            <p className="text-gray-600 mt-2">
              Entre com suas credenciais para acessar
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Username field */}
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Nome de usuário
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className={`block w-full pl-10 pr-3 py-2 border ${
                      errors.username ? "border-red-500" : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500`}
                    placeholder="Digite seu nome de usuário"
                  />
                </div>
                {errors.username && (
                  <p className="mt-1 text-sm text-red-600">{errors.username}</p>
                )}
              </div>

              {/* Password field */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Senha
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`block w-full pl-10 pr-10 py-2 border ${
                      errors.password ? "border-red-500" : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500`}
                    placeholder="Digite sua senha"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="text-gray-400 hover:text-gray-500 focus:outline-none"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Lembrar-me
                  </label>
                </div>
              </div>

              <div>
                <Button
                  type="submit"
                  className="w-full bg-green-500 hover:bg-green-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  disabled={isLoading}
                >
                  {isLoading ? "Entrando..." : "Entrar"}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
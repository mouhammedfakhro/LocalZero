"use client";
import React, { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { NameValidator } from "../interface/core/validation/NameValidator";
import { EmailValidator } from "../interface/core/validation/EmailValidator";
import { PasswordValidator } from "../interface/core/validation/PasswordValidator";
import { LocationValidator } from "../interface/core/validation/LocationValidator";
import { FormProvider, useForm } from "react-hook-form";

import auth from "@/service/auth";
import { RoleValidator } from "../interface/core/validation/RoleValidator";
import { useRouter } from "next/navigation";

const AuthTabs = () => {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [registerRole, setRegisterRole] = useState("");
  const navigate = useRouter();

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerName, setRegisterName] = useState("");
  const [registerLocation, setRegisterLocation] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [locations, setLocations] = useState<{ id: number; name: string }[]>(
    []
  );
  const [loggedIn, setLoggedIn] = useState(false);
  const [emailText, setEmailText] = useState("");
  const [passText, setPassText] = useState("");

  useEffect(() => {
    const user = auth.getCurrentUser();
    console.log(user);

    if (user) navigate.replace("/home");
  }, [loggedIn]);

  const methods = useForm();


  async function loginClicked(e: React.FormEvent) {
    e.preventDefault(); // Prevents full page refresh
  
    if (!emailText || !passText) {
      alert("Please fill in email and password fields.");
    } else {
      try {
        await auth.login(emailText, passText);
        navigate.push("/home");
      } catch (error) {
        alert("Incorrect email or password");
      }
    }
  }
  

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      name: registerName,
      email: registerEmail,
      password: registerPassword,
      location: registerLocation,
      role: registerRole,
    };

    const nameValidator = new NameValidator();
    const emailValidator = new EmailValidator();
    const passwordValidator = new PasswordValidator();
    const locationValidator = new LocationValidator();
    const roleValidator = new RoleValidator();
    nameValidator
      .setNext(locationValidator)
      .setNext(roleValidator)
      .setNext(emailValidator)
      .setNext(passwordValidator);

    const error = await nameValidator.handle(data);

    if (error) {
      alert(error);
      return;
    }

    try {
      const response = await axios.post("/api/auth/register", data);
      console.log("User registered:", response.data);
      alert("Registration successful!");
    } catch (err) {
      console.error("Registration failed:", err);
      alert("Something went wrong during registration.");
    }
  };

  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await axios.get("/api/neighbourhoods");
        console.log(response.data);
        setLocations(response.data);
        setLocations;
      } catch (error) {
        console.log(error);
      }
    };

    fetch();
  }, []);

  return (
    <div className="max-w-md mx-auto mt-10 border p-6 rounded-lg shadow-sm bg-white">
      <div className="grid grid-cols-2 mb-4">
        <button
          className={`py-2 font-semibold ${
            activeTab === "login" ? "border-b-2 border-blue-600" : ""
          }`}
          onClick={() => setActiveTab("login")}
        >
          Login
        </button>
        <button
          className={`py-2 font-semibold ${
            activeTab === "register" ? "border-b-2 border-blue-600" : ""
          }`}
          onClick={() => setActiveTab("register")}
        >
          Register
        </button>
      </div>

      {activeTab === "login" && (
        <FormProvider {...methods}>
          <form onSubmit={loginClicked} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="email">
                Email
              </label>
              <input
                {...methods.register("email")}
                id="email"
                type="email"
                className="w-full border rounded px-3 py-2"
                value={emailText}
                onChange={(e) => setEmailText(e.target.value)}
                required
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="password"
              >
                Password
              </label>
              <input
                {...methods.register("password")}
                id="password"
                type="password"
                className="w-full border rounded px-3 py-2"
                value={passText}
                onChange={(e) => setPassText(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              Login
            </button>
          </form>
        </FormProvider>
      )}

      {activeTab === "register" && (
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="name">
              Name
            </label>
            <input
              id="name"
              type="text"
              className="w-full border rounded px-3 py-2"
              value={registerName}
              onChange={(e) => setRegisterName(e.target.value)}
              required
            />
          </div>

          <div>
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="location"
            >
              Location
            </label>
            <select
              id="location"
              className="w-full border rounded px-3 py-2"
              value={registerLocation}
              onChange={(e) => setRegisterLocation(e.target.value)}
              required
            >
              <option value="">Select your neighborhood</option>

              {locations.map((loc) => (
                <option key={loc.id} value={loc.name}>
                  {loc.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="role">
              Role
            </label>
            <select
              id="role"
              className="w-full border rounded px-3 py-2"
              value={registerRole}
              onChange={(e) => setRegisterRole(e.target.value)}
              required
            >
              <option value="">Select role</option>
              <option value="ORGANIZER">Organizer</option>
              <option value="RESIDENT">Resident</option>
            </select>
          </div>

          <div>
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="register-email"
            >
              Email
            </label>
            <input
              id="register-email"
              type="email"
              className="w-full border rounded px-3 py-2"
              value={registerEmail}
              onChange={(e) => setRegisterEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="register-password"
            >
              Password
            </label>
            <input
              id="register-password"
              type="password"
              className="w-full border rounded px-3 py-2"
              value={registerPassword}
              onChange={(e) => setRegisterPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            Register
          </button>
        </form>
      )}
    </div>
  );
};

export default AuthTabs;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../redux/slices/userSlice";
const isAuthenticated = () => {
    return !!localStorage.getItem("accessToken");
};

const VerificationPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.user);
    console.log("user", user);
    useEffect(() => {
        if (isAuthenticated() && user.is_verified !== 0) {
            navigate("/");
        }
    }, [navigate]);
    const [verificationCode, setVerificationCode] = useState("");
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setVerificationCode(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Тут можна додати перевірку коду верифікації
        if (verificationCode.length !== 6) {
            setError("Verification code must be 6 digits.");
        } else {
            setError("");
            // Логіка для перевірки коду
            console.log("Code submitted:", verificationCode);
        }
        api.post(`/user/verify?code=${verificationCode}`);
        const user_data = await api.get("/user/me");
        console.log(user_data.data);
        dispatch(setUser(user_data.data));
    };

    return (
        <div className="h-[100vh] w-full flex items-center justify-center bg-[#F3F4F6]">
            <div className="flex flex-col w-full max-w-[500px] mx-auto p-8 md:p-10 2xl:p-12 3xl:p-14 bg-[#ffffff] rounded-2xl shadow-xl">
                <h1 className="text-accent-purple font-bold text-3xl text-center mb-4">
                    Enter Verification Code
                </h1>

                <form className="flex flex-col" onSubmit={handleSubmit}>
                    {error && (
                        <p className="text-red-500 text-sm mb-4">{error}</p>
                    )}

                    <div className="pb-4">
                        <label className="block mb-2 text-sm font-medium text-[#111827]">
                            Verification Code
                        </label>
                        <input
                            type="text"
                            name="verificationCode"
                            maxLength="6"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-400"
                            value={verificationCode}
                            onChange={handleChange}
                            required
                            placeholder="Enter 6-digit code"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-accent-purple text-white p-3 rounded-lg"
                    >
                        Verify Code
                    </button>
                </form>
            </div>
        </div>
    );
};

export default VerificationPage;

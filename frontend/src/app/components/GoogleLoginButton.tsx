"use client";

import { GoogleLogin, CredentialResponse } from "@react-oauth/google";

interface GoogleLoginButtonProps {
    backendUrl: string;
    onAuthSuccess?: (token: string, user: any) => void;
}

const GoogleLoginButton = ({ backendUrl, onAuthSuccess }: GoogleLoginButtonProps) => {
    const handleSuccess = async (credentialResponse: CredentialResponse) => {
        if (!credentialResponse.credential) {
            console.error("Missing ID token");
            return;
        }

        try {
            const res = await fetch(`${backendUrl}/api/auth/google`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ idToken: credentialResponse.credential }),
            });

            const data = await res.json();
            if (!res.ok) {
                console.error("Google login failed", data);
                return;
            }

            localStorage.setItem("authToken", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            onAuthSuccess?.(data.token, data.user);
        } catch (err) {
            console.error("Google auth error", err);
        }
    };

    return (
        <div className="w-full mt-4 flex justify-center">
            <div className="w-full max-w-md"> {/* You can go max-w-lg or xl too */}
                <GoogleLogin
                    onSuccess={handleSuccess}
                    onError={() => console.log("Login Failed")}
                    useOneTap={false}
                    text="continue_with"
                    shape="pill"
                    theme="outline"
                    size="large"
                    width="335"
                />
            </div>
        </div>
    );
};

export default GoogleLoginButton;


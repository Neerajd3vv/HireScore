import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { NextAuthOptions } from "next-auth";

import axios from "axios";

export const nextAuthConfig: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", placeholder: "Enter your email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                try {

                    const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/auth/signin`, {
                        email: credentials?.email,
                        password: credentials?.password
                    })


                    if (response.data?.success) {
                        return {
                            id: response.data.user.id,
                            firstname: response.data.user.firstname,
                            lastname: response.data.user.lastname,
                            email: response.data.user.email,
                            imgUrl: response.data.user.imgUrl,
                            accessToken: response.data.accessToken,
                            provider: "credentials"

                        }
                    }

                    throw new Error(JSON.stringify({
                        message: response.data.error,
                        field: response.data.errorCode === "EMAIL_NOT_FOUND" ? "email" : "password"
                    }));



                } catch (error) {
                    if (axios.isAxiosError(error)) {
                        console.log(error.response?.status, error.response?.data?.error);
                        throw new Error(JSON.stringify({
                            message: error.response?.data.error || "Login failed",
                            field: error.response?.data?.errorCode === "EMAIL_NOT_FOUND" ? "email" : "password"
                        }))

                    }
                    throw new Error("Something went wrong");

                }

            }
        }),

        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || ""
        })
    ],

    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/signin"
    },


    callbacks: {

        async signIn({ user, account }) {


            if (account?.provider === "google") {
                try {

                    const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/auth/googleSignin`, {
                        firstname: user.name?.split(" ")[0] || "",
                        lastname: user.name?.split(" ")[1] || "",
                        email: user.email,
                        imgUrl: user.image,
                    })
                    user.id = response.data.id
                    user.firstname = user.name?.split(" ")[0] || ""
                    user.lastname = user.name?.split(" ")[1] || ""
                    user.imgUrl = user.image
                    user.accessToken = response.data.accessToken
                    user.provider = "google"


                } catch (error) {
                    if (axios.isAxiosError(error)) {
                        console.log(error.response?.data.error);
                    } else {
                        console.error("Error saving Google user:", error);
                    }
                    return false;
                }
            }
            return true;
        },


        async jwt({ user, token }) {
            if (user) {
                token.id = user.id;
                token.email = user.email;
                token.firstname = user.firstname;
                token.lastname = user.lastname;
                token.imgUrl = user.imgUrl;
                token.accessToken = user?.accessToken;
                token.provider = user?.provider

            }
            return token

        },
        async session({ token, session }) {
            if (session && session.user) {
                session.user = {
                    id: token.id as string | undefined | null,
                    firstname: token.firstname as string | undefined | null,
                    lastname: token.lastname as string | undefined | null,
                    email: token.email as string | undefined | null,
                    imgUrl: token.imgUrl as string | undefined | null,
                    accessToken: token.accessToken as string | undefined | null,
                    provider: token.provider as string | undefined | null,
                };
            }
            return session
        }
    }
}


// need to extend nextuth types as extAuth’s default User and Session["user"] types do not include your custom fields like id or firstname.
declare module "next-auth" {
    interface Session {
        user: {
            id: string | undefined | null;
            firstname: string | undefined | null;
            lastname: string | undefined | null;
            email: string | undefined | null;
            imgUrl: string | undefined | null;
            accessToken: string | undefined | null;
            provider: string | undefined | null;
        };
    }
    interface User {
        id: string | undefined | null;
        firstname: string | undefined | null;
        lastname: string | undefined | null;
        imgUrl: string | undefined | null;
        accessToken: string | undefined | null;
        provider: string | undefined | null;
    }
}


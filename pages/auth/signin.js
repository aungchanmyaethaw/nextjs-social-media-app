import { getProviders, signIn, getCsrfToken } from "next-auth/react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]";
import { BsGoogle } from "react-icons/bs";
export default function SignIn({ providers }) {
  return (
    <main className="flex items-center justify-center w-full min-h-screen mx-auto bg-dark-100 font-inter">
      <div className="p-4 space-y-4 rounded bg-dark-25 max-w-[20rem] w-full">
        <h1 className="text-2xl font-medium text-center text-white">Chan</h1>
        {Object.values(providers).map((provider) => (
          <div key={provider.name}>
            <button
              onClick={() => signIn(provider.id)}
              className="flex items-center gap-2 px-2 py-2 mx-auto rounded bg-primary "
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-dark-100 ">
                <BsGoogle className="text-sm text-primary" />
              </div>

              <span className="font-medium text-dark-100">
                Sign in with {provider.name}
              </span>
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (session) {
    return { redirect: { destination: "/" } };
  }

  const providers = await getProviders();

  return {
    props: { providers },
  };
}

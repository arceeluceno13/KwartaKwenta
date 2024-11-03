import React, { useEffect } from 'react';
import Head from 'next/head';
import { useSession } from "next-auth/react";
import { useFormik } from 'formik';
import { useRouter } from 'next/router';
import { signIn } from 'next-auth/react';
import TostMessage from '../components/Utils/TostMessage';
import { GetServerSideProps } from 'next';
import { getSession } from "next-auth/react";

const Login = () => {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const { data: session, status } = useSession<any>();
  


  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    onSubmit: async (values) => {
      setLoading(true);
      setError(null); // Reset error state before attempting login
      try {
        const status = await signIn('credentials', {
          email: values.email,
          password: values.password,
          redirect: false, // Prevent default redirection
        });
        if (status?.error) throw new Error(status.error);
        if (status?.ok) router.push("/");
        setLoading(false);
        TostMessage("Login Successful!", "success");
      } catch (error: any) {
        setError(error.message);
        setLoading(false);
      }
    },
  });

  return (
    <>
      <Head>
        <title>Login your account</title>
      </Head>

      <div className="w-full h-screen relative bg-gray-200 flex flex-col lg:flex-row">
        <div className="lg:w-1/2 flex flex-col justify-center items-start p-10 lg:p-20">
          <div className="text-center text-emerald-700 text-4xl md:text-6xl lg:text-8xl xl:text-[115px] font-bold font-['Poppins']">Kwarta</div>
          <div className="text-black text-lg md:text-xl lg:text-2xl xl:text-[32px] font-normal font-['Poppins'] mt-4 lg:mt-10">
            Stay on top of your finances and take<br />control of your future.
          </div>
        </div>
        <div className="lg:w-1/2 flex justify-center items-center bg-gradient-to-br from-emerald-700 to-gray-950 rounded-none lg:rounded-[41px] shadow p-10 lg:p-20">
          <div className="w-full max-w-md">
            <form onSubmit={formik.handleSubmit}>
              <div className="text-gray-200/50 text-lg md:text-xl lg:text-2xl font-normal font-['Poppins']">Email</div>
              <div className="w-full h-16 mt-2 rounded-lg border-2 border-gray-200/50">
                <input
                  type="email"
                  id="email"
                  required
                  className="w-full h-full px-3 py-2 bg-transparent focus:outline-none text-gray-200"
                  {...formik.getFieldProps("email")}
                />
                {formik.touched.email && formik.errors.email ? (
                  <div className="text-red-500 text-sm">{formik.errors.email}</div>
                ) : null}
              </div>
              <div className="text-gray-200/50 text-lg md:text-xl lg:text-2xl font-normal font-['Poppins'] mt-6">Password</div>
              <div className="w-full h-16 mt-2 rounded-lg border-2 border-gray-200/50">
                <input
                  type="password"
                  id="password"
                  required
                  className="w-full h-full px-3 py-2 bg-transparent focus:outline-none text-gray-200"
                  {...formik.getFieldProps("password")}
                />
                {formik.touched.password && formik.errors.password ? (
                  <div className="text-red-500 text-sm">{formik.errors.password}</div>
                ) : null}
              </div>
              {error && (
                <div className="text-red-500 text-sm mt-4">{error}</div>
              )}
              <button
                type="submit"
                className="w-full h-16 bg-emerald-700 text-white text-lg md:text-xl lg:text-2xl font-bold font-['Poppins'] rounded-lg shadow mt-6"
                disabled={loading} >
                {loading ? "Logging in..." : "Log in"}
              </button>

              <button
                type="button"
                className="w-full h-16 bg-emerald-700 text-white text-lg md:text-xl lg:text-2xl font-bold font-['Poppins'] rounded-lg shadow mt-6"
                disabled={loading}
                onClick={() => router.push("/signup")} >
                Sign Up
              </button>
              

            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession({ req: context.req });
  if (session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }
  return {
    props: {},
  };
}
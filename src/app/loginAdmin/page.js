import { login, signup } from '../login/actions';

export default function AdminLoginPage({ searchParams }) {
  const message = searchParams?.message;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 via-blue-600 to-purple-200">
      <div className="max-w-md w-full p-8 bg-white rounded-3xl shadow-2xl border border-purple-100 hover:shadow-purple-300 transition-shadow duration-300 ease-in-out">
        <div className="flex flex-col items-center mb-6">
          <img
            src="https://res.cloudinary.com/dsxte6o6s/image/upload/v1736059252/foto5_drbzgu.png"
            className="h-24 w-auto mb-3 drop-shadow-xl"
            alt="Sri Laundry Logo"
          />
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-black-500 to-gray-900">
           Laundry Mbak Suprih
          </h1>
        </div>

        <h2 className="text-center text-2xl font-semibold text-gray-900 mb-4">
          Login Admin
        </h2>

        {message && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-sm text-center mb-4">
            {message}
          </div>
        )}

        <form className="space-y-5" action={login}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-1">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="admin@srilaundry.com"
              className="w-full px-4 py-2 border border-purple-300 rounded-md shadow-sm focus:ring-2 focus:ring-pink-400 focus:outline-none transition duration-200"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-900 mb-1">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="••••••••"
              className="w-full px-4 py-2 border border-purple-300 rounded-md shadow-sm focus:ring-2 focus:ring-pink-400 focus:outline-none transition duration-200"
            />
          </div>

          <div className="flex gap-4 mt-6">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-500 via-black-500 to-gray-500 text-white py-2 rounded-xl font-semibold transition duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              Log in
            </button>
            <button
              formAction={signup}
              className="flex-1 bg-gradient-to-r from-gray-500 via-black-400 to-blue-500 text-white py-2 rounded-xl font-semibold transition duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              Sign up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
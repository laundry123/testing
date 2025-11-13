'use client';

import { useRouter } from 'next/navigation';

export default function SidebarAdmin() {
  const router = useRouter();

  return (
    <aside className="w-72 fixed left-0 top-16 bottom-0 bg-gray-500 px-4 py-9 text-white">
      <ul className="space-y-8 font-medium">
        {/* Dashboard */}
        <li>
          <a
            href="/admin/profilAdmin"
            className="flex items-center p-3 rounded-lg hover:bg-blue-600"
          >
            <svg
              className="w-6 h-6 text-white group-hover:text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 20V14h4v6h5v-8h3L10 0 0 12h3v8z" />
            </svg>
            <span className="ml-4">Dashboard</span>
          </a>
        </li>

        {/* Daftar Orderan */}
        <li>
          <button
            onClick={() => router.push("/admin/konfirmasi")}
            className="flex items-center p-3 rounded-lg hover:bg-blue-600 w-full text-left"
          >
            <svg
              className="w-6 h-6 text-white group-hover:text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Zm-10 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10 11.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z" />
            </svg>
            <span className="ml-4">Daftar Orderan</span>
          </button>
        </li>

        {/* Tambah Paket */}
        <li>
          <a
            href="/admin/tambahPaket"
            className="flex items-center p-3 rounded-lg hover:bg-blue-600"
          >
            <svg
              className="w-6 h-6 text-white group-hover:text-white"
              fill="currentColor"
              viewBox="0 0 18 18"
            >
              <path d="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Zm-10 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10 11.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z" />
            </svg>
            <span className="ml-4">Tambah Pelanggan</span>
          </a>
        </li>

        {/* 🧾 Laporan */}
        <li>
          <button
            onClick={() => router.push("/admin/laporan")}
            className="flex items-center p-3 rounded-lg hover:bg-blue-600 w-full text-left"
          >
            <svg
              className="w-6 h-6 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M4 4h16v2H4zm0 5h10v2H4zm0 5h16v2H4zm0 5h10v2H4z" />
            </svg>
            <span className="ml-4">Laporan</span>
          </button>
        </li>

        {/* Logout */}
        <li>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full"
            onClick={() => {
              alert("Logout berhasil!");
              router.push("/");
            }}
          >
            Logout
          </button>
        </li>
      </ul>
    </aside>
  );
}

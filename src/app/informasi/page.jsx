'use server';

import { createClient } from "../../utils/Supabase/server";

export default async function Informasi() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("User not logged in:", userError);
    return <p className="text-center text-red-500">Anda belum login.</p>;
  }

  const { data: orders, error: ordersError } = await supabase
    .from("pemesanan")
    .select(`
      id,
      nama,
      nomorTlp,
      alamat,
      status,
      tanggalLaundry,
      tanggalSelesai,
      berat_kg,
      paket:paket_id (
        id,
        nama,
        harga
      )
    `)
    .eq("user_id", user.id);

  if (ordersError) {
    console.error("Error fetching orders:", ordersError);
    return (
      <p className="text-red-500 text-center">
        Gagal mengambil data pesanan. Silakan coba lagi.
      </p>
    );
  }

  if (!orders || orders.length === 0) {
    return <p className="text-center text-gray-500">Anda belum memiliki pesanan.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {orders.map((order) => (
        <div key={order.id} className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">{order.nama}</h2>
          <p className="text-sm text-blue-500 mb-2"><strong>Nomor Tlp:</strong> {order.nomorTlp}</p>
          <p className="text-sm text-blue-500 mb-2"><strong>Alamat:</strong> {order.alamat}</p>
          <p className="text-sm text-blue-500 mb-2"><strong>Paket:</strong> {order.paket?.nama}</p>
          <p className="text-sm text-blue-500 mb-2"><strong>Berat Kilogram:</strong> {order.berat_kg ? `${order.berat_kg} kg` : '-'}</p>
          <p className="text-sm text-blue-500 mb-2"><strong>Tanggal Laundry:</strong> {order.tanggalLaundry ?? '-'}</p>
          <p className="text-sm text-blue-500 mb-2"><strong>Tanggal Selesai:</strong> {order.tanggalSelesai ?? '-'}</p>
          <p className="text-sm text-blue-500 mb-2"><strong>Total Harga : </strong>
            Rp. {
              order.berat_kg && order.paket?.harga
                ? (order.berat_kg * order.paket.harga).toLocaleString()
                : '-'
            }
          </p>
          <p className="text-sm text-gray-900"><strong>Status:</strong> {order.status}</p>
        </div>
      ))}
    </div>
  );
}
